"""
app/models/phishing_example.py
SQLAlchemy model for phishing email templates used in the
Phishing & Spoofing Simulator.

Stores both phishing and legitimate email examples for the interactive
inbox exercise. Each record includes red flag indicators, spoofed URLs,
and difficulty grading.
"""

import json
from datetime import datetime, timezone

from app.extensions import db


class PhishingExample(db.Model):
    """Represents a single phishing (or legitimate) email example."""

    __tablename__ = "phishing_examples"

    id = db.Column(db.Integer, primary_key=True)
    sender_name = db.Column(db.String(100), nullable=False)
    sender_email = db.Column(db.String(150), nullable=False)
    subject = db.Column(db.String(255), nullable=False)
    body_html = db.Column(db.Text, nullable=False)
    is_phishing = db.Column(db.Boolean, nullable=False, default=True)

    # Red flags — JSON list of strings describing suspicious indicators
    red_flags = db.Column(db.Text, default="[]")

    # URL spoofing fields for hover-to-reveal exercise
    display_url = db.Column(db.String(500))  # What the link text shows
    real_url = db.Column(db.String(500))      # Where it actually goes

    # Categorization
    category = db.Column(db.String(50), default="general")  # banking, government, social, ecommerce
    difficulty = db.Column(db.Integer, nullable=False, default=1)  # 1=easy, 2=medium, 3=hard
    xp_reward = db.Column(db.Integer, nullable=False, default=10)

    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    @property
    def red_flags_list(self):
        """Deserialize red flags JSON to a Python list."""
        try:
            return json.loads(self.red_flags)
        except (json.JSONDecodeError, TypeError):
            return []

    @red_flags_list.setter
    def red_flags_list(self, value):
        """Serialize a Python list to JSON for storage."""
        self.red_flags = json.dumps(value)

    @property
    def difficulty_label(self):
        """Human-readable difficulty."""
        labels = {1: "Easy", 2: "Medium", 3: "Hard"}
        return labels.get(self.difficulty, "Easy")

    @property
    def difficulty_level_name(self):
        """Human-readable tier difficulty (Item 13)."""
        labels = {1: "Beginner", 2: "Intermediate", 3: "Advanced"}
        return labels.get(self.difficulty, "Beginner")

    @property
    def static_explanation(self):
        """Static fallback explanation based on indicators or classification."""
        flags = self.red_flags_list
        if flags:
            return "Key indicators: " + "; ".join(flags)
        if self.is_phishing:
            return "This message shows multiple indicators of phishing: deceptive sender identity, high urgency, and suspicious call-to-action."
        return "This message comes from a verified domain and displays normal business correspondence patterns."

    def __repr__(self):
        return f"<PhishingExample {self.id}: '{self.subject}' ({'PHISH' if self.is_phishing else 'LEGIT'})>"
