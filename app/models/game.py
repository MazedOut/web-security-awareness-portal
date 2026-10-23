"""
app/models/game.py
SQLAlchemy model for security awareness modules (Data Dictionary 6.3.2).
Allows administrators to enable/disable modules dynamically without deleting historical records.
"""

from app.extensions import db


class Game(db.Model):
    """Represents a game/simulation module in the portal."""

    __tablename__ = "games"

    game_id = db.Column(db.Integer, primary_key=True)
    game_name = db.Column(db.String(100), unique=True, nullable=False)
    game_type = db.Column(db.String(50), nullable=False)  # phishing, password, social_eng, quiz, owasp, soc
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    @property
    def id(self):
        """Compatibility alias for primary key."""
        return self.game_id

    def __repr__(self):
        return f"<Game {self.game_id}: {self.game_name} ({'Active' if self.is_active else 'Disabled'})>"
