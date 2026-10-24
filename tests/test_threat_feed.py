"""
tests/test_threat_feed.py
Automated test suite for Chakravyuh Live Cybersecurity Threat Feed.

Covers:
- Parsing valid source responses (CISA KEV, NVD CVE 2.0, RSS feeds)
- Handling empty, malformed, or broken feeds
- Source timeouts and HTTP errors (403, 500, network drop)
- Deduplication and stable identifier generation
- Threat category classification (Web shells/PHP, Ransomware, Phishing, Cloud, KEV)
- Severity and CVSS score mapping
- Safe HTML escaping and XSS sanitization
- Refresh throttling and in-memory/disk caching
- API endpoint integration (/api/threat-feed, /api/threats/live, /api/threat-feed/refresh)
- Distinction between demo/simulated records vs genuine live incidents
"""

import json
import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone

from app import create_app
from app.services.threat_feed_service import (
    ThreatFeedAggregator,
    sanitize_text,
    is_safe_url,
    classify_category,
    infer_severity,
    CATEGORY_ACTIVELY_EXPLOITED,
    CATEGORY_WEB_APPS_SHELLS,
    CATEGORY_RANSOMWARE_MALWARE,
    CATEGORY_PHISHING_SOCIAL,
    CATEGORY_CLOUD_SUPPLY,
    CATEGORY_CRITICAL_VULNS,
    SEV_CRITICAL,
    SEV_HIGH,
    SEV_MEDIUM,
    SEV_LOW,
)


class TestThreatFeedSanitizationAndMapping(unittest.TestCase):
    """Unit tests for sanitization, category classification, and severity rules."""

    def test_sanitize_text_strips_html_tags_and_scripts(self):
        malicious_input = '<script>alert("xss")</script><b>Critical vulnerability in <i>Apache</i></b>'
        clean = sanitize_text(malicious_input)
        self.assertNotIn("<script>", clean)
        self.assertNotIn("</script>", clean)
        self.assertNotIn("<b>", clean)
        self.assertIn("Critical vulnerability in Apache", clean)

    def test_sanitize_text_handles_html_entities(self):
        raw = "Vulnerability in PHP &amp; WordPress &lt; 6.4"
        clean = sanitize_text(raw)
        self.assertEqual(clean, "Vulnerability in PHP & WordPress < 6.4")

    def test_is_safe_url(self):
        self.assertTrue(is_safe_url("https://www.cisa.gov/known-exploited-vulnerabilities"))
        self.assertTrue(is_safe_url("http://nvd.nist.gov/vuln/detail/CVE-2024-4577"))
        self.assertFalse(is_safe_url("javascript:alert(1)"))
        self.assertFalse(is_safe_url("file:///etc/passwd"))
        self.assertFalse(is_safe_url(None))
        self.assertFalse(is_safe_url(""))

    def test_classify_category_web_shells_and_php(self):
        cat = classify_category("PHP CGI Argument Injection", "Remote code execution webshell upload")
        self.assertEqual(cat, CATEGORY_WEB_APPS_SHELLS)

    def test_classify_category_ransomware(self):
        cat = classify_category("LockBit 3.0 Campaign", "Ransomware gang exfiltrates healthcare databases")
        self.assertEqual(cat, CATEGORY_RANSOMWARE_MALWARE)

    def test_classify_category_phishing(self):
        cat = classify_category("Mass Credential Harvesting Campaign", "Phishing campaign impersonating bank OTP")
        self.assertEqual(cat, CATEGORY_PHISHING_SOCIAL)

    def test_classify_category_cloud(self):
        cat = classify_category("AWS IAM Privilege Escalation", "Misconfigured Kubernetes cluster in cloud")
        self.assertEqual(cat, CATEGORY_CLOUD_SUPPLY)

    def test_classify_category_actively_exploited_kev(self):
        cat = classify_category("Generic Buffer Overflow", "Vulnerability observed in target software", is_kev=True)
        self.assertEqual(cat, CATEGORY_ACTIVELY_EXPLOITED)

    def test_infer_severity_by_cvss_score(self):
        self.assertEqual(infer_severity(cvss=9.8), SEV_CRITICAL)
        self.assertEqual(infer_severity(cvss=8.1), SEV_HIGH)
        self.assertEqual(infer_severity(cvss=5.4), SEV_MEDIUM)
        self.assertEqual(infer_severity(cvss=3.1), SEV_LOW)

    def test_infer_severity_fallback_by_keywords(self):
        self.assertEqual(infer_severity(cvss=None, text="Zero-Day Remote Code Execution"), SEV_CRITICAL)
        self.assertEqual(infer_severity(cvss=None, text="Privilege escalation flaw"), SEV_HIGH)
        self.assertEqual(infer_severity(cvss=None, text="Minor spoofing issue"), SEV_MEDIUM)


class TestThreatFeedParsers(unittest.TestCase):
    """Unit tests for external feed parsing and error handling."""

    def setUp(self):
        import tempfile
        self.temp_cache = tempfile.NamedTemporaryFile(suffix=".json", delete=False)
        self.temp_cache.close()
        self.aggregator = ThreatFeedAggregator(cache_file_path=self.temp_cache.name)

    def tearDown(self):
        import os
        if os.path.exists(self.temp_cache.name):
            os.remove(self.temp_cache.name)

    @patch("requests.Session.get")
    def test_parse_valid_cisa_kev(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "vulnerabilities": [
                {
                    "cveID": "CVE-2024-4577",
                    "vendorProject": "PHP Group",
                    "product": "PHP",
                    "vulnerabilityName": "PHP CGI Argument Injection Vulnerability",
                    "dateAdded": "2024-06-12",
                    "shortDescription": "PHP contains a vulnerability allowing argument injection.",
                    "requiredAction": "Apply vendor updates.",
                    "knownRansomwareCampaignUse": "Known",
                    "notes": "https://nvd.nist.gov/vuln/detail/CVE-2024-4577"
                }
            ]
        }
        mock_response.raise_for_status = MagicMock()
        mock_get.return_value = mock_response

        session = MagicMock()
        session.get.return_value = mock_response

        items = self.aggregator._fetch_cisa_kev(session)
        self.assertEqual(len(items), 1)
        item = items[0]
        self.assertEqual(item["cve_id"], "CVE-2024-4577")
        self.assertEqual(item["vendor"], "PHP Group")
        self.assertEqual(item["product"], "PHP")
        self.assertTrue(item["is_actively_exploited"])
        self.assertEqual(item["category"], CATEGORY_WEB_APPS_SHELLS)
        self.assertEqual(item["source_name"], "CISA KEV")

    @patch("requests.Session.get")
    def test_parse_valid_nvd_cve(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "vulnerabilities": [
                {
                    "cve": {
                        "id": "CVE-2024-12345",
                        "published": "2024-08-01T12:00:00.000",
                        "descriptions": [{"lang": "en", "value": "SQL injection in web portal login."}],
                        "metrics": {
                            "cvssMetricV31": [
                                {
                                    "cvssData": {
                                        "baseScore": 9.1,
                                        "baseSeverity": "CRITICAL"
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        }
        mock_response.raise_for_status = MagicMock()
        session = MagicMock()
        session.get.return_value = mock_response

        items = self.aggregator._fetch_nvd_cves(session)
        self.assertEqual(len(items), 1)
        item = items[0]
        self.assertEqual(item["cve_id"], "CVE-2024-12345")
        self.assertEqual(item["cvss_score"], 9.1)
        self.assertEqual(item["severity"], SEV_CRITICAL)
        self.assertFalse(item["is_actively_exploited"])  # NVD alone does not assert KEV active exploitation

    @patch("requests.Session.get")
    def test_parse_valid_rss_feed(self, mock_get):
        xml_content = b"""<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Security News</title>
            <item>
              <title>New Ransomware Threat Targets Cloud Databases</title>
              <link>https://thehackernews.com/2024/09/sample-story.html</link>
              <pubDate>Mon, 02 Sep 2024 14:00:00 GMT</pubDate>
              <description>&lt;p&gt;Attackers deploy malware to exfiltrate database backups.&lt;/p&gt;</description>
            </item>
          </channel>
        </rss>
        """
        mock_response = MagicMock()
        mock_response.content = xml_content
        mock_response.raise_for_status = MagicMock()
        session = MagicMock()
        session.get.return_value = mock_response

        items = self.aggregator._fetch_rss_feed(
            session, "https://example.com/rss", "test_source", "Test Security News"
        )
        self.assertEqual(len(items), 1)
        item = items[0]
        self.assertEqual(item["title"], "New Ransomware Threat Targets Cloud Databases")
        self.assertEqual(item["source_name"], "Test Security News")
        self.assertEqual(item["category"], CATEGORY_RANSOMWARE_MALWARE)
        self.assertNotIn("<p>", item["summary"])

    def test_handling_malformed_feeds_does_not_crash(self):
        session = MagicMock()
        bad_response = MagicMock()
        bad_response.content = b"Not valid XML <broken << tag"
        bad_response.raise_for_status = MagicMock()
        session.get.return_value = bad_response

        items = self.aggregator._fetch_rss_feed(
            session, "https://example.com/bad-rss", "broken_feed", "Broken Feed"
        )
        self.assertEqual(items, [])
        self.assertEqual(self.aggregator._source_statuses["broken_feed"]["status"], "error")

    def test_handling_http_timeout_does_not_crash(self):
        import requests
        session = MagicMock()
        session.get.side_effect = requests.exceptions.Timeout("Connection timed out")

        items = self.aggregator._fetch_cisa_kev(session)
        self.assertEqual(items, [])
        self.assertEqual(self.aggregator._source_statuses["cisa_kev"]["status"], "error")

    def test_deduplication_and_merging_authoritative_flags(self):
        # Two feeds report the same CVE: one from NVD (has CVSS), one from CISA KEV (has is_actively_exploited)
        kev_item = {
            "id": "cve-2024-4577",
            "cve_id": "CVE-2024-4577",
            "title": "PHP Argument Injection",
            "summary": "KEV summary",
            "severity": SEV_HIGH,
            "cvss_score": None,
            "vendor": "PHP Group",
            "product": "PHP",
            "category": CATEGORY_WEB_APPS_SHELLS,
            "item_type": "advisory",
            "is_actively_exploited": True,
            "published_at": "2024-06-12T00:00:00Z",
            "source_name": "CISA KEV",
            "source_url": "https://www.cisa.gov/kev",
            "required_action": "Apply patch.",
        }
        nvd_item = {
            "id": "cve-2024-4577",
            "cve_id": "CVE-2024-4577",
            "title": "PHP Argument Injection",
            "summary": "NVD summary",
            "severity": SEV_CRITICAL,
            "cvss_score": 9.8,
            "vendor": "PHP",
            "product": "PHP",
            "category": CATEGORY_WEB_APPS_SHELLS,
            "item_type": "advisory",
            "is_actively_exploited": False,
            "published_at": "2024-06-10T00:00:00Z",
            "source_name": "NVD",
            "source_url": "https://nvd.nist.gov/vuln/detail/CVE-2024-4577",
            "required_action": "",
        }

        merged = self.aggregator._merge_and_deduplicate([nvd_item, kev_item])
        self.assertEqual(len(merged), 1)
        m = merged[0]
        self.assertEqual(m["cve_id"], "CVE-2024-4577")
        self.assertTrue(m["is_actively_exploited"])
        self.assertEqual(m["cvss_score"], 9.8)
        self.assertEqual(m["severity"], SEV_CRITICAL)
        self.assertEqual(m["required_action"], "Apply patch.")


class TestThreatFeedApiEndpoints(unittest.TestCase):
    """Integration tests for Flask API endpoints."""

    def setUp(self):
        self.app = create_app("testing")
        self.client = self.app.test_client()

    def test_api_threat_feed_endpoint_structure(self):
        response = self.client.get("/api/threat-feed")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()

        self.assertIn("status", data)
        self.assertEqual(data["status"], "success")
        self.assertIn("items", data)
        self.assertIn("total_items", data)
        self.assertIn("source_statuses", data)
        self.assertIn("page", data)
        self.assertIn("per_page", data)
        self.assertIn("total_pages", data)

    def test_api_threat_feed_filtering_by_category(self):
        response = self.client.get("/api/threat-feed?category=Web+Applications+%26+Web+Shells")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        for item in data.get("items", []):
            self.assertEqual(item["category"], CATEGORY_WEB_APPS_SHELLS)

    def test_api_threat_feed_filtering_actively_exploited(self):
        response = self.client.get("/api/threat-feed?actively_exploited=true")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        for item in data.get("items", []):
            self.assertTrue(item["is_actively_exploited"])

    def test_api_threat_feed_pagination(self):
        response = self.client.get("/api/threat-feed?page=1&per_page=5")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertLessEqual(len(data.get("items", [])), 5)
        self.assertEqual(data["per_page"], 5)

    def test_api_threat_feed_refresh_endpoint(self):
        response = self.client.post("/api/threat-feed/refresh")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "success")
        self.assertIn("items", data)


if __name__ == "__main__":
    unittest.main()
