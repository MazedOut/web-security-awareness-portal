from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.extensions import db
from app.models.user import User
from app.models.score import Score
from app.services.gemini_service import get_ai_feedback
from app.services.hibp_service import check_password_breach

api_bp = Blueprint('api', __name__, template_folder='../../templates/api')


# ---------------------------------------------------------------------------
# Public Leaderboard  (FR-03.2, Item 33)
# ---------------------------------------------------------------------------

@api_bp.route('/leaderboard', methods=['GET'])
def leaderboard():
    """Return top-10 users by XP. Publicly accessible (no login required)."""
    top_users = (
        User.query
        .order_by(User.xp.desc())
        .limit(10)
        .all()
    )
    data = [
        {
            'rank': idx + 1,
            'name': u.username,
            'xp': u.xp,
            'level': u.level,
            'tier': u.tier,
            'badge': u.tier_name,
        }
        for idx, u in enumerate(top_users)
    ]
    return jsonify({'leaderboard': data})

@api_bp.route('/ai-mentor-feedback', methods=['POST'])
def ai_mentor_feedback():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON data'}), 400
    
    question = data.get('question')
    user_answer = data.get('user_answer')
    is_correct = data.get('is_correct')
    difficulty = data.get('difficulty')
    
    feedback = get_ai_feedback(question, user_answer, is_correct, difficulty)
    
    return jsonify({'feedback': feedback})

@api_bp.route('/check-password-breach', methods=['POST'])
def check_password_breach_api():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON data'}), 400
        
    password = data.get('password')
    if not password:
        return jsonify({'error': 'Password is required'}), 400
        
    breach_count = check_password_breach(password)
    
    if breach_count > 0:
        message = f"Warning: This password has been seen {breach_count:,} times in data breaches."
    else:
        message = "Good news: This password was not found in known data breaches."
        
    return jsonify({
        'breach_count': breach_count,
        'message': message
    })

@api_bp.route('/progress-update', methods=['POST'])
@login_required
def progress_update():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON data'}), 400
        
    module_name = data.get('module_name')
    score_val = data.get('score', 0)
    max_score = data.get('max_score', 100)
    
    if not module_name:
        return jsonify({'error': 'Module name is required'}), 400
        
    completion_pct = (score_val / max_score) * 100 if max_score > 0 else 0
    
    score_record = Score.query.filter_by(user_id=current_user.id, module_name=module_name).first()
    
    if score_record:
        if score_val > score_record.score:
            score_record.score = score_val
            score_record.completion_pct = completion_pct
        score_record.attempts += 1
    else:
        score_record = Score(
            user_id=current_user.id,
            module_name=module_name,
            score=score_val,
            max_score=max_score,
            completion_pct=completion_pct,
            attempts=1
        )
        db.session.add(score_record)
        
    # Award some XP
    xp_earned = int(score_val * 10)
    if xp_earned > 0:
        current_user.add_xp(xp_earned)
        
    db.session.commit()
    
    return jsonify({
        'xp': current_user.xp,
        'level': current_user.level,
        'message': 'Progress updated successfully'
    })
