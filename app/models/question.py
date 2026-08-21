"""
app/models/question.py
SQLAlchemy model for quiz/lab questions used across modules and tiers.

NOTE: This is Person A's file — implemented minimally by Person B
so the app is runnable. Person A: expand as needed.
"""

import json

from app.extensions import db


class Question(db.Model):
    """Represents a quiz or lab question."""

    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    module = db.Column(db.String(50), nullable=False, index=True)  # e.g., "phishing", "sqli", "general"
    tier = db.Column(db.Integer, nullable=False, default=1)  # 1, 2, or 3
    prompt = db.Column(db.Text, nullable=False)
    choices = db.Column(db.Text, nullable=False)  # JSON-encoded list of choices
    correct_answer = db.Column(db.String(255), nullable=False)
    explanation = db.Column(db.Text)  # static fallback explanation
    difficulty = db.Column(db.Integer, nullable=False, default=1)  # 1=easy, 2=medium, 3=hard

    @property
    def choices_list(self):
        """Deserialize choices JSON to a Python list."""
        try:
            return json.loads(self.choices)
        except (json.JSONDecodeError, TypeError):
            return []

    @choices_list.setter
    def choices_list(self, value):
        """Serialize a Python list to JSON for storage."""
        self.choices = json.dumps(value)

    def __repr__(self):
        return f"<Question {self.id}: {self.module} (Tier {self.tier})>"
