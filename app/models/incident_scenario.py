"""
app/models/incident_scenario.py
SQLAlchemy model for SOC Analyst incident response scenarios and
branching social-engineering narrative nodes.

TODO: Define fields: id, title, description, steps (JSON),
mitre_tactics, difficulty.
"""

from app.extensions import db


class IncidentScenario(db.Model):
    """Represents an incident response / social engineering scenario."""

    __tablename__ = "incident_scenarios"

    id = db.Column(db.Integer, primary_key=True)
    # TODO: add remaining columns
