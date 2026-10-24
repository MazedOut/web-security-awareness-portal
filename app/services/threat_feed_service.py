"""
app/services/threat_feed_service.py
Server-side Cybersecurity Threat Intelligence Feed Aggregator for Chakravyuh.

Aggregates, normalizes, deduplicates, and caches genuine threat intelligence
from reputable public sources:
1. CISA Known Exploited Vulnerabilities (KEV) Catalog (JSON API)
2. CISA Cybersecurity Advisories (RSS / XML)
3. NVD CVE API 2.0 (REST JSON)
4. The Hacker News (RSS / XML)
5. BleepingComputer (RSS / XML)

Features:
- Normalized schema with severity, CVSS scores, categories, and item types.
- Strict deduplication by CVE ID, canonical URL, or stable identifier.
- Server-side caching with 10-minute TTL (configurable) and manual refresh throttling.
- Resilient error handling: source timeouts and HTTP errors never crash the feed;
  cached entries are preserved across temporary outages.
- Truthful data attribution: "is_actively_exploited" is set ONLY when confirmed
  by authoritative sources (e.g., CISA KEV).
- Input sanitization: strips raw HTML, validates URLs, prevents SSRF.
"""

import os
import re
import html
import json
import time
import email.utils
import hashlib
import logging
import threading
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any, Tuple
from urllib.parse import urlparse

import requests

logger = logging.getLogger(__name__)

# Cache configuration
DEFAULT_CACHE_TTL_SECONDS = int(os.environ.get("THREAT_FEED_CACHE_TTL", 600))  # 10 minutes
MANUAL_REFRESH_COOLDOWN_SECONDS = int(os.environ.get("THREAT_FEED_REFRESH_COOLDOWN", 60))  # 60s
REQUEST_TIMEOUT_SECONDS = int(os.environ.get("THREAT_FEED_TIMEOUT", 10))
USER_AGENT = "Chakravyuh-ThreatFeed/1.0 (+https://github.com/MazedOut/web-security-awareness-portal)"

# Upstream Source URLs
CISA_KEV_URL = os.environ.get(
    "CISA_KEV_URL",
    "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"
)
CISA_ADVISORIES_RSS_URL = os.environ.get(
    "CISA_ADVISORIES_RSS_URL",
    "https://www.cisa.gov/cybersecurity-advisories/all.xml"
)
NVD_API_BASE_URL = os.environ.get(
    "NVD_API_BASE_URL",
    "https://services.nvd.nist.gov/rest/json/cves/2.0"
)
THN_RSS_URL = os.environ.get(
    "THN_RSS_URL",
    "https://feeds.feedburner.com/TheHackersNews"
)
BLEEPING_RSS_URL = os.environ.get(
    "BLEEPING_RSS_URL",
    "https://www.bleepingcomputer.com/feed/"
)

# Standard threat categories
CATEGORY_ACTIVELY_EXPLOITED = "Actively Exploited CVEs"
CATEGORY_WEB_APPS_SHELLS = "Web Applications & Web Shells"
CATEGORY_CRITICAL_VULNS = "Critical Vulnerabilities"
CATEGORY_RANSOMWARE_MALWARE = "Ransomware & Malware"
CATEGORY_PHISHING_SOCIAL = "Phishing & Social Engineering"
CATEGORY_CLOUD_SUPPLY = "Cloud & Supply Chain"
CATEGORY_ADVISORIES = "Security Advisories"

ALL_CATEGORIES = [
    CATEGORY_ACTIVELY_EXPLOITED,
    CATEGORY_WEB_APPS_SHELLS,
    CATEGORY_CRITICAL_VULNS,
    CATEGORY_RANSOMWARE_MALWARE,
    CATEGORY_PHISHING_SOCIAL,
    CATEGORY_CLOUD_SUPPLY,
    CATEGORY_ADVISORIES,
]

# Standard severities
SEV_CRITICAL = "Critical"
SEV_HIGH = "High"
SEV_MEDIUM = "Medium"
SEV_LOW = "Low"
SEV_INFO = "Informational"

# Item types
TYPE_ADVISORY = "advisory"
TYPE_INCIDENT = "incident"
TYPE_RESEARCH = "research"

# Regex for CVE extraction
CVE_PATTERN = re.compile(r"CVE-\d{4}-\d{4,7}", re.IGNORECASE)
HTML_TAG_PATTERN = re.compile(r"<[^>]+>")


def sanitize_text(text: Optional[str]) -> str:
    """Strips HTML tags, decodes entities, and strips extra whitespace."""
    if not text:
        return ""
    # Strip HTML tags
    clean = HTML_TAG_PATTERN.sub(" ", text)
    # Unescape HTML entities
    clean = html.unescape(clean)
    # Normalize whitespace
    clean = re.sub(r"\s+", " ", clean).strip()
    return clean


def is_safe_url(url: Optional[str]) -> bool:
    """Validate that URL is http or https to prevent SSRF and javascript: URIs."""
    if not url:
        return False
    try:
        parsed = urlparse(url)
        return parsed.scheme in ("http", "https") and bool(parsed.netloc)
    except Exception:
        return False


def parse_rfc822_date(date_str: Optional[str]) -> str:
    """Parse RFC 822/2822 dates from RSS feeds and normalize to ISO UTC string."""
    if not date_str:
        return datetime.now(timezone.utc).isoformat()
    try:
        parsed = email.utils.parsedate_to_datetime(date_str)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc).isoformat()
    except Exception:
        return datetime.now(timezone.utc).isoformat()


def classify_category(title: str, summary: str, is_kev: bool = False) -> str:
    """
    Classify a threat into one of the designated categories based on verified content.
    """
    combined = f"{title} {summary}".lower()

    # Web Applications and Web Shells
    web_shell_keywords = [
        "php", "web shell", "webshell", "rce", "remote code execution",
        "sql injection", "sqli", "cross-site scripting", "xss", "ssrf",
        "arbitrary file", "file upload", "deserialization", "command injection",
        "apache", "nginx", "wordpress", "joomla", "drupal", "web server"
    ]
    if any(kw in combined for kw in web_shell_keywords):
        return CATEGORY_WEB_APPS_SHELLS

    # Ransomware & Malware
    malware_keywords = [
        "ransomware", "malware", "trojan", "botnet", "infostealer", "stealer",
        "backdoor", "spyware", "keylogger", "c2", "command and control",
        "payload", "wiper", "rootkit", "bootkit"
    ]
    if any(kw in combined for kw in malware_keywords):
        return CATEGORY_RANSOMWARE_MALWARE

    # Phishing & Social Engineering
    phishing_keywords = [
        "phishing", "smishing", "vishing", "bec", "business email compromise",
        "social engineering", "credential harvesting", "credential stuffing",
        "deepfake", "impersonation", "fake login"
    ]
    if any(kw in combined for kw in phishing_keywords):
        return CATEGORY_PHISHING_SOCIAL

    # Cloud, Identity, Supply Chain
    cloud_keywords = [
        "cloud", "aws", "azure", "gcp", "kubernetes", "k8s", "supply chain",
        "npm", "pypi", "github", "identity", "oauth", "saml", "jwt", "docker",
        "dependency", "pipeline"
    ]
    if any(kw in combined for kw in cloud_keywords):
        return CATEGORY_CLOUD_SUPPLY

    # Actively exploited CVEs (KEV or explicitly confirmed exploited in the wild)
    if is_kev or "actively exploited" in combined or "in-the-wild" in combined:
        return CATEGORY_ACTIVELY_EXPLOITED

    # Critical Vulnerabilities
    if "critical" in combined or "zero-day" in combined or "0-day" in combined:
        return CATEGORY_CRITICAL_VULNS

    return CATEGORY_ADVISORIES


def infer_severity(
    cvss: Optional[float] = None,
    text: str = "",
    is_kev: bool = False
) -> str:
    """Determine normalized severity rating."""
    if cvss is not None and cvss > 0:
        if cvss >= 9.0:
            return SEV_CRITICAL
        elif cvss >= 7.0:
            return SEV_HIGH
        elif cvss >= 4.0:
            return SEV_MEDIUM
        return SEV_LOW

    t = text.lower()
    if any(k in t for k in ["critical", "zero-day", "0-day", "unauthenticated rce"]):
        return SEV_CRITICAL
    if is_kev or any(k in t for k in ["high", "actively exploited", "privilege escalation", "arbitrary code execution"]):
        return SEV_HIGH
    if any(k in t for k in ["medium", "moderate", "cross-site scripting", "spoofing"]):
        return SEV_MEDIUM
    if any(k in t for k in ["low", "informational"]):
        return SEV_LOW

    return SEV_HIGH if is_kev else SEV_MEDIUM


class ThreatFeedAggregator:
    """Thread-safe feed aggregator and cache manager."""

    def __init__(self, cache_file_path: Optional[str] = None):
        self._lock = threading.Lock()
        self._cache_file = cache_file_path or os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "..", "..", "instance", "threat_feed_cache.json"
        )
        self._cached_items: List[Dict[str, Any]] = []
        self._last_sync_time: Optional[datetime] = None
        self._last_refresh_attempt: float = 0
        self._source_statuses: Dict[str, Dict[str, Any]] = {
            "cisa_kev": {"name": "CISA Known Exploited Vulnerabilities", "status": "pending", "items": 0, "last_success": None},
            "nvd_cves": {"name": "NVD CVE API 2.0", "status": "pending", "items": 0, "last_success": None},
            "cisa_advisories": {"name": "CISA Cybersecurity Advisories", "status": "pending", "items": 0, "last_success": None},
            "thn_news": {"name": "The Hacker News", "status": "pending", "items": 0, "last_success": None},
            "bleeping_news": {"name": "BleepingComputer", "status": "pending", "items": 0, "last_success": None},
        }

        # Attempt to load persistent cache at startup
        self._load_from_disk()

    # -------------------------------------------------------------------------
    # Disk Cache Persistence
    # -------------------------------------------------------------------------

    def _load_from_disk(self):
        """Loads cached feed entries from disk if present."""
        try:
            if os.path.exists(self._cache_file) and os.path.getsize(self._cache_file) > 0:
                with open(self._cache_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self._cached_items = data.get("items", [])
                    ts = data.get("last_sync")
                    if ts:
                        self._last_sync_time = datetime.fromisoformat(ts)
                    self._source_statuses.update(data.get("source_statuses", {}))
                    logger.info("Loaded %d cached threat feed items from disk.", len(self._cached_items))
        except Exception as e:
            logger.warning("Could not load threat feed cache from disk: %s", e)

    def _save_to_disk(self):
        """Persists current cached feed entries to disk."""
        try:
            os.makedirs(os.path.dirname(os.path.abspath(self._cache_file)), exist_ok=True)
            with open(self._cache_file, "w", encoding="utf-8") as f:
                json.dump({
                    "last_sync": self._last_sync_time.isoformat() if self._last_sync_time else None,
                    "items_count": len(self._cached_items),
                    "source_statuses": self._source_statuses,
                    "items": self._cached_items,
                }, f, indent=2)
        except Exception as e:
            logger.warning("Could not persist threat feed cache to disk: %s", e)

    # -------------------------------------------------------------------------
    # Source Fetchers
    # -------------------------------------------------------------------------

    def _fetch_cisa_kev(self, session: requests.Session) -> List[Dict[str, Any]]:
        """
        Fetch CISA Known Exploited Vulnerabilities catalog (JSON).
        Every entry in this catalog is verified actively exploited in the wild.
        """
        items: List[Dict[str, Any]] = []
        try:
            resp = session.get(CISA_KEV_URL, timeout=REQUEST_TIMEOUT_SECONDS)
            resp.raise_for_status()
            data = resp.json()
            vulns = data.get("vulnerabilities", [])

            # Take the latest 50 entries (catalog is ordered chronologically by default, latest at bottom or top)
            # Sort descending by dateAdded
            sorted_vulns = sorted(
                vulns,
                key=lambda x: x.get("dateAdded", ""),
                reverse=True
            )[:50]

            for v in sorted_vulns:
                cve_id = sanitize_text(v.get("cveID", ""))
                title = sanitize_text(v.get("vulnerabilityName") or f"{cve_id} Exploit")
                summary = sanitize_text(v.get("shortDescription") or "")
                vendor = sanitize_text(v.get("vendorProject") or "")
                product = sanitize_text(v.get("product") or "")
                date_added = v.get("dateAdded") or datetime.now(timezone.utc).strftime("%Y-%m-%d")
                action = sanitize_text(v.get("requiredAction") or "")
                notes = sanitize_text(v.get("notes") or "")

                # Normalise date to ISO string
                try:
                    pub_iso = datetime.strptime(date_added, "%Y-%m-%d").replace(tzinfo=timezone.utc).isoformat()
                except Exception:
                    pub_iso = datetime.now(timezone.utc).isoformat()

                category = classify_category(title, summary, is_kev=True)

                item = {
                    "id": f"cve-{cve_id.lower()}",
                    "title": title,
                    "summary": summary,
                    "severity": SEV_CRITICAL if "ransomware" in v.get("knownRansomwareCampaignUse", "").lower() else SEV_HIGH,
                    "cvss_score": None,
                    "cve_id": cve_id,
                    "vendor": vendor,
                    "product": product,
                    "category": category,
                    "item_type": TYPE_ADVISORY,
                    "is_actively_exploited": True,  # Autoritatively confirmed by CISA KEV
                    "published_at": pub_iso,
                    "fetched_at": datetime.now(timezone.utc).isoformat(),
                    "source_name": "CISA KEV",
                    "source_url": "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
                    "required_action": action,
                    "notes": notes,
                }
                items.append(item)

            self._source_statuses["cisa_kev"] = {
                "name": "CISA Known Exploited Vulnerabilities",
                "status": "ok",
                "items": len(items),
                "last_success": datetime.now(timezone.utc).isoformat()
            }
            logger.info("Successfully fetched %d items from CISA KEV.", len(items))
        except Exception as e:
            logger.warning("CISA KEV fetch failed: %s", e)
            self._source_statuses["cisa_kev"]["status"] = "error"
            self._source_statuses["cisa_kev"]["error"] = str(e)
        return items

    def _fetch_nvd_cves(self, session: requests.Session) -> List[Dict[str, Any]]:
        """
        Fetch recent CVEs from NVD CVE API 2.0 (REST JSON).
        Uses a bounded resultsPerPage to respect API limits.
        """
        items: List[Dict[str, Any]] = []
        try:
            headers = {"User-Agent": USER_AGENT}
            nvd_key = os.environ.get("NVD_API_KEY")
            if nvd_key:
                headers["apiKey"] = nvd_key

            url = f"{NVD_API_BASE_URL}?resultsPerPage=25"
            resp = session.get(url, headers=headers, timeout=REQUEST_TIMEOUT_SECONDS)
            resp.raise_for_status()
            data = resp.json()

            for item_data in data.get("vulnerabilities", []):
                cve_data = item_data.get("cve", {})
                cve_id = sanitize_text(cve_data.get("id", ""))
                if not cve_id:
                    continue

                # Extract description
                descriptions = cve_data.get("descriptions", [])
                summary = ""
                for d in descriptions:
                    if d.get("lang") == "en":
                        summary = sanitize_text(d.get("value", ""))
                        break
                if not summary and descriptions:
                    summary = sanitize_text(descriptions[0].get("value", ""))

                # Extract metrics (CVSS v3.1, v3.0, or v2)
                metrics = cve_data.get("metrics", {})
                cvss_score = None
                cvss_severity = None
                if "cvssMetricV31" in metrics and metrics["cvssMetricV31"]:
                    cvss_data = metrics["cvssMetricV31"][0].get("cvssData", {})
                    cvss_score = cvss_data.get("baseScore")
                    cvss_severity = cvss_data.get("baseSeverity")
                elif "cvssMetricV30" in metrics and metrics["cvssMetricV30"]:
                    cvss_data = metrics["cvssMetricV30"][0].get("cvssData", {})
                    cvss_score = cvss_data.get("baseScore")
                    cvss_severity = cvss_data.get("baseSeverity")

                pub_date = cve_data.get("published", "")
                try:
                    pub_iso = datetime.fromisoformat(pub_date.replace("Z", "+00:00")).astimezone(timezone.utc).isoformat()
                except Exception:
                    pub_iso = datetime.now(timezone.utc).isoformat()

                # Extract vendor/product from configurations or descriptions
                vendor = ""
                product = ""
                try:
                    nodes = cve_data.get("configurations", [{}])[0].get("nodes", [])
                    if nodes and "cpeMatch" in nodes[0] and nodes[0]["cpeMatch"]:
                        cpe_str = nodes[0]["cpeMatch"][0].get("criteria", "")
                        # format: cpe:2.3:a:vendor:product:...
                        parts = cpe_str.split(":")
                        if len(parts) > 5:
                            vendor = parts[3].capitalize()
                            product = parts[4].replace("_", " ").capitalize()
                except Exception:
                    pass

                # Derive title
                title = f"{vendor} {product} {cve_id} Vulnerability".strip()
                if not vendor and not product:
                    title = f"{cve_id} Security Vulnerability"

                severity = infer_severity(cvss=cvss_score, text=summary, is_kev=False)
                category = classify_category(title, summary, is_kev=False)

                items.append({
                    "id": f"cve-{cve_id.lower()}",
                    "title": title,
                    "summary": summary,
                    "severity": severity,
                    "cvss_score": cvss_score,
                    "cve_id": cve_id,
                    "vendor": vendor,
                    "product": product,
                    "category": category,
                    "item_type": TYPE_ADVISORY,
                    "is_actively_exploited": False,
                    "published_at": pub_iso,
                    "fetched_at": datetime.now(timezone.utc).isoformat(),
                    "source_name": "NVD (NIST)",
                    "source_url": f"https://nvd.nist.gov/vuln/detail/{cve_id}",
                    "required_action": "Consult vendor advisory and apply available updates.",
                    "notes": "",
                })

            self._source_statuses["nvd_cves"] = {
                "name": "NVD CVE API 2.0",
                "status": "ok",
                "items": len(items),
                "last_success": datetime.now(timezone.utc).isoformat()
            }
            logger.info("Successfully fetched %d items from NVD CVE API.", len(items))
        except Exception as e:
            logger.warning("NVD CVE fetch failed: %s", e)
            self._source_statuses["nvd_cves"]["status"] = "error"
            self._source_statuses["nvd_cves"]["error"] = str(e)
        return items

    def _fetch_cisa_advisories(self, session: requests.Session) -> List[Dict[str, Any]]:
        """
        Fetch CISA Cybersecurity Advisories RSS XML.
        Handled with timeout and graceful fallback if blocked by CDN bot detection.
        """
        items: List[Dict[str, Any]] = []
        try:
            import xml.etree.ElementTree as ET
            headers = {"User-Agent": USER_AGENT}
            resp = session.get(CISA_ADVISORIES_RSS_URL, headers=headers, timeout=REQUEST_TIMEOUT_SECONDS)
            resp.raise_for_status()

            root = ET.fromstring(resp.content)
            for item_elem in root.findall(".//item"):
                title_elem = item_elem.find("title")
                link_elem = item_elem.find("link")
                pubdate_elem = item_elem.find("pubDate")
                desc_elem = item_elem.find("description")

                title = sanitize_text(title_elem.text if title_elem is not None else "")
                link = link_elem.text.strip() if link_elem is not None and link_elem.text else ""
                summary = sanitize_text(desc_elem.text if desc_elem is not None else "")
                pub_iso = parse_rfc822_date(pubdate_elem.text if pubdate_elem is not None else None)

                if not title:
                    continue

                cve_match = CVE_PATTERN.search(f"{title} {summary}")
                cve_id = cve_match.group(0).upper() if cve_match else None
                item_id = f"cve-{cve_id.lower()}" if cve_id else f"cisa-adv-{hashlib.sha256(link.encode()).hexdigest()[:10]}"

                category = classify_category(title, summary, is_kev=False)
                severity = infer_severity(text=f"{title} {summary}")

                items.append({
                    "id": item_id,
                    "title": title,
                    "summary": summary,
                    "severity": severity,
                    "cvss_score": None,
                    "cve_id": cve_id,
                    "vendor": "US Government",
                    "product": "CISA Alert",
                    "category": category,
                    "item_type": TYPE_ADVISORY,
                    "is_actively_exploited": False,
                    "published_at": pub_iso,
                    "fetched_at": datetime.now(timezone.utc).isoformat(),
                    "source_name": "CISA Advisories",
                    "source_url": link if is_safe_url(link) else "https://www.cisa.gov/cybersecurity-advisories",
                    "required_action": "Review CISA advisory recommendations.",
                    "notes": "",
                })

            self._source_statuses["cisa_advisories"] = {
                "name": "CISA Cybersecurity Advisories",
                "status": "ok",
                "items": len(items),
                "last_success": datetime.now(timezone.utc).isoformat()
            }
            logger.info("Successfully fetched %d items from CISA Advisories RSS.", len(items))
        except Exception as e:
            logger.info("CISA Advisories RSS unreachable or restricted (%s); continuing with KEV and News feeds.", e)
            self._source_statuses["cisa_advisories"]["status"] = "degraded"
            self._source_statuses["cisa_advisories"]["error"] = str(e)
        return items

    def _fetch_rss_feed(
        self,
        session: requests.Session,
        url: str,
        source_key: str,
        source_name: str,
        default_item_type: str = TYPE_INCIDENT
    ) -> List[Dict[str, Any]]:
        """Fetch and parse standard RSS feed (The Hacker News, BleepingComputer, etc.)."""
        items: List[Dict[str, Any]] = []
        try:
            import xml.etree.ElementTree as ET
            headers = {"User-Agent": USER_AGENT}
            resp = session.get(url, headers=headers, timeout=REQUEST_TIMEOUT_SECONDS)
            resp.raise_for_status()

            root = ET.fromstring(resp.content)
            for item_elem in root.findall(".//item"):
                title_elem = item_elem.find("title")
                link_elem = item_elem.find("link")
                pubdate_elem = item_elem.find("pubDate")
                desc_elem = item_elem.find("description")

                title = sanitize_text(title_elem.text if title_elem is not None else "")
                link = link_elem.text.strip() if link_elem is not None and link_elem.text else ""
                summary = sanitize_text(desc_elem.text if desc_elem is not None else "")
                pub_iso = parse_rfc822_date(pubdate_elem.text if pubdate_elem is not None else None)

                if not title:
                    continue

                cve_match = CVE_PATTERN.search(f"{title} {summary}")
                cve_id = cve_match.group(0).upper() if cve_match else None
                item_id = f"cve-{cve_id.lower()}" if cve_id else f"{source_key}-{hashlib.sha256(link.encode()).hexdigest()[:10]}"

                category = classify_category(title, summary, is_kev=False)
                severity = infer_severity(text=f"{title} {summary}")

                # Distinguish incident vs research
                item_type = default_item_type
                if any(w in title.lower() for w in ["research", "analysis", "discovers", "poc", "flaw in"]):
                    item_type = TYPE_RESEARCH
                elif any(w in title.lower() for w in ["advisory", "patch", "releases update"]):
                    item_type = TYPE_ADVISORY

                items.append({
                    "id": item_id,
                    "title": title,
                    "summary": summary,
                    "severity": severity,
                    "cvss_score": None,
                    "cve_id": cve_id,
                    "vendor": "",
                    "product": "",
                    "category": category,
                    "item_type": item_type,
                    "is_actively_exploited": False,
                    "published_at": pub_iso,
                    "fetched_at": datetime.now(timezone.utc).isoformat(),
                    "source_name": source_name,
                    "source_url": link if is_safe_url(link) else url,
                    "required_action": "Read full incident investigation report.",
                    "notes": "",
                })

            self._source_statuses[source_key] = {
                "name": source_name,
                "status": "ok",
                "items": len(items),
                "last_success": datetime.now(timezone.utc).isoformat()
            }
            logger.info("Successfully fetched %d items from %s.", len(items), source_name)
        except Exception as e:
            logger.warning("%s fetch failed: %s", source_name, e)
            if source_key not in self._source_statuses:
                self._source_statuses[source_key] = {"name": source_name, "status": "error", "items": 0}
            else:
                self._source_statuses[source_key]["status"] = "error"
            self._source_statuses[source_key]["error"] = str(e)
        return items

    # -------------------------------------------------------------------------
    # Deduplication and Merging
    # -------------------------------------------------------------------------

    def _merge_and_deduplicate(self, all_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Deduplicates items by CVE ID or canonical URL, merging authoritative
        exploitation flags and CVSS metrics where applicable.
        """
        dedup_map: Dict[str, Dict[str, Any]] = {}

        for item in all_items:
            key = item["id"]

            if key in dedup_map:
                existing = dedup_map[key]
                # If either says actively exploited, keep True
                if item.get("is_actively_exploited"):
                    existing["is_actively_exploited"] = True
                # If incoming item has CVSS and existing does not, take it
                if item.get("cvss_score") is not None and existing.get("cvss_score") is None:
                    existing["cvss_score"] = item["cvss_score"]
                    existing["severity"] = item["severity"]
                # If incoming has vendor/product and existing does not, take it
                if item.get("vendor") and not existing.get("vendor"):
                    existing["vendor"] = item["vendor"]
                if item.get("product") and not existing.get("product"):
                    existing["product"] = item["product"]
                if item.get("required_action") and not existing.get("required_action"):
                    existing["required_action"] = item["required_action"]
            else:
                dedup_map[key] = item

        # Sort combined list by published_at descending
        merged = list(dedup_map.values())
        merged.sort(key=lambda x: x.get("published_at", ""), reverse=True)
        return merged

    # -------------------------------------------------------------------------
    # Public Aggregation & Retrieval API
    # -------------------------------------------------------------------------

    def sync_feeds(self, force: bool = False) -> Tuple[List[Dict[str, Any]], bool]:
        """
        Synchronizes all threat feeds if TTL has expired or force=True.
        Returns (items, is_freshly_synced).
        """
        now = time.time()

        with self._lock:
            # Respect TTL unless forced
            if not force and self._cached_items and self._last_sync_time:
                elapsed = (datetime.now(timezone.utc) - self._last_sync_time).total_seconds()
                if elapsed < DEFAULT_CACHE_TTL_SECONDS:
                    return self._cached_items, False

            # Throttle manual refresh requests
            if force and (now - self._last_refresh_attempt) < MANUAL_REFRESH_COOLDOWN_SECONDS:
                logger.info("Manual refresh throttled: cooldown active.")
                return self._cached_items, False

            self._last_refresh_attempt = now

        # Fetch in parallel or sequential using pooled requests Session
        new_items: List[Dict[str, Any]] = []
        session = requests.Session()
        session.headers.update({"User-Agent": USER_AGENT})

        try:
            # 1. CISA KEV (authoritative for actively exploited CVEs)
            cisa_kev_items = self._fetch_cisa_kev(session)
            new_items.extend(cisa_kev_items)

            # 2. NVD CVE API 2.0 (authoritative for CVSS metrics)
            nvd_items = self._fetch_nvd_cves(session)
            new_items.extend(nvd_items)

            # 3. CISA Advisories RSS
            cisa_adv_items = self._fetch_cisa_advisories(session)
            new_items.extend(cisa_adv_items)

            # 4. The Hacker News (security news, ransomware, web shell incidents)
            thn_items = self._fetch_rss_feed(
                session, THN_RSS_URL, "thn_news", "The Hacker News", default_item_type=TYPE_INCIDENT
            )
            new_items.extend(thn_items)

            # 5. BleepingComputer (threat research, vendor advisories)
            bleeping_items = self._fetch_rss_feed(
                session, BLEEPING_RSS_URL, "bleeping_news", "BleepingComputer", default_item_type=TYPE_INCIDENT
            )
            new_items.extend(bleeping_items)

        finally:
            session.close()

        with self._lock:
            if new_items:
                merged = self._merge_and_deduplicate(new_items)
                self._cached_items = merged
                self._last_sync_time = datetime.now(timezone.utc)
                self._save_to_disk()
                return self._cached_items, True
            else:
                # If network completely failed, return existing cached items
                logger.warning("No new items returned from any feed; retaining cached items.")
                return self._cached_items, False

    def get_feed(
        self,
        search: Optional[str] = None,
        category: Optional[str] = None,
        severity: Optional[str] = None,
        item_type: Optional[str] = None,
        actively_exploited_only: bool = False,
        sort_by: str = "newest",  # 'newest' or 'severity'
        page: int = 1,
        per_page: int = 12,
        force_refresh: bool = False
    ) -> Dict[str, Any]:
        """
        Query the normalized, aggregated threat feed with searching, filtering,
        sorting, and pagination.
        """
        items, freshly_synced = self.sync_feeds(force=force_refresh)

        # Apply Filters
        filtered = items

        # Actively exploited only
        if actively_exploited_only:
            filtered = [i for i in filtered if i.get("is_actively_exploited")]

        # Category filter
        if category and category.lower() != "all":
            cat_lower = category.lower()
            filtered = [i for i in filtered if i.get("category", "").lower() == cat_lower]

        # Severity filter
        if severity and severity.lower() != "all":
            sev_lower = severity.lower()
            filtered = [i for i in filtered if i.get("severity", "").lower() == sev_lower]

        # Item type filter
        if item_type and item_type.lower() != "all":
            type_lower = item_type.lower()
            filtered = [i for i in filtered if i.get("item_type", "").lower() == type_lower]

        # Search query
        if search:
            q = search.lower().strip()
            filtered = [
                i for i in filtered
                if q in i.get("title", "").lower()
                or q in i.get("summary", "").lower()
                or q in i.get("cve_id", "").lower()
                or q in i.get("vendor", "").lower()
                or q in i.get("product", "").lower()
                or q in i.get("source_name", "").lower()
            ]

        # Sorting
        if sort_by == "severity":
            sev_order = {SEV_CRITICAL: 4, SEV_HIGH: 3, SEV_MEDIUM: 2, SEV_LOW: 1, SEV_INFO: 0}
            filtered.sort(
                key=lambda x: (
                    sev_order.get(x.get("severity"), 0),
                    x.get("cvss_score") or 0.0,
                    x.get("published_at", "")
                ),
                reverse=True
            )
        else:
            # Default: newest
            filtered.sort(key=lambda x: x.get("published_at", ""), reverse=True)

        # Pagination
        total_items = len(filtered)
        per_page = max(1, min(per_page, 100))
        total_pages = max(1, (total_items + per_page - 1) // per_page)
        page = max(1, min(page, total_pages))

        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paged_items = filtered[start_idx:end_idx]

        return {
            "status": "success",
            "last_sync": self._last_sync_time.isoformat() if self._last_sync_time else None,
            "freshly_synced": freshly_synced,
            "source_statuses": self._source_statuses,
            "total_items": total_items,
            "page": page,
            "per_page": per_page,
            "total_pages": total_pages,
            "items": paged_items,
        }


# Global singleton instance
threat_feed_service = ThreatFeedAggregator()
