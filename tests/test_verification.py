"""
tests/test_verification.py
Comprehensive automated test suite for Chakravyuh verification:
- Models, properties, and relationships
- Auth: registration validation, dual-login (username/email)
- Admin: access control, question CRUD, phishing CRUD, scenario CRUD, module activation toggle, user score reset
- API: leaderboard privacy, modules status, HIBP k-Anonymity range proxy, AI explanation fallback
"""

import json
import unittest
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.game import Game
from app.models.question import Question
from app.models.phishing_example import PhishingExample
from app.models.incident_scenario import IncidentScenario
from app.models.score import Score
from app.models.badge import Badge


class ChakravyuhVerificationTests(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

        # Seed test admin and test user
        self.admin = User(username='testadmin', email='admin@test.org', role='admin', xp=500, level=5, tier=3)
        self.admin.set_password('AdminPass123!')
        db.session.add(self.admin)

        self.student = User(username='teststudent', email='student@test.org', role='student', xp=200, level=2, tier=1)
        self.student.set_password('StudentPass123!')
        db.session.add(self.student)
        db.session.flush()

        # Seed a test game module
        self.game = Game(game_name='Phishing Simulator', game_type='phishing', description='Test phish', is_active=True)
        db.session.add(self.game)

        # Seed a test question
        self.question = Question(
            module='phishing',
            tier=1,
            prompt='Test prompt?',
            choices=json.dumps(['Option One', 'Option Two', 'Option Three', 'Option Four']),
            correct_answer='Option Two',
            explanation='Option Two is correct because of reasons.',
            difficulty=1,
        )
        db.session.add(self.question)

        # Seed a phishing example
        self.phish = PhishingExample(
            sender_name='Security Team',
            sender_email='sec@fake-bank.in',
            subject='Urgent Security Alert',
            body_html='<p>Click here</p>',
            is_phishing=True,
            red_flags=json.dumps(['Urgent wording', 'Suspicious domain']),
            difficulty=2,
            xp_reward=20,
        )
        db.session.add(self.phish)

        # Seed a scenario
        self.scenario = IncidentScenario(
            title='Test Ransomware',
            description='A critical workstation got locked.',
            scenario_type='malware',
            steps=json.dumps(['Isolate machine', 'Check backup']),
            mitre_tactics='Execution, Impact',
            difficulty=2,
            xp_reward=50,
        )
        db.session.add(self.scenario)

        # Seed a score
        self.score = Score(user_id=self.student.id, module_name='phishing', score=80, max_score=100)
        db.session.add(self.score)

        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def login_user(self, email_or_username, password):
        return self.client.post('/auth/login', data={
            'email': email_or_username,
            'password': password
        }, follow_redirects=True)

    # 1. Model Properties
    def test_question_properties(self):
        self.assertEqual(self.question.option_a, 'Option One')
        self.assertEqual(self.question.option_b, 'Option Two')
        self.assertEqual(self.question.option_c, 'Option Three')
        self.assertEqual(self.question.option_d, 'Option Four')
        self.assertEqual(self.question.correct_option, 'B')
        self.assertIn('reasons', self.question.static_explanation)

    def test_phishing_properties(self):
        self.assertEqual(self.phish.difficulty_level_name, 'Intermediate')
        self.assertIn('Urgent wording', self.phish.static_explanation)

    def test_user_properties(self):
        self.assertEqual(self.student.total_points, 200)
        self.assertFalse(self.student.is_admin)
        self.assertTrue(self.admin.is_admin)

    # 2. Authentication: Dual Login & Server-side Validation
    def test_dual_login_username(self):
        res = self.login_user('teststudent', 'StudentPass123!')
        self.assertEqual(res.status_code, 200)

    def test_dual_login_email(self):
        res = self.login_user('student@test.org', 'StudentPass123!')
        self.assertEqual(res.status_code, 200)

    def test_registration_validation_short_password(self):
        res = self.client.post('/auth/register', data={
            'username': 'newuser',
            'email': 'newuser@test.org',
            'password': '123'
        }, follow_redirects=True)
        self.assertIn(b'at least 8 characters', res.data)

    def test_registration_validation_empty_fields(self):
        res = self.client.post('/auth/register', data={
            'username': '',
            'email': 'bad',
            'password': ''
        }, follow_redirects=True)
        self.assertIn(b'required', res.data)

    # 3. Admin Security & Role-Based Access Control
    def test_admin_blocked_for_students(self):
        self.login_user('teststudent', 'StudentPass123!')
        res = self.client.get('/admin/dashboard')
        self.assertEqual(res.status_code, 403)

    def test_admin_accessible_for_admin(self):
        self.login_user('testadmin', 'AdminPass123!')
        res = self.client.get('/admin/dashboard')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Admin Dashboard', res.data)

    # 4. Question Management CRUD
    def test_question_crud(self):
        self.login_user('testadmin', 'AdminPass123!')

        # Add
        res = self.client.post('/admin/manage-questions/add', data={
            'prompt': 'Brand new quiz question?',
            'module': 'general',
            'difficulty': '2',
            'tier': '2',
            'option_a': 'Alpha',
            'option_b': 'Beta',
            'correct_answer': 'Beta',
            'explanation': 'Beta is correct.',
        }, follow_redirects=True)
        self.assertEqual(res.status_code, 200)
        q = Question.query.filter_by(prompt='Brand new quiz question?').first()
        self.assertIsNotNone(q)

        # Edit
        res = self.client.post(f'/admin/manage-questions/edit/{q.id}', data={
            'prompt': 'Updated quiz question prompt?',
            'module': 'general',
            'difficulty': '3',
            'tier': '2',
            'option_a': 'Alpha Updated',
            'option_b': 'Beta Updated',
            'correct_answer': 'Beta Updated',
            'explanation': 'Updated explanation.',
        }, follow_redirects=True)
        self.assertEqual(res.status_code, 200)
        updated_q = Question.query.get(q.id)
        self.assertEqual(updated_q.prompt, 'Updated quiz question prompt?')

        # Delete
        res = self.client.post(f'/admin/manage-questions/delete/{q.id}', follow_redirects=True)
        self.assertEqual(res.status_code, 200)
        self.assertIsNone(Question.query.get(q.id))

    # 5. Module Activation Toggle
    def test_module_activation_toggle(self):
        self.login_user('testadmin', 'AdminPass123!')
        self.assertTrue(self.game.is_active)

        # Toggle to disabled
        res = self.client.post(f'/admin/manage-modules/{self.game.game_id}/toggle', follow_redirects=True)
        self.assertEqual(res.status_code, 200)
        g = Game.query.get(self.game.game_id)
        self.assertFalse(g.is_active)

        # Verify launch route blocks disabled module
        self.login_user('teststudent', 'StudentPass123!')
        launch_res = self.client.get('/phishing/inbox', follow_redirects=True)
        self.assertIn(b'currently deactivated', launch_res.data)

    # 6. User Score Reset
    def test_user_score_reset(self):
        self.login_user('testadmin', 'AdminPass123!')
        self.assertEqual(self.student.xp, 200)
        self.assertEqual(Score.query.filter_by(user_id=self.student.id).count(), 1)

        res = self.client.post(f'/admin/users/{self.student.id}/reset-scores', follow_redirects=True)
        self.assertEqual(res.status_code, 200)

        # Verify student score wiped, user account intact
        u = User.query.get(self.student.id)
        self.assertEqual(u.xp, 0)
        self.assertEqual(Score.query.filter_by(user_id=self.student.id).count(), 0)
        self.assertIsNotNone(u.password_hash)

    # 7. API: Leaderboard & Modules
    def test_leaderboard_privacy(self):
        res = self.client.get('/api/leaderboard')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('leaderboard', data)
        for entry in data['leaderboard']:
            self.assertIn('name', entry)
            self.assertIn('xp', entry)
            self.assertNotIn('email', entry)
            self.assertNotIn('password', entry)

    def test_modules_api(self):
        res = self.client.get('/api/modules')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('modules', data)
        self.assertTrue(len(data['modules']) >= 1)

    # 8. HIBP Range Proxy (k-Anonymity)
    def test_hibp_range_validation(self):
        # Invalid prefix (too short)
        res = self.client.get('/api/pwned-range/123')
        self.assertEqual(res.status_code, 400)

        # Valid 5-hex prefix (mocked or handled safely)
        res = self.client.get('/api/pwned-range/5BAA6')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['prefix'], '5BAA6')

    # 9. AI Explanation with Fallback
    def test_ai_explain_fallback(self):
        res = self.client.post('/api/ai-explain', json={
            'question': 'What is phishing?',
            'user_answer': 'Social trick',
            'is_correct': True,
            'difficulty': 'beginner',
            'static_fallback': 'Phishing uses deception to steal data.'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('explanation', data)
        self.assertIn('is_ai', data)
        self.assertIn('source', data)


if __name__ == '__main__':
    unittest.main()
