"""
app/services/hibp_service.py
Service wrapper around the HaveIBeenPwned Pwned Passwords API,
using k-Anonymity (5-character SHA-1 hash prefix) so full passwords
or full hashes are never transmitted.
"""

import hashlib


def check_password_breach(password: str):
    """
    Check whether a password appears in known breach datasets via HIBP,
    using the k-Anonymity model.

    Args:
        password (str): The plaintext password (hashed locally, never sent in full).

    Returns:
        int: Number of times the password was seen in breaches (0 if not found).
    """
    # TODO: hash password with SHA-1, send 5-char prefix to HIBP,
    # match returned suffixes against the local remainder.
    pass


def _sha1_hash(password: str) -> str:
    """Returns the uppercase SHA-1 hex digest of the given password."""
    return hashlib.sha1(password.encode("utf-8")).hexdigest().upper()
