"""
config.py
Centralized configuration classes for the Flask application.

Defines environment-specific settings (Development, Testing, Production),
including database URI, secret keys, and external API key references
(Google Gemini API, HaveIBeenPwned API).
"""

import os


class Config:
    """Base configuration with shared defaults."""
    SECRET_KEY = os.environ.get("SECRET_KEY", "change-me")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///awsp.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
    HIBP_API_KEY = os.environ.get("HIBP_API_KEY")


class DevelopmentConfig(Config):
    """Development environment configuration."""
    DEBUG = True


class TestingConfig(Config):
    """Testing environment configuration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"


class ProductionConfig(Config):
    """Production environment configuration."""
    DEBUG = False


config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}
