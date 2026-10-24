"""
app/blueprints/passive_hub/routes.py
Route definitions for the "passive_hub" blueprint.

This blueprint serves the Passive Awareness & Indian Cyber Resource Hub:
reporting directory, helplines, threat feed, and legal reference.
All pages are publicly accessible (no login required).
"""

from flask import Blueprint, render_template

passive_hub_bp = Blueprint("passive_hub", __name__, template_folder="../../templates/passive_hub")


@passive_hub_bp.route("/")
def index():
    """Hub index with cards linking to all sub-sections."""
    return render_template("index.html")


@passive_hub_bp.route("/reporting-guide")
def reporting_guide():
    """Step-by-step cybercrime.gov.in walkthrough."""
    return render_template("reporting_guide.html")


@passive_hub_bp.route("/helplines")
def helplines():
    """Emergency helpline directory."""
    return render_template("helplines.html")


@passive_hub_bp.route("/threat-feed")
def threat_feed():
    """Live cyber threat feed and verified security advisories."""
    from app.services.threat_feed_service import threat_feed_service
    feed_data = threat_feed_service.get_feed(per_page=20)
    return render_template(
        "threat_feed.html",
        feed=feed_data.get("items", []),
        last_sync=feed_data.get("last_sync"),
        source_statuses=feed_data.get("source_statuses", {}),
    )


@passive_hub_bp.route("/legal-reference")
def legal_reference():
    """IT Act 2000 simplified reference and digital rights."""
    return render_template("legal_reference.html")
