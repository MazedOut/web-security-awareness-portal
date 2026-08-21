"""
app/models/incident_scenario.py
SQLAlchemy model for SOC Analyst incident response scenarios and
SIEM/MITRE exercise data.

Stores multi-step branching scenarios for the Incident Response game,
SIEM log analysis exercises, and MITRE ATT&CK mapping challenges.
"""

import json
from datetime import datetime, timezone

from app.extensions import db


class IncidentScenario(db.Model):
    """Represents an incident response / SOC analyst scenario."""

    __tablename__ = "incident_scenarios"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)

    # Type of scenario
    scenario_type = db.Column(
        db.String(30), nullable=False, default="incident_response"
    )  # incident_response, siem_analysis, mitre_mapping, social_engineering

    # Steps — JSON list of step dicts, each with:
    # {step_number, title, narrative, choices: [{text, is_correct, feedback, next_step}]}
    steps = db.Column(db.Text, nullable=False, default="[]")

    # MITRE ATT&CK references — comma-separated tactic IDs (e.g., "TA0001,TA0003")
    mitre_tactics = db.Column(db.Text, default="")

    difficulty = db.Column(db.Integer, nullable=False, default=1)  # 1=easy, 2=medium, 3=hard
    xp_reward = db.Column(db.Integer, nullable=False, default=25)

    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    @property
    def steps_list(self):
        """Deserialize steps JSON to a Python list."""
        try:
            return json.loads(self.steps)
        except (json.JSONDecodeError, TypeError):
            return []

    @steps_list.setter
    def steps_list(self, value):
        """Serialize a Python list to JSON for storage."""
        self.steps = json.dumps(value)

    @property
    def mitre_tactics_list(self):
        """Return MITRE tactics as a list."""
        if not self.mitre_tactics:
            return []
        return [t.strip() for t in self.mitre_tactics.split(",") if t.strip()]

    @property
    def difficulty_label(self):
        labels = {1: "Easy", 2: "Medium", 3: "Hard"}
        return labels.get(self.difficulty, "Easy")

    def __repr__(self):
        return f"<IncidentScenario {self.id}: '{self.title}' ({self.scenario_type})>"
