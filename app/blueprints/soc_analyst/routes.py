import json
from flask import Blueprint, render_template, request, session, flash, redirect, url_for
from flask_login import login_required, current_user
from app.extensions import db
from app.models.score import Score
from app.models.incident_scenario import IncidentScenario
from app.models.game import Game

soc_analyst_bp = Blueprint('soc_analyst', __name__, template_folder='../../templates/soc_analyst')


@soc_analyst_bp.route('/')
def index():
    game = Game.query.filter_by(game_type='soc').first()
    if game and not game.is_active:
        flash('The SOC Analyst module is currently deactivated by an administrator.', 'warning')
        return redirect(url_for('dashboard.index'))
    return redirect(url_for('soc_analyst.siem_log_analyzer'))


MOCK_SIEM_LOGS = [
    {'id': 1, 'timestamp': '2026-08-22T10:00:00', 'source_ip': '192.168.1.10', 'dest_ip': '10.0.0.5', 'event_type': 'SSH_LOGIN', 'message': 'Successful SSH login for user admin', 'is_malicious': False, 'explanation': 'Normal SSH login activity.'},
    {'id': 2, 'timestamp': '2026-08-22T10:05:12', 'source_ip': '203.0.113.45', 'dest_ip': '10.0.0.5', 'event_type': 'HTTP_GET', 'message': 'GET /index.html 200 OK', 'is_malicious': False, 'explanation': 'Normal web traffic.'},
    {'id': 3, 'timestamp': '2026-08-22T10:06:01', 'source_ip': '198.51.100.22', 'dest_ip': '10.0.0.5', 'event_type': 'SSH_LOGIN_FAILED', 'message': 'Failed SSH login for root', 'is_malicious': True, 'explanation': 'Part of a brute force attack.'},
    {'id': 4, 'timestamp': '2026-08-22T10:06:02', 'source_ip': '198.51.100.22', 'dest_ip': '10.0.0.5', 'event_type': 'SSH_LOGIN_FAILED', 'message': 'Failed SSH login for root', 'is_malicious': True, 'explanation': 'Part of a brute force attack.'},
    {'id': 5, 'timestamp': '2026-08-22T10:06:03', 'source_ip': '198.51.100.22', 'dest_ip': '10.0.0.5', 'event_type': 'SSH_LOGIN_FAILED', 'message': 'Failed SSH login for root', 'is_malicious': True, 'explanation': 'Part of a brute force attack.'},
    {'id': 6, 'timestamp': '2026-08-22T10:15:00', 'source_ip': '10.0.0.5', 'dest_ip': '8.8.8.8', 'event_type': 'DNS_QUERY', 'message': 'Query for example.com', 'is_malicious': False, 'explanation': 'Normal DNS resolution.'},
    {'id': 7, 'timestamp': '2026-08-22T11:00:00', 'source_ip': '10.0.0.5', 'dest_ip': '192.168.1.100', 'event_type': 'NTP_SYNC', 'message': 'Time synchronization', 'is_malicious': False, 'explanation': 'Normal background service activity.'},
    {'id': 8, 'timestamp': '2026-08-22T11:30:45', 'source_ip': '10.0.0.5', 'dest_ip': 'malicious-c2.net', 'event_type': 'HTTPS_OUTBOUND', 'message': 'Periodic connection to unknown domain', 'is_malicious': True, 'explanation': 'C2 beaconing behavior.'},
    {'id': 9, 'timestamp': '2026-08-22T11:45:00', 'source_ip': '192.168.1.20', 'dest_ip': '10.0.0.5', 'event_type': 'PORT_SCAN', 'message': 'Connections to ports 21,22,23,25,80,443', 'is_malicious': True, 'explanation': 'Sequential port access indicates scanning.'},
    {'id': 10, 'timestamp': '2026-08-22T12:00:00', 'source_ip': '10.0.0.5', 'dest_ip': '192.168.1.50', 'event_type': 'BACKUP', 'message': 'Scheduled database backup started', 'is_malicious': False, 'explanation': 'Normal scheduled task.'},
    {'id': 11, 'timestamp': '2026-08-22T14:20:15', 'source_ip': '10.0.0.5', 'dest_ip': '10.0.0.10', 'event_type': 'SMB_ACCESS', 'message': 'Accessing shared drive', 'is_malicious': False, 'explanation': 'Normal internal network activity.'},
    {'id': 12, 'timestamp': '2026-08-22T15:05:30', 'source_ip': '10.0.0.5', 'dest_ip': '192.168.1.10', 'event_type': 'PRIV_ESC', 'message': 'User test_user executed sudo su', 'is_malicious': True, 'explanation': 'Privilege escalation after lateral movement.'},
    {'id': 13, 'timestamp': '2026-08-22T03:15:00', 'source_ip': '10.0.0.5', 'dest_ip': '203.0.113.99', 'event_type': 'DATA_TRANSFER', 'message': 'Large outbound transfer (5GB)', 'is_malicious': True, 'explanation': 'Data exfiltration at an unusual time.'},
    {'id': 14, 'timestamp': '2026-08-22T16:00:00', 'source_ip': '192.168.1.10', 'dest_ip': '10.0.0.5', 'event_type': 'HTTP_GET', 'message': 'GET /api/status 200 OK', 'is_malicious': False, 'explanation': 'Normal API check.'},
    {'id': 15, 'timestamp': '2026-08-22T17:30:00', 'source_ip': '10.0.0.5', 'dest_ip': '192.168.1.100', 'event_type': 'LOGOUT', 'message': 'User admin logged out', 'is_malicious': False, 'explanation': 'Normal session termination.'}
]

MOCK_MITRE_SCENARIOS = [
    {
        'id': 1,
        'description': 'An attacker sends a spearphishing email with a malicious macro attachment to the HR department.',
        'tactic': 'Initial Access',
        'explanation': 'Phishing is a common technique used to gain an initial foothold into a network.'
    },
    {
        'id': 2,
        'description': 'Malware adds a registry key to ensure it runs automatically every time the Windows system boots.',
        'tactic': 'Persistence',
        'explanation': 'Modifying the registry to run on boot ensures the malware persists across restarts.'
    },
    {
        'id': 3,
        'description': 'An adversary runs a script to dump the LSASS memory space to extract plain-text passwords.',
        'tactic': 'Credential Access',
        'explanation': 'Dumping LSASS is a technique to steal credentials from memory.'
    },
    {
        'id': 4,
        'description': 'The attacker encodes their malicious PowerShell commands using Base64 and executes them directly in memory.',
        'tactic': 'Defense Evasion',
        'explanation': 'Obfuscation and in-memory execution are used to evade detection by AV/EDR.'
    },
    {
        'id': 5,
        'description': 'A compromised host periodically sends small HTTP requests to an external IP address to receive new instructions.',
        'tactic': 'Command and Control',
        'explanation': 'Beaconing to an external server is a classic C2 communication pattern.'
    },
    {
        'id': 6,
        'description': 'The attacker compresses sensitive financial documents into a password-protected ZIP file and uploads it to a cloud storage service.',
        'tactic': 'Exfiltration',
        'explanation': 'Stealing sensitive data and moving it outside the network is exfiltration.'
    }
]

MITRE_TACTICS = [
    'Initial Access', 'Execution', 'Persistence', 'Privilege Escalation', 
    'Defense Evasion', 'Credential Access', 'Discovery', 'Lateral Movement', 
    'Collection', 'Exfiltration', 'Command and Control'
]

FALLBACK_IR_SCENARIOS = [
    {
        'id': 1,
        'title': 'Ransomware Attack',
        'description': 'Multiple endpoints are reporting encrypted files and ransom notes.',
        'steps': [
            {'title': 'Alert', 'narrative': 'Help desk receives 15 calls in 10 minutes about inaccessible files.', 'choices': [{'text': 'Ignore it, probably a network glitch', 'correct': False}, {'text': 'Instruct users to disconnect from network', 'correct': True}]},
            {'title': 'Identify', 'narrative': 'You identify the affected machines.', 'choices': [{'text': 'Reboot them', 'correct': False}, {'text': 'Isolate them and capture memory', 'correct': True}]},
            {'title': 'Contain', 'narrative': 'Ransomware is spreading via SMB.', 'choices': [{'text': 'Block SMB traffic between endpoints', 'correct': True}, {'text': 'Shut down the main firewall', 'correct': False}]},
            {'title': 'Eradicate', 'narrative': 'You found the malware binary.', 'choices': [{'text': 'Delete it and push updated AV signatures', 'correct': True}, {'text': 'Just delete the file', 'correct': False}]},
            {'title': 'Recover', 'narrative': 'Systems are clean.', 'choices': [{'text': 'Restore from offline backups', 'correct': True}, {'text': 'Pay the ransom', 'correct': False}]}
        ]
    }
]

@soc_analyst_bp.route('/siem', methods=['GET', 'POST'])
@login_required
def siem_log_analyzer():
    results = None
    if request.method == 'POST':
        selected_ids = request.form.getlist('flagged_logs')
        selected_ids = [int(i) for i in selected_ids]
        
        correct_flags = 0
        false_positives = 0
        missed_malicious = 0
        
        results_details = []
        
        for log in MOCK_SIEM_LOGS:
            flagged = log['id'] in selected_ids
            if log['is_malicious'] and flagged:
                correct_flags += 1
                status = 'Correctly Flagged'
            elif log['is_malicious'] and not flagged:
                missed_malicious += 1
                status = 'Missed Threat'
            elif not log['is_malicious'] and flagged:
                false_positives += 1
                status = 'False Positive'
            else:
                status = 'Correctly Ignored'
                
            results_details.append({
                'log': log,
                'flagged': flagged,
                'status': status
            })
            
        score = max(0, (correct_flags * 10) - (false_positives * 5))
        
        results = {
            'score': score,
            'correct_flags': correct_flags,
            'false_positives': false_positives,
            'missed_malicious': missed_malicious,
            'details': results_details
        }
        
    return render_template('siem_log_analyzer.html', logs=MOCK_SIEM_LOGS, results=results)

@soc_analyst_bp.route('/mitre', methods=['GET', 'POST'])
@login_required
def mitre_mapping():
    results = None
    if request.method == 'POST':
        score = 0
        details = []
        
        for scenario in MOCK_MITRE_SCENARIOS:
            q_id = str(scenario['id'])
            selected = request.form.get(f'tactic_{q_id}')
            correct = scenario['tactic'] == selected
            if correct:
                score += 1
                
            details.append({
                'scenario': scenario,
                'selected': selected,
                'correct': correct
            })
            
        results = {
            'score': score,
            'total': len(MOCK_MITRE_SCENARIOS),
            'details': details
        }
        
    return render_template('mitre_mapping.html', scenarios=MOCK_MITRE_SCENARIOS, tactics=MITRE_TACTICS, results=results)

@soc_analyst_bp.route('/incident-response', methods=['GET', 'POST'])
@login_required
def incident_response_game():
    scenarios = FALLBACK_IR_SCENARIOS
    
    scenario_id = request.args.get('scenario_id', type=int)
    step = request.args.get('step', 0, type=int)
    
    if request.method == 'POST':
        scenario_id = int(request.form.get('scenario_id'))
        step = int(request.form.get('step'))
        choice_idx = int(request.form.get('choice'))
        
        scenario = next((s for s in scenarios if s['id'] == scenario_id), None)
        if scenario:
            current_step = scenario['steps'][step]
            is_correct = current_step['choices'][choice_idx]['correct']
            
            session_key = f'ir_score_{scenario_id}'
            if step == 0:
                session[session_key] = 0
                
            if is_correct:
                session[session_key] = session.get(session_key, 0) + 20
                flash('Correct decision!', 'success')
            else:
                flash('Poor decision. That could make things worse.', 'danger')
                
            next_step = step + 1
            if next_step >= len(scenario['steps']):
                return redirect(url_for('soc_analyst.incident_response_result', scenario_id=scenario_id))
            
            return redirect(url_for('soc_analyst.incident_response_game', scenario_id=scenario_id, step=next_step))
            
    scenario = next((s for s in scenarios if s['id'] == scenario_id), None) if scenario_id else None
    
    return render_template('incident_response_game.html', scenarios=scenarios, scenario=scenario, step=step)

@soc_analyst_bp.route('/incident-response/result')
@login_required
def incident_response_result():
    scenario_id = request.args.get('scenario_id', type=int)
    score = session.get(f'ir_score_{scenario_id}', 0)
    
    return render_template('incident_response_game.html', completed=True, score=score)
