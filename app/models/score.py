"""
app/models/score.py
SQLAlchemy model tracking per-user, per-module scores and progress.

NOTE: This is Person A's file — implemented minimally by Person B
so the app is runnable. Person A: expand as needed.
"""

from datetime import datetime, timezone

from app.extensions import db


class Score(db.Model):
    """Represents a user's score/progress on a specific module."""

    __tablename__ = "scores"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    module_name = db.Column(db.String(50), nullable=False)  # e.g., "phishing", "sqli", "siem"
    score = db.Column(db.Integer, nullable=False, default=0)
    max_score = db.Column(db.Integer, nullable=False, default=100)
    completion_pct = db.Column(db.Float, nullable=False, default=0.0)
    attempts = db.Column(db.Integer, nullable=False, default=1)
    timestamp = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<Score {self.module_name}: {self.score}/{self.max_score} for User {self.user_id}>"
