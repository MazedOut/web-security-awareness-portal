"""
app/models/user.py
SQLAlchemy model for application users (students and admins).

Implements Flask-Login UserMixin integration with password hashing,
role-based access, tiered difficulty, and XP/level progression.

NOTE: This is Person A's file — implemented minimally by Person B
so the app is runnable. Person A: expand as needed.
"""

from datetime import datetime, timezone

from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from app.extensions import db


class User(UserMixin, db.Model):
    """Represents a registered user (student or admin)."""

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="student")  # "student" or "admin"

    # Gamification / progression
    xp = db.Column(db.Integer, nullable=False, default=0)
    level = db.Column(db.Integer, nullable=False, default=1)
    streak = db.Column(db.Integer, nullable=False, default=0)
    lives = db.Column(db.Integer, nullable=False, default=3)
    tier = db.Column(db.Integer, nullable=False, default=1)  # 1=Digital Citizen, 2=Cyber Defender, 3=SOC Analyst

    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    last_active = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    scores = db.relationship("Score", backref="user", lazy="dynamic")

    def set_password(self, password):
        """Hash and store the user's password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verify a password against the stored hash."""
        return check_password_hash(self.password_hash, password)

    @property
    def is_admin(self):
        """Check if user has admin role."""
        return self.role == "admin"

    @property
    def tier_name(self):
        """Human-readable tier name."""
        tier_names = {1: "Digital Citizen", 2: "Cyber Defender", 3: "SOC Analyst"}
        return tier_names.get(self.tier, "Digital Citizen")

    @property
    def xp_for_next_level(self):
        """XP required to reach the next level."""
        return self.level * 100

    @property
    def xp_progress_pct(self):
        """Percentage progress toward next level."""
        needed = self.xp_for_next_level
        if needed == 0:
            return 100
        return min(int((self.xp % needed) / needed * 100), 100)

    def add_xp(self, amount):
        """Add XP and handle level-ups."""
        self.xp += amount
        while self.xp >= self.xp_for_next_level:
            self.level += 1

    def __repr__(self):
        return f"<User {self.username} (Tier {self.tier})>"
