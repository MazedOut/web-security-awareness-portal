"""
app/models/user.py
SQLAlchemy model for application users (students and admins).

TODO: Define fields: id, username, email, password_hash, role,
xp, level, streak, lives, tier, created_at, etc.
Implement Flask-Login UserMixin integration.
"""

from app.extensions import db


class User(db.Model):
    """Represents a registered user (student or admin)."""

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    # TODO: add remaining columns
