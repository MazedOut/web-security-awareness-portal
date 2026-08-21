"""
app/blueprints/owasp_labs/routes.py
Route definitions for the "owasp_labs" blueprint.

This blueprint serves interactive OWASP sandboxes for SQL Injection, XSS, and Broken Access Control / IDOR.
"""

from flask import Blueprint, render_template

owasp_labs_bp = Blueprint("owasp_labs", __name__, template_folder="../../templates/owasp_labs")


@owasp_labs_bp.route("/sql_injection_lab")
def sql_injection_lab():
    """
    TODO: Implement the sql injection lab view for the owasp_labs blueprint.
    """
    pass

@owasp_labs_bp.route("/xss_lab")
def xss_lab():
    """
    TODO: Implement the xss lab view for the owasp_labs blueprint.
    """
    pass

@owasp_labs_bp.route("/idor_lab")
def idor_lab():
    """
    TODO: Implement the idor lab view for the owasp_labs blueprint.
    """
    pass
