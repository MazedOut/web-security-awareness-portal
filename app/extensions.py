"""
app/extensions.py
Instantiates Flask extensions without binding them to an app instance,
so they can be initialized later in the application factory
(avoids circular imports).
"""

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
login_manager.login_view = "auth.login"
