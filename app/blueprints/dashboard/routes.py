"""
app/blueprints/dashboard/routes.py
Route definitions for the "dashboard" blueprint.

This blueprint renders the user dashboard: XP, level, streaks, lives, badges, radar chart, and leaderboard.
"""

from flask import Blueprint, render_template

dashboard_bp = Blueprint("dashboard", __name__, template_folder="../../templates/dashboard")


@dashboard_bp.route("/")
def index():
    """
    TODO: Implement the index view for the dashboard blueprint.
    """
    pass

@dashboard_bp.route("/leaderboard")
def leaderboard():
    """
    TODO: Implement the leaderboard view for the dashboard blueprint.
    """
    pass

@dashboard_bp.route("/profile")
def profile():
    """
    TODO: Implement the profile view for the dashboard blueprint.
    """
    pass
