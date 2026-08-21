"""
run.py
Entry point for running the Advanced Web Security Awareness Portal
Flask development server.

Usage:
    flask --app run.py run
    or
    python run.py
"""

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
