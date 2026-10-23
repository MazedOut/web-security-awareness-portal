from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.extensions import db
from app.models.user import User
from app.models.score import Score
from app.models.game import Game
from app.services.gemini_service import get_ai_feedback, get_ai_feedback_with_source
from app.services.hibp_service import check_password_breach, query_pwned_range

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


# ---------------------------------------------------------------------------
# Security Modules Status  (Data Dict 6.3.2, Item 50)
# ---------------------------------------------------------------------------

@api_bp.route('/modules', methods=['GET'])
def get_modules():
    """Return all security awareness modules with active status."""
    games = Game.query.order_by(Game.game_id).all()
    return jsonify({
        'modules': [
            {
                'id': g.game_id,
                'name': g.game_name,
                'type': g.game_type,
                'description': g.description,
                'is_active': g.is_active,
            }
            for g in games
        ]
    })


# ---------------------------------------------------------------------------
# AI Educational Explanations  (FR-05.1-5.7, Items 36, 38, 42)
# ---------------------------------------------------------------------------

@api_bp.route('/ai-explain', methods=['POST'])
@api_bp.route('/ai-mentor-feedback', methods=['POST'])
def ai_explain():
    """
    Generate contextual explanation via Gemini with static fallback.
    Accepts question, answer, correctness, and static_fallback.
    Returns explanation, is_ai flag, and source tag.
    Never persists explanations to database (FR-05.6).
    """
    data = request.get_json() or {}
    question = data.get('question') or data.get('prompt') or ''
    user_answer = data.get('user_answer') or ''
    is_correct = bool(data.get('is_correct', False))
    difficulty = data.get('difficulty') or 'beginner'
    static_fallback = data.get('static_fallback') or ''

    feedback, is_ai = get_ai_feedback_with_source(
        question=question,
        user_answer=user_answer,
        is_correct=is_correct,
        difficulty=difficulty,
        static_fallback=static_fallback,
    )

    return jsonify({
        'feedback': feedback,
        'explanation': feedback,
        'is_ai': is_ai,
        'source': 'ai' if is_ai else 'static_fallback'
    })


# ---------------------------------------------------------------------------
# HaveIBeenPwned k-Anonymity Range Proxy  (FR-06.1-6.5, Items 18, 19, 23)
# ---------------------------------------------------------------------------

@api_bp.route('/pwned-range/<string:prefix>', methods=['GET'])
def pwned_range(prefix):
    """
    k-Anonymity range proxy endpoint (FR-06.1).
    Accepts ONLY a 5-character hexadecimal SHA-1 prefix.
    Full password or complete hash is NEVER accepted or transmitted.
    Returns matching hash suffixes with counts for local client comparison.
    """
    clean_prefix = (prefix or '').strip().upper()
    if len(clean_prefix) != 5 or not all(c in '0123456789ABCDEF' for c in clean_prefix):
        return jsonify({'error': 'Invalid 5-character hexadecimal prefix'}), 400

    range_text = query_pwned_range(clean_prefix)
    return jsonify({
        'prefix': clean_prefix,
        'hashes': range_text
    })


@api_bp.route('/check-password-breach', methods=['POST'])
def check_password_breach_api():
    """Server-side breach check fallback for legacy clients."""
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
