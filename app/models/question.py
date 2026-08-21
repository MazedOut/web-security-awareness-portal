"""
app/models/question.py
SQLAlchemy model for quiz/lab questions used across modules and tiers.

TODO: Define fields: id, module, tier, prompt, choices, correct_answer,
explanation, difficulty.
"""

from app.extensions import db


class Question(db.Model):
    """Represents a quiz or lab question."""

    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    # TODO: add remaining columns
