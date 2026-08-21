from flask import Blueprint, render_template
from flask_login import login_required, current_user
from app.extensions import db
from app.models.user import User
from app.models.score import Score

dashboard_bp = Blueprint('dashboard', __name__, template_folder='../../templates/dashboard')

@dashboard_bp.route('/')
@login_required
def index():
    recent_scores = Score.query.filter_by(user_id=current_user.id).order_by(Score.timestamp.desc()).limit(5).all()
    return render_template('index.html', recent_scores=recent_scores)

@dashboard_bp.route('/leaderboard')
@login_required
def leaderboard():
    users = User.query.order_by(User.xp.desc()).limit(20).all()
    return render_template('leaderboard.html', users=users)

@dashboard_bp.route('/profile')
@login_required
def profile():
    scores = Score.query.filter_by(user_id=current_user.id).all()
    return render_template('profile.html', scores=scores)
