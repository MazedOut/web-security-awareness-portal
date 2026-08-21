# Advanced Web Security Awareness Portal

Gamified, scenario-driven cybersecurity awareness platform built with Flask.

## Setup

1. Create a virtual environment and install dependencies:
   ```
   pip install -r requirements.txt
   ```
2. Copy `.env.example` to `.env` and fill in secrets.
3. Initialize the database:
   ```
   flask --app run.py db upgrade
   ```
4. Run the app:
   ```
   flask --app run.py run
   ```

## Project Structure

See `app/` for the application package, organized by Flask Blueprints.
Each teammate should work within their assigned blueprint folder to avoid
merge conflicts.

## Blueprints

- `auth` — registration, login, session/RBAC
- `dashboard` — XP, levels, badges, leaderboard, radar chart
- `phishing` — phishing & spoofing simulator
- `owasp_labs` — SQLi / XSS / IDOR sandboxes
- `soc_analyst` — SIEM log analyzer, MITRE ATT&CK, incident response
- `passive_hub` — Indian cyber resource hub
- `admin` — CMS + cohort analytics
- `api` — AI mentor + HIBP + misc JSON endpoints
