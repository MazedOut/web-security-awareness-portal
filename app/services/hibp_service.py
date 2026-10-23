"""
app/services/hibp_service.py
Service wrapper around the HaveIBeenPwned Pwned Passwords API,
using k-Anonymity (5-character SHA-1 hash prefix) so full passwords
or full hashes are never transmitted.

The Pwned Passwords range-search endpoint is free and does not
require an API key.
"""

import hashlib
import logging

import requests

logger = logging.getLogger(__name__)

HIBP_RANGE_URL = "https://api.pwnedpasswords.com/range/"
REQUEST_TIMEOUT = 5  # seconds
USER_AGENT = "Chakravyu-AWSP/1.0 (Educational Project)"


def check_password_breach(password: str) -> int:
    """
    Check whether a password appears in known breach datasets via HIBP,
    using the k-Anonymity model.

    How it works:
    1. SHA-1 hash the password locally.
    2. Send only the first 5 characters (prefix) to HIBP.
    3. HIBP returns all hash suffixes that match the prefix.
    4. Match the remaining suffix locally.
    5. Return the breach count (0 if not found).

    The full password and full hash NEVER leave this machine.

    Args:
        password (str): The plaintext password (hashed locally, never sent in full).

    Returns:
        int: Number of times the password was seen in breaches (0 if not found).
    """
    if not password:
        return 0

    sha1_hash = _sha1_hash(password)
    prefix = sha1_hash[:5]
    suffix = sha1_hash[5:]

    try:
        response = requests.get(
            f"{HIBP_RANGE_URL}{prefix}",
            headers={"User-Agent": USER_AGENT},
            timeout=REQUEST_TIMEOUT,
        )
        response.raise_for_status()

        # HIBP returns lines in format "SUFFIX:COUNT"
        for line in response.text.splitlines():
            parts = line.strip().split(":")
            if len(parts) == 2:
                hash_suffix, count = parts
                if hash_suffix.upper() == suffix:
                    return int(count)

        return 0

    except requests.exceptions.Timeout:
        logger.warning("HIBP API timed out — returning 0 (unknown).")
        return 0
    except requests.exceptions.RequestException as e:
        logger.warning(f"HIBP API request failed: {e} — returning 0 (unknown).")
        return 0
    except Exception as e:
        logger.warning(f"Unexpected error in HIBP check: {e} — returning 0.")
        return 0


def _sha1_hash(password: str) -> str:
    """Returns the uppercase SHA-1 hex digest of the given password."""
    return hashlib.sha1(password.encode("utf-8")).hexdigest().upper()


def query_pwned_range(prefix: str) -> str:
    """
    Fetch the range response from HIBP for a 5-character SHA-1 prefix.
    Only the 5-character prefix is transmitted (k-Anonymity model, FR-06.1).
    Full passwords and complete hashes never touch the external network.

    Args:
        prefix (str): 5-character hexadecimal SHA-1 prefix.

    Returns:
        str: Raw lines of SUFFIX:COUNT from HIBP, or empty string on error.
    """
    if not prefix or len(prefix) != 5:
        return ""

    try:
        response = requests.get(
            f"{HIBP_RANGE_URL}{prefix.upper()}",
            headers={"User-Agent": USER_AGENT},
            timeout=REQUEST_TIMEOUT,
        )
        response.raise_for_status()
        return response.text
    except Exception as exc:
        logger.warning(f"HIBP range query failed for prefix {prefix}: {exc}")
        return ""
