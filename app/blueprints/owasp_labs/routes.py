"""
app/blueprints/owasp_labs/routes.py
Route definitions for the "owasp_labs" blueprint.

This blueprint serves interactive OWASP sandboxes for SQL Injection,
XSS, and Broken Access Control / IDOR — all safely simulated.
"""

import html
from flask import Blueprint, render_template, request, session
from flask_login import login_required

owasp_labs_bp = Blueprint("owasp_labs", __name__, template_folder="../../templates/owasp_labs")


# ============================================================
# SQL Injection Lab
# ============================================================
@owasp_labs_bp.route("/sql-injection", methods=["GET", "POST"])
@login_required
def sql_injection_lab():
    """
    Simulated SQL Injection sandbox.

    Shows a fake login form and visualises the constructed SQL query.
    No real database query is ever executed — this is purely string
    concatenation for educational demonstration.
    """
    query_string = None
    result_message = None
    is_vulnerable = False
    username_val = ""
    password_val = ""

    if request.method == "POST":
        username_val = request.form.get("username", "")
        password_val = request.form.get("password", "")

        # Simulate vulnerable query concatenation (NEVER executed)
        query_string = (
            f"SELECT * FROM users WHERE username='{username_val}' "
            f"AND password='{password_val}'"
        )

        # Detect common SQLi patterns
        sqli_patterns = [
            "' or 1=1",
            "' or ''='",
            "' union ",
            "'--",
            "admin'--",
            "' or 'a'='a",
            "1' or '1'='1",
            "' or 1=1#",
            "'; drop table",
        ]
        user_input_lower = (username_val + " " + password_val).lower()
        if any(p in user_input_lower for p in sqli_patterns):
            result_message = (
                "🔓 Access Granted — SQL Injection Successful! "
                "The application returned all user records."
            )
            is_vulnerable = True
        else:
            result_message = (
                "🔒 Login attempt processed normally. "
                "No injection detected — try a different payload!"
            )

    return render_template(
        "sql_injection_lab.html",
        query_string=query_string,
        result_message=result_message,
        is_vulnerable=is_vulnerable,
        username_val=username_val,
        password_val=password_val,
    )


# ============================================================
# XSS Lab
# ============================================================
@owasp_labs_bp.route("/xss", methods=["GET", "POST"])
@login_required
def xss_lab():
    """
    Simulated Cross-Site Scripting (XSS) sandbox.

    Shows a mock comment feed. User-submitted comments are rendered
    both "vulnerable" (raw HTML inside a sandboxed iframe) and "safe"
    (HTML-escaped) side-by-side to demonstrate the difference.

    SAFETY: The "vulnerable" rendering uses <iframe sandbox="" srcdoc="">
    which prevents any script from executing in the parent page context.
    """
    if "xss_comments" not in session:
        session["xss_comments"] = [
            "Welcome to the comment section!",
            "This app is really helpful for learning security.",
            "Has anyone tried the phishing module? It's great!",
        ]

    new_comment = None
    if request.method == "POST":
        comment = request.form.get("comment", "").strip()
        if comment:
            session["xss_comments"] = session["xss_comments"] + [comment]
            session.modified = True
            new_comment = comment

    comments = session.get("xss_comments", [])
    # HTML-escaped versions for the "safe" rendering
    safe_comments = [html.escape(c) for c in comments]

    return render_template(
        "xss_lab.html",
        comments=comments,
        safe_comments=safe_comments,
        new_comment=new_comment,
    )


# ============================================================
# IDOR Lab
# ============================================================
@owasp_labs_bp.route("/idor")
@login_required
def idor_lab():
    """
    Simulated Insecure Direct Object Reference (IDOR) / Broken
    Access Control sandbox.

    Shows mock user profiles accessible by changing ?user_id= in the URL.
    All data is hardcoded — no real user data is ever exposed.
    """
    mock_users = {
        1: {
            "id": 1,
            "name": "Rahul Sharma",
            "email": "rahul.sharma@company.in",
            "role": "Software Engineer",
            "salary": "₹12,00,000",
            "phone": "+91 98765 43210",
            "department": "Engineering",
        },
        2: {
            "id": 2,
            "name": "Anjali Patel",
            "email": "anjali.patel@company.in",
            "role": "HR Manager",
            "salary": "₹15,00,000",
            "phone": "+91 87654 32109",
            "department": "Human Resources",
        },
        3: {
            "id": 3,
            "name": "Vikram Singh",
            "email": "vikram.singh@company.in",
            "role": "Senior Developer",
            "salary": "₹18,00,000",
            "phone": "+91 76543 21098",
            "department": "Engineering",
        },
        4: {
            "id": 4,
            "name": "Priya Menon",
            "email": "priya.menon@company.in",
            "role": "CEO",
            "salary": "₹1,20,00,000",
            "phone": "+91 99999 99999",
            "department": "Executive",
        },
        5: {
            "id": 5,
            "name": "Arjun Reddy",
            "email": "arjun.reddy@company.in",
            "role": "Intern",
            "salary": "₹3,00,000",
            "phone": "+91 65432 10987",
            "department": "Engineering",
        },
    }

    user_id = request.args.get("user_id", 1, type=int)
    profile = mock_users.get(user_id)

    return render_template(
        "idor_lab.html",
        profile=profile,
        current_id=user_id,
        total_users=len(mock_users),
    )
