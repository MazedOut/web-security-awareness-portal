"""
app/models/phishing_example.py
SQLAlchemy model for phishing email templates used in the
Phishing & Spoofing Simulator.

TODO: Define fields: id, sender, subject, body_html, is_phishing,
red_flags (JSON/text), difficulty.
"""

from app.extensions import db


class PhishingExample(db.Model):
    """Represents a single phishing (or legitimate) email example."""

    __tablename__ = "phishing_examples"

    id = db.Column(db.Integer, primary_key=True)
    # TODO: add remaining columns
