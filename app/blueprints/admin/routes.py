"""
app/blueprints/admin/routes.py
Admin panel — content management, user management, and analytics.
All routes are protected by @admin_required in addition to @login_required.

FR-04.1 – Admin panel access control
FR-04.2 – Add / Edit / Delete quiz questions and phishing templates
FR-04.3 – View all registered users and their scores
FR-04.4 – Reset a user's scores
"""

import json
from functools import wraps

from flask import Blueprint, render_template, request, redirect, url_for, flash, abort
from flask_login import login_required, current_user

from app.extensions import db
from app.models.user import User
from app.models.question import Question
from app.models.phishing_example import PhishingExample
from app.models.incident_scenario import IncidentScenario
from app.models.score import Score
from app.models.badge import Badge

admin_bp = Blueprint('admin', __name__, template_folder='../../templates/admin')


# ---------------------------------------------------------------------------
# Helper decorator
# ---------------------------------------------------------------------------

def admin_required(f):
    """Abort 403 for any authenticated non-admin user (FR-04.1)."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            abort(403)
        return f(*args, **kwargs)
    return decorated_function


# ---------------------------------------------------------------------------
# Dashboard
# ---------------------------------------------------------------------------

@admin_bp.route('/dashboard')
@login_required
@admin_required
def dashboard():
    total_users = User.query.count()
    total_scores = Score.query.count()
    total_phishing = PhishingExample.query.count()
    total_scenarios = IncidentScenario.query.count()
    total_questions = Question.query.count()
    
    return render_template(
        'dashboard.html',
        total_users=total_users,
        total_scores=total_scores,
        total_phishing=total_phishing,
        total_scenarios=total_scenarios,
        total_questions=total_questions,
    )


# ---------------------------------------------------------------------------
# Question CRUD  (FR-04.2, Items 45, 53)
# ---------------------------------------------------------------------------

@admin_bp.route('/manage-questions')
@login_required
@admin_required
def manage_questions():
    questions = Question.query.order_by(Question.module, Question.difficulty).all()
    return render_template('manage_questions.html', questions=questions)


@admin_bp.route('/manage-questions/add', methods=['POST'])
@login_required
@admin_required
def add_question():
    """Add a new quiz question."""
    prompt = (request.form.get('prompt') or '').strip()
    module = (request.form.get('module') or 'general').strip()
    tier = int(request.form.get('tier', 1))
    difficulty = int(request.form.get('difficulty', 1))
    explanation = (request.form.get('explanation') or '').strip()
    correct_answer = (request.form.get('correct_answer') or '').strip()

    # Collect option_a … option_d
    options = []
    for letter in ('a', 'b', 'c', 'd'):
        val = (request.form.get(f'option_{letter}') or '').strip()
        if val:
            options.append(val)

    if not prompt or not correct_answer or len(options) < 2:
        flash('Prompt, at least 2 options, and the correct answer are required.', 'danger')
        return redirect(url_for('admin.manage_questions'))

    new_q = Question(
        prompt=prompt,
        module=module,
        tier=tier,
        difficulty=difficulty,
        explanation=explanation,
        correct_answer=correct_answer,
        choices=json.dumps(options),
    )
    db.session.add(new_q)
    db.session.commit()
    flash('Question added successfully.', 'success')
    return redirect(url_for('admin.manage_questions'))


@admin_bp.route('/manage-questions/edit/<int:question_id>', methods=['GET', 'POST'])
@login_required
@admin_required
def edit_question(question_id):
    """Edit an existing quiz question."""
    question = Question.query.get_or_404(question_id)

    if request.method == 'POST':
        question.prompt = (request.form.get('prompt') or '').strip()
        question.module = (request.form.get('module') or 'general').strip()
        question.tier = int(request.form.get('tier', 1))
        question.difficulty = int(request.form.get('difficulty', 1))
        question.explanation = (request.form.get('explanation') or '').strip()
        question.correct_answer = (request.form.get('correct_answer') or '').strip()

        options = []
        for letter in ('a', 'b', 'c', 'd'):
            val = (request.form.get(f'option_{letter}') or '').strip()
            if val:
                options.append(val)

        if not question.prompt or not question.correct_answer or len(options) < 2:
            flash('Prompt, at least 2 options, and the correct answer are required.', 'danger')
            return redirect(url_for('admin.edit_question', question_id=question_id))

        question.choices = json.dumps(options)
        db.session.commit()
        flash('Question updated successfully.', 'success')
        return redirect(url_for('admin.manage_questions'))

    choices = question.choices_list
    # Pad to 4 so the form always has a–d fields
    while len(choices) < 4:
        choices.append('')
    return render_template('edit_question.html', question=question, choices=choices)


@admin_bp.route('/manage-questions/delete/<int:question_id>', methods=['POST'])
@login_required
@admin_required
def delete_question(question_id):
    """Permanently delete a quiz question."""
    question = Question.query.get_or_404(question_id)
    db.session.delete(question)
    db.session.commit()
    flash('Question deleted.', 'success')
    return redirect(url_for('admin.manage_questions'))


# ---------------------------------------------------------------------------
# Phishing Template CRUD  (FR-04.2, Items 46)
# ---------------------------------------------------------------------------

@admin_bp.route('/manage-phishing-templates')
@login_required
@admin_required
def manage_phishing_templates():
    templates = PhishingExample.query.order_by(PhishingExample.id).all()
    return render_template('manage_phishing_templates.html', templates=templates)


@admin_bp.route('/manage-phishing-templates/add', methods=['POST'])
@login_required
@admin_required
def add_phishing_template():
    sender_name = (request.form.get('sender_name') or '').strip()
    sender_email = (request.form.get('sender_email') or '').strip()
    subject = (request.form.get('subject') or '').strip()
    body_html = (request.form.get('body_html') or '').strip()

    if not sender_name or not sender_email or not subject or not body_html:
        flash('Sender name, sender email, subject, and body are required.', 'danger')
        return redirect(url_for('admin.manage_phishing_templates'))

    is_phishing = request.form.get('is_phishing') == 'True'
    red_flags = request.form.get('red_flags') or '[]'
    display_url = request.form.get('display_url') or ''
    real_url = request.form.get('real_url') or ''
    category = (request.form.get('category') or 'General').strip()
    difficulty = int(request.form.get('difficulty', 1))
    xp_reward = int(request.form.get('xp_reward', 10))
    
    new_template = PhishingExample(
        sender_name=sender_name,
        sender_email=sender_email,
        subject=subject,
        body_html=body_html,
        is_phishing=is_phishing,
        red_flags=red_flags,
        display_url=display_url,
        real_url=real_url,
        category=category,
        difficulty=difficulty,
        xp_reward=xp_reward,
    )
    db.session.add(new_template)
    db.session.commit()
    flash('Phishing template added successfully.', 'success')
    return redirect(url_for('admin.manage_phishing_templates'))


@admin_bp.route('/manage-phishing-templates/edit/<int:id>', methods=['GET', 'POST'])
@login_required
@admin_required
def edit_phishing_template(id):
    """Edit an existing phishing template (Item 46)."""
    template = PhishingExample.query.get_or_404(id)

    if request.method == 'POST':
        sender_name = (request.form.get('sender_name') or '').strip()
        sender_email = (request.form.get('sender_email') or '').strip()
        subject = (request.form.get('subject') or '').strip()
        body_html = (request.form.get('body_html') or '').strip()

        if not sender_name or not sender_email or not subject or not body_html:
            flash('Sender name, sender email, subject, and body are required.', 'danger')
            return redirect(url_for('admin.edit_phishing_template', id=id))

        template.sender_name = sender_name
        template.sender_email = sender_email
        template.subject = subject
        template.body_html = body_html
        template.is_phishing = request.form.get('is_phishing') == 'True'
        template.red_flags = request.form.get('red_flags') or '[]'
        template.display_url = request.form.get('display_url') or ''
        template.real_url = request.form.get('real_url') or ''
        template.category = (request.form.get('category') or 'General').strip()
        template.difficulty = int(request.form.get('difficulty', 1))
        template.xp_reward = int(request.form.get('xp_reward', 10))
        db.session.commit()
        flash('Phishing template updated successfully.', 'success')
        return redirect(url_for('admin.manage_phishing_templates'))

    return render_template('edit_phishing_template.html', template=template)


@admin_bp.route('/manage-phishing-templates/delete/<int:id>', methods=['POST'])
@login_required
@admin_required
def delete_phishing_template(id):
    template = PhishingExample.query.get_or_404(id)
    db.session.delete(template)
    db.session.commit()
    flash('Phishing template deleted.', 'success')
    return redirect(url_for('admin.manage_phishing_templates'))


# ---------------------------------------------------------------------------
# Scenario CRUD  (Item 51 — existing)
# ---------------------------------------------------------------------------

@admin_bp.route('/manage-scenarios')
@login_required
@admin_required
def manage_scenarios():
    scenarios = IncidentScenario.query.all()
    return render_template('manage_scenarios.html', scenarios=scenarios)


@admin_bp.route('/manage-scenarios/add', methods=['POST'])
@login_required
@admin_required
def add_scenario():
    title = (request.form.get('title') or '').strip()
    description = (request.form.get('description') or '').strip()
    scenario_type = request.form.get('scenario_type') or 'social_engineering'
    steps = request.form.get('steps') or ''
    mitre_tactics = request.form.get('mitre_tactics') or ''
    difficulty = int(request.form.get('difficulty', 1))
    xp_reward = int(request.form.get('xp_reward', 50))

    if not title or not description:
        flash('Title and description are required.', 'danger')
        return redirect(url_for('admin.manage_scenarios'))
    
    new_scenario = IncidentScenario(
        title=title,
        description=description,
        scenario_type=scenario_type,
        steps=steps,
        mitre_tactics=mitre_tactics,
        difficulty=difficulty,
        xp_reward=xp_reward,
    )
    db.session.add(new_scenario)
    db.session.commit()
    flash('Scenario added successfully.', 'success')
    return redirect(url_for('admin.manage_scenarios'))


@admin_bp.route('/manage-scenarios/delete/<int:id>', methods=['POST'])
@login_required
@admin_required
def delete_scenario(id):
    scenario = IncidentScenario.query.get_or_404(id)
    db.session.delete(scenario)
    db.session.commit()
    flash('Scenario deleted.', 'success')
    return redirect(url_for('admin.manage_scenarios'))


# ---------------------------------------------------------------------------
# User Management  (FR-04.3, FR-04.4 — Items 47, 48)
# ---------------------------------------------------------------------------

@admin_bp.route('/users')
@login_required
@admin_required
def manage_users():
    """List all registered users with XP, tier, and score count (FR-04.3)."""
    users = User.query.order_by(User.xp.desc()).all()
    # Attach per-user score count to avoid N+1 in template
    user_data = []
    for u in users:
        user_data.append({
            'user': u,
            'score_count': Score.query.filter_by(user_id=u.id).count(),
            'total_score': db.session.query(db.func.sum(Score.score)).filter_by(user_id=u.id).scalar() or 0,
        })
    return render_template('manage_users.html', user_data=user_data)


@admin_bp.route('/users/<int:user_id>/reset-scores', methods=['POST'])
@login_required
@admin_required
def reset_user_scores(user_id):
    """Delete all scores for a user and reset their XP to 0 (FR-04.4)."""
    user = User.query.get_or_404(user_id)
    Score.query.filter_by(user_id=user.id).delete()
    user.xp = 0
    user.level = 1
    db.session.commit()
    flash(f'Scores and XP for {user.username} have been reset.', 'success')
    return redirect(url_for('admin.manage_users'))


# ---------------------------------------------------------------------------
# Analytics  (FR-04.3, Item 49)
# ---------------------------------------------------------------------------

@admin_bp.route('/cohort-analytics')
@login_required
@admin_required
def cohort_analytics():
    users = User.query.all()
    tiers = {'Tier 1': 0, 'Tier 2': 0, 'Tier 3': 0}
    for u in users:
        if u.tier == 1:
            tiers['Tier 1'] += 1
        elif u.tier == 2:
            tiers['Tier 2'] += 1
        else:
            tiers['Tier 3'] += 1
            
    scores = Score.query.all()
    module_stats = {}
    for s in scores:
        if s.module_name not in module_stats:
            module_stats[s.module_name] = {'total_score': 0, 'count': 0}
        module_stats[s.module_name]['total_score'] += s.score
        module_stats[s.module_name]['count'] += 1
        
    avg_scores = {
        mod: round(stats['total_score'] / stats['count'], 2)
        for mod, stats in module_stats.items()
    }

    # Per-question correct / incorrect metrics
    questions = Question.query.all()
    question_metrics = []
    for q in questions:
        correct = Score.query.filter_by(module_name=q.module).filter(Score.score > 0).count()
        total = Score.query.filter_by(module_name=q.module).count()
        question_metrics.append({
            'question': q,
            'correct': correct,
            'total': total,
            'pct': round(correct / total * 100, 1) if total else 0,
        })
        
    return render_template(
        'cohort_analytics.html',
        tiers=tiers,
        avg_scores=avg_scores,
        total_completions=len(scores),
        question_metrics=question_metrics,
    )
