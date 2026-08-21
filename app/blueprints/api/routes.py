"""
app/blueprints/api/routes.py
Route definitions for the "api" blueprint.

This blueprint exposes JSON/HTMX partial endpoints, including the AI Cyber Mentor (Gemini) and password breach check (HIBP).
"""

from flask import Blueprint, render_template

api_bp = Blueprint("api", __name__, template_folder="../../templates/api")


@api_bp.route("/ai_mentor_feedback")
def ai_mentor_feedback():
    """
    TODO: Implement the ai mentor feedback view for the api blueprint.
    """
    pass

@api_bp.route("/check_password_breach")
def check_password_breach():
    """
    TODO: Implement the check password breach view for the api blueprint.
    """
    pass

@api_bp.route("/progress_update")
def progress_update():
    """
    TODO: Implement the progress update view for the api blueprint.
    """
    pass
