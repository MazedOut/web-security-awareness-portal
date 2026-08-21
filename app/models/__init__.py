"""
app/models/__init__.py
Aggregates all SQLAlchemy model imports so they are registered
with the metadata when Flask-Migrate runs.
"""

from app.models.user import User
from app.models.score import Score
from app.models.badge import Badge
from app.models.question import Question
from app.models.phishing_example import PhishingExample
from app.models.incident_scenario import IncidentScenario
