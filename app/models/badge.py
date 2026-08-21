"""
app/models/badge.py
SQLAlchemy model for achievement badges and the user-badge association.

TODO: Define Badge fields (id, name, description, icon) and an
association table/model linking Users to earned Badges.
"""

from app.extensions import db


class Badge(db.Model):
    """Represents an achievement badge that users can earn."""

    __tablename__ = "badges"

    id = db.Column(db.Integer, primary_key=True)
    # TODO: add remaining columns
