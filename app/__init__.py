"""
app/__init__.py
Application factory for the Advanced Web Security Awareness Portal.

Initializes Flask extensions (SQLAlchemy, Migrate, LoginManager),
registers all blueprints, and returns the configured app instance.
"""

import os

from flask import Flask
from dotenv import load_dotenv

from app.extensions import db, migrate, login_manager
from config import config_by_name


def create_app(config_name=None):
    """
    Application factory.

    Args:
        config_name (str): One of "development", "testing", "production".

    Returns:
        Flask: configured Flask application instance.
    """
    # Load .env file
    load_dotenv()

    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "development")

    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    # User loader for Flask-Login
    @login_manager.user_loader
    def load_user(user_id):
        from app.models.user import User
        return db.session.get(User, int(user_id))

    # Import models so Alembic can see them
    with app.app_context():
        from app import models  # noqa: F401

    # Register blueprints
    register_blueprints(app)

    # Register CLI commands
    from seed import register_seed_command
    register_seed_command(app)

    return app


def register_blueprints(app):
    """Register all application blueprints on the given app instance."""
    from app.blueprints.auth.routes import auth_bp
    from app.blueprints.dashboard.routes import dashboard_bp
    from app.blueprints.phishing.routes import phishing_bp
    from app.blueprints.owasp_labs.routes import owasp_labs_bp
    from app.blueprints.soc_analyst.routes import soc_analyst_bp
    from app.blueprints.passive_hub.routes import passive_hub_bp
    from app.blueprints.admin.routes import admin_bp
    from app.blueprints.api.routes import api_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(dashboard_bp, url_prefix="/dashboard")
    app.register_blueprint(phishing_bp, url_prefix="/phishing")
    app.register_blueprint(owasp_labs_bp, url_prefix="/owasp-labs")
    app.register_blueprint(soc_analyst_bp, url_prefix="/soc-analyst")
    app.register_blueprint(passive_hub_bp, url_prefix="/resources")
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(api_bp, url_prefix="/api")
