"""
app/models/score.py
SQLAlchemy model tracking per-user, per-module scores and progress.

TODO: Define fields: id, user_id (FK), module_name, score,
completion_percentage, attempts, timestamp.
"""

from app.extensions import db


class Score(db.Model):
    """Represents a user's score/progress on a specific module."""

    __tablename__ = "scores"

    id = db.Column(db.Integer, primary_key=True)
    # TODO: add remaining columns
