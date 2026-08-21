"""
app/models/badge.py
SQLAlchemy model for achievement badges and the user-badge association.

NOTE: This is Person A's file — implemented minimally by Person B
so the app is runnable. Person A: expand as needed.
"""

from datetime import datetime, timezone

from app.extensions import db

# Association table for many-to-many User ↔ Badge relationship
user_badges = db.Table(
    "user_badges",
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column("badge_id", db.Integer, db.ForeignKey("badges.id"), primary_key=True),
    db.Column("earned_at", db.DateTime, default=lambda: datetime.now(timezone.utc)),
)


class Badge(db.Model):
    """Represents an achievement badge that users can earn."""

    __tablename__ = "badges"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    icon = db.Column(db.String(50), nullable=False, default="🏆")  # emoji or icon class
    criteria = db.Column(db.String(255))  # human-readable earning criteria

    # Many-to-many relationship with users
    users = db.relationship("User", secondary=user_badges, backref="badges", lazy="dynamic")

    def __repr__(self):
        return f"<Badge {self.name}>"
