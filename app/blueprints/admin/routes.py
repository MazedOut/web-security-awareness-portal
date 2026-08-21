from flask import Blueprint, render_template, request, redirect, url_for, flash, abort
from flask_login import login_required, current_user
from functools import wraps
from app.extensions import db
from app.models.user import User
from app.models.question import Question
from app.models.phishing_example import PhishingExample
from app.models.incident_scenario import IncidentScenario
from app.models.score import Score

admin_bp = Blueprint('admin', __name__, template_folder='../../templates/admin')

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            abort(403)
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/dashboard')
@login_required
@admin_required
def dashboard():
    total_users = User.query.count()
    total_scores = Score.query.count()
    total_phishing = PhishingExample.query.count()
    total_scenarios = IncidentScenario.query.count()
    
    return render_template('dashboard.html', 
                           total_users=total_users,
                           total_scores=total_scores,
                           total_phishing=total_phishing,
                           total_scenarios=total_scenarios)

@admin_bp.route('/manage-questions')
@login_required
@admin_required
def manage_questions():
    questions = Question.query.all()
    return render_template('manage_questions.html', questions=questions)

@admin_bp.route('/manage-phishing-templates')
@login_required
@admin_required
def manage_phishing_templates():
    templates = PhishingExample.query.all()
    return render_template('manage_phishing_templates.html', templates=templates)

@admin_bp.route('/manage-phishing-templates/add', methods=['POST'])
@login_required
@admin_required
def add_phishing_template():
    sender_name = request.form.get('sender_name')
    sender_email = request.form.get('sender_email')
    subject = request.form.get('subject')
    body_html = request.form.get('body_html')
    is_phishing = request.form.get('is_phishing') == 'True'
    red_flags = request.form.get('red_flags')
    display_url = request.form.get('display_url')
    real_url = request.form.get('real_url')
    category = request.form.get('category')
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
        xp_reward=xp_reward
    )
    
    db.session.add(new_template)
    db.session.commit()
    flash('Phishing template added successfully.', 'success')
    return redirect(url_for('admin.manage_phishing_templates'))

@admin_bp.route('/manage-phishing-templates/delete/<int:id>', methods=['POST'])
@login_required
@admin_required
def delete_phishing_template(id):
    template = PhishingExample.query.get_or_404(id)
    db.session.delete(template)
    db.session.commit()
    flash('Phishing template deleted.', 'success')
    return redirect(url_for('admin.manage_phishing_templates'))

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
    title = request.form.get('title')
    description = request.form.get('description')
    scenario_type = request.form.get('scenario_type')
    steps = request.form.get('steps')
    mitre_tactics = request.form.get('mitre_tactics')
    difficulty = int(request.form.get('difficulty', 1))
    xp_reward = int(request.form.get('xp_reward', 50))
    
    new_scenario = IncidentScenario(
        title=title,
        description=description,
        scenario_type=scenario_type,
        steps=steps,
        mitre_tactics=mitre_tactics,
        difficulty=difficulty,
        xp_reward=xp_reward
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

@admin_bp.route('/cohort-analytics')
@login_required
@admin_required
def cohort_analytics():
    # Simple aggregates
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
        
    avg_scores = {}
    for mod, stats in module_stats.items():
        avg_scores[mod] = round(stats['total_score'] / stats['count'], 2)
        
    return render_template('cohort_analytics.html', tiers=tiers, avg_scores=avg_scores, total_completions=len(scores))
