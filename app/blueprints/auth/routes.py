import re
from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, current_user
from app.extensions import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__, template_folder='../../templates/auth')

_EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard.index'))
    
    if request.method == 'POST':
        username = (request.form.get('username') or '').strip()
        email = (request.form.get('email') or '').strip()
        password = request.form.get('password') or ''
        confirm_password = request.form.get('confirm_password') or ''
        tier = request.form.get('tier', type=int, default=1)

        # --- Server-side validation (FR-01.1, UC-01, NFR-07) ---
        if not username:
            flash('Username is required.', 'danger')
            return redirect(url_for('auth.register'))
        if not email or not _EMAIL_RE.match(email):
            flash('A valid email address is required.', 'danger')
            return redirect(url_for('auth.register'))
        if len(password) < 8:
            flash('Password must be at least 8 characters long.', 'danger')
            return redirect(url_for('auth.register'))
        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return redirect(url_for('auth.register'))

        # Distinct duplicate check for username vs email
        if User.query.filter_by(username=username).first():
            flash('That username is already taken. Please choose another.', 'danger')
            return redirect(url_for('auth.register'))
        if User.query.filter_by(email=email).first():
            flash('An account with that email already exists. Please log in.', 'danger')
            return redirect(url_for('auth.register'))
            
        new_user = User(username=username, email=email, tier=tier)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        
        login_user(new_user)
        flash('Registration successful! Welcome to Chakravyuh.', 'success')
        return redirect(url_for('dashboard.index'))
        
    return render_template('register.html')

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Login accepting username OR email (FR-01.2)."""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard.index'))
        
    if request.method == 'POST':
        # Accept either username or email in the identifier field
        identifier = (request.form.get('email') or request.form.get('identifier') or '').strip()
        password = request.form.get('password') or ''

        user = User.query.filter(
            (User.username == identifier) | (User.email == identifier)
        ).first()

        if user and user.check_password(password):
            login_user(user)
            flash('Logged in successfully.', 'success')
            next_page = request.args.get('next')
            return redirect(next_page or url_for('dashboard.index'))
        else:
            flash('Invalid username/email or password.', 'danger')
            
    return render_template('login.html')

@auth_bp.route('/logout')
def logout():
    logout_user()
    flash('You have been logged out. Goodbye!', 'info')
    return redirect(url_for('auth.login'))
