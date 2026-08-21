from flask import Blueprint, render_template, request, flash, redirect, url_for, abort
from flask_login import login_required, current_user
from app.extensions import db
from app.models.phishing_example import PhishingExample
from app.models.score import Score
from app.services.gemini_service import get_ai_feedback

phishing_bp = Blueprint('phishing', __name__, template_folder='../../templates/phishing')

@phishing_bp.route('/inbox')
@login_required
def inbox():
    difficulty = request.args.get('difficulty', type=int)
    query = PhishingExample.query
    if difficulty:
        query = query.filter_by(difficulty=difficulty)
    emails = query.all()
    return render_template('inbox.html', emails=emails, active_difficulty=difficulty)

@phishing_bp.route('/inspect/<int:email_id>')
@login_required
def inspect(email_id):
    email = PhishingExample.query.get_or_404(email_id)
    return render_template('inspect_email.html', email=email, result=None)

@phishing_bp.route('/submit-answer/<int:email_id>', methods=['POST'])
@login_required
def submit_answer(email_id):
    email = PhishingExample.query.get_or_404(email_id)
    verdict = request.form.get('verdict') # 'phishing' or 'legitimate'
    
    if verdict not in ['phishing', 'legitimate']:
        flash('Invalid submission.', 'danger')
        return redirect(url_for('phishing.inspect', email_id=email_id))
    
    user_says_phishing = verdict == 'phishing'
    is_correct = user_says_phishing == email.is_phishing
    
    xp_earned = email.xp_reward if is_correct else 0
    if is_correct:
        current_user.add_xp(xp_earned)
    
    score = Score(
        user_id=current_user.id,
        module_name=f'phishing_{email_id}',
        score=1 if is_correct else 0,
        max_score=1,
        completion_pct=100.0 if is_correct else 0.0,
        attempts=1
    )
    db.session.add(score)
    db.session.commit()
    
    question_text = f"Is this email from {email.sender_name} legitimate or phishing?"
    ai_feedback = get_ai_feedback(
        question=question_text,
        user_answer=verdict,
        is_correct=is_correct,
        difficulty=email.difficulty
    )
    
    result = {
        'is_correct': is_correct,
        'xp_earned': xp_earned,
        'ai_feedback': ai_feedback,
        'red_flags': email.red_flags_list
    }
    
    return render_template('inspect_email.html', email=email, result=result)
