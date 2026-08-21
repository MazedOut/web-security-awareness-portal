"""
seed.py
Database seeder for the Chakravyu Web Security Awareness Portal.

Populates the database with realistic demo data including:
- Admin and student users at different tiers
- Phishing email examples (Indian-themed)
- Incident response scenarios
- Achievement badges
- Sample questions

Usage:
    flask --app run.py seed
    or
    python seed.py
"""

import json
import click
from flask.cli import with_appcontext

from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.badge import Badge
from app.models.question import Question
from app.models.phishing_example import PhishingExample
from app.models.incident_scenario import IncidentScenario


def seed_users():
    """Create demo users."""
    users_data = [
        {
            "username": "admin",
            "email": "admin@chakravyu.in",
            "password": "admin123",
            "role": "admin",
            "xp": 500,
            "level": 5,
            "tier": 3,
        },
        {
            "username": "aarav",
            "email": "aarav@student.edu",
            "password": "student123",
            "role": "student",
            "xp": 120,
            "level": 2,
            "tier": 1,
        },
        {
            "username": "priya",
            "email": "priya@student.edu",
            "password": "student123",
            "role": "student",
            "xp": 350,
            "level": 4,
            "tier": 2,
        },
        {
            "username": "karthik",
            "email": "karthik@student.edu",
            "password": "student123",
            "role": "student",
            "xp": 620,
            "level": 7,
            "tier": 3,
        },
    ]

    for data in users_data:
        if not User.query.filter_by(email=data["email"]).first():
            user = User(
                username=data["username"],
                email=data["email"],
                role=data["role"],
                xp=data["xp"],
                level=data["level"],
                tier=data["tier"],
            )
            user.set_password(data["password"])
            db.session.add(user)
            print(f"  Created user: {data['username']} ({data['email']})")

    db.session.commit()


def seed_badges():
    """Create achievement badges."""
    badges_data = [
        {"name": "First Login", "description": "Logged in for the first time", "icon": "🎉", "criteria": "Complete first login"},
        {"name": "Phishing Spotter", "description": "Correctly identified 5 phishing emails", "icon": "🎣", "criteria": "5 correct phishing identifications"},
        {"name": "SQL Master", "description": "Completed the SQL Injection lab", "icon": "💉", "criteria": "Complete SQLi lab"},
        {"name": "XSS Hunter", "description": "Completed the XSS lab", "icon": "🔍", "criteria": "Complete XSS lab"},
        {"name": "SOC Rookie", "description": "Completed first SIEM analysis", "icon": "🛡️", "criteria": "Complete SIEM analysis"},
        {"name": "Incident Commander", "description": "Completed an incident response scenario", "icon": "🚨", "criteria": "Complete IR scenario"},
        {"name": "Streak Warrior", "description": "Maintained a 7-day login streak", "icon": "🔥", "criteria": "7-day streak"},
        {"name": "Cyber Scholar", "description": "Reached Level 10", "icon": "🎓", "criteria": "Reach Level 10"},
        {"name": "Breach Checker", "description": "Used the password breach checker", "icon": "🔐", "criteria": "Check a password for breaches"},
        {"name": "MITRE Expert", "description": "Scored 100% on MITRE mapping", "icon": "🗺️", "criteria": "Perfect MITRE mapping score"},
    ]

    for data in badges_data:
        if not Badge.query.filter_by(name=data["name"]).first():
            badge = Badge(**data)
            db.session.add(badge)
            print(f"  Created badge: {data['name']}")

    db.session.commit()


def seed_phishing_examples():
    """Create realistic phishing and legitimate email examples."""
    examples = [
        # === PHISHING EMAILS ===
        {
            "sender_name": "SBI Security Team",
            "sender_email": "security@sbi-banking-alerts.com",
            "subject": "⚠️ URGENT: Your SBI Account Has Been Temporarily Suspended",
            "body_html": """
                <div style="font-family: Arial, sans-serif;">
                    <p>Dear Valued Customer,</p>
                    <p>We have detected <strong>unusual activity</strong> on your State Bank of India account.
                    Your account has been temporarily suspended for security reasons.</p>
                    <p>To restore access, please verify your identity immediately by clicking the link below:</p>
                    <p><a href="http://sbi-secure-verify.tk/login" style="color: blue;">
                        https://www.onlinesbi.com/verify-account</a></p>
                    <p>If you do not verify within 24 hours, your account will be permanently closed.</p>
                    <p>Regards,<br>SBI Security Department</p>
                </div>
            """,
            "is_phishing": True,
            "red_flags": json.dumps([
                "Sender email uses 'sbi-banking-alerts.com' instead of official 'sbi.co.in'",
                "Creates urgency with 'account suspended' and '24 hours' deadline",
                "Link text shows onlinesbi.com but actual URL is sbi-secure-verify.tk",
                "Uses .tk domain — a free domain commonly used in phishing",
                "Generic greeting 'Dear Valued Customer' instead of your actual name",
                "Threatens permanent account closure to pressure immediate action"
            ]),
            "display_url": "https://www.onlinesbi.com/verify-account",
            "real_url": "http://sbi-secure-verify.tk/login",
            "category": "banking",
            "difficulty": 1,
            "xp_reward": 10,
        },
        {
            "sender_name": "Income Tax Department",
            "sender_email": "refund@incometax-gov-india.org",
            "subject": "Income Tax Refund of ₹18,500 — Verify Your Bank Details",
            "body_html": """
                <div style="font-family: Arial, sans-serif;">
                    <p>Dear Taxpayer,</p>
                    <p>Congratulations! You are eligible for an income tax refund of <strong>₹18,500</strong>
                    for the assessment year 2024-25.</p>
                    <p>To process your refund, we need to verify your bank account details.
                    Please click the link below and enter your PAN, Aadhaar, and bank account information:</p>
                    <p><a href="http://incometax-refund.xyz/claim" style="color: blue;">
                        https://incometax.gov.in/refund/claim</a></p>
                    <p>This link will expire in 48 hours.</p>
                    <p>Ministry of Finance,<br>Government of India</p>
                </div>
            """,
            "is_phishing": True,
            "red_flags": json.dumps([
                "Sender email 'incometax-gov-india.org' is NOT the official domain 'incometax.gov.in'",
                "Income Tax Department never asks for bank details via email",
                "Link text shows official domain but actual URL is incometax-refund.xyz",
                "Asks for sensitive information: PAN, Aadhaar, bank account",
                "Creates urgency with 48-hour expiry",
                "Government refunds are processed through registered bank accounts, not email links"
            ]),
            "display_url": "https://incometax.gov.in/refund/claim",
            "real_url": "http://incometax-refund.xyz/claim",
            "category": "government",
            "difficulty": 1,
            "xp_reward": 10,
        },
        {
            "sender_name": "Amazon India",
            "sender_email": "orders@amazon-india-delivery.com",
            "subject": "Your Order #402-7891234 Has Been Delivered — Confirm Receipt",
            "body_html": """
                <div style="font-family: Arial, sans-serif;">
                    <p>Hello Customer,</p>
                    <p>Your order <strong>#402-7891234</strong> has been delivered to your address.</p>
                    <p>If you did not receive this order or if there is an issue, please click below
                    to report and claim a refund:</p>
                    <p><a href="http://amazon-refund-claim.net/report" style="color: blue;">
                        Report Delivery Issue & Claim Refund</a></p>
                    <p>You can also track all your orders at <a href="https://www.amazon.in">amazon.in</a>.</p>
                    <p>Thank you for shopping with Amazon!</p>
                </div>
            """,
            "is_phishing": True,
            "red_flags": json.dumps([
                "Sender domain 'amazon-india-delivery.com' is not Amazon's official 'amazon.in'",
                "References an order you may not have placed to create confusion",
                "Refund claim link goes to 'amazon-refund-claim.net' — not Amazon",
                "Generic greeting 'Hello Customer' instead of your registered name",
                "Designed to trick you into clicking by suggesting you were charged for something"
            ]),
            "display_url": "https://www.amazon.in/orders/report",
            "real_url": "http://amazon-refund-claim.net/report",
            "category": "ecommerce",
            "difficulty": 1,
            "xp_reward": 10,
        },
        {
            "sender_name": "HDFC Bank Rewards",
            "sender_email": "rewards@hdfc-creditcard-offers.in",
            "subject": "🎁 You've Won 25,000 HDFC Reward Points! Redeem Now",
            "body_html": """
                <div style="font-family: Arial, sans-serif;">
                    <p>Dear HDFC Credit Card Holder,</p>
                    <p>As part of our festive season campaign, you have been selected to receive
                    <strong>25,000 bonus reward points</strong> worth ₹6,250!</p>
                    <p>To redeem your points, please verify your card details:</p>
                    <p><a href="http://hdfc-rewards-festive.com/redeem" style="color: blue;">
                        Redeem Your Reward Points</a></p>
                    <p>Offer valid for the next 72 hours only.</p>
                    <p>Best Regards,<br>HDFC Bank Rewards Team</p>
                </div>
            """,
            "is_phishing": True,
            "red_flags": json.dumps([
                "Domain 'hdfc-creditcard-offers.in' is not HDFC's official 'hdfcbank.com'",
                "Banks never ask you to 'verify card details' via email to redeem points",
                "Too-good-to-be-true offer: 25,000 points for doing nothing",
                "Time pressure: '72 hours only'",
                "HDFC rewards are redeemed through net banking or the official HDFC app"
            ]),
            "display_url": "https://www.hdfcbank.com/rewards",
            "real_url": "http://hdfc-rewards-festive.com/redeem",
            "category": "banking",
            "difficulty": 2,
            "xp_reward": 15,
        },
        {
            "sender_name": "WhatsApp Team",
            "sender_email": "noreply@whatsapp-verify.org",
            "subject": "Action Required: Verify Your WhatsApp Account",
            "body_html": """
                <div style="font-family: Arial, sans-serif;">
                    <p>Dear User,</p>
                    <p>We noticed your WhatsApp account was accessed from a new device in
                    <strong>Lagos, Nigeria</strong>. If this wasn't you, your account may be compromised.</p>
                    <p>Please verify your account immediately to prevent unauthorized access:</p>
                    <p><a href="http://whatsapp-security-check.com/verify" style="color: green;">
                        Verify My Account</a></p>
                    <p>If you don't verify within 12 hours, your account will be deactivated.</p>
                    <p>— WhatsApp Support Team</p>
                </div>
            """,
            "is_phishing": True,
            "red_flags": json.dumps([
                "WhatsApp verification is ONLY done through the app itself, never via email",
                "Fake domain 'whatsapp-verify.org' — WhatsApp emails come from whatsapp.com",
                "Creates fear with 'accessed from Lagos, Nigeria'",
                "Threatens account deactivation",
                "WhatsApp doesn't have a 'Support Team' that sends emails like this"
            ]),
            "display_url": "https://whatsapp.com/verify",
            "real_url": "http://whatsapp-security-check.com/verify",
            "category": "social",
            "difficulty": 2,
            "xp_reward": 15,
        },
        {
            "sender_name": "UIDAI - Aadhaar",
            "sender_email": "update@uidai-aadhaar-gov.in",
            "subject": "Mandatory: Update Your Aadhaar Biometrics Before Dec 31",
            "body_html": """
                <div style="font-family: Arial, sans-serif;">
                    <p>Dear Citizen,</p>
                    <p>As per the Government of India directive, all Aadhaar holders must update
                    their biometric data before <strong>December 31, 2025</strong>.</p>
                    <p>Failure to update will result in your Aadhaar being <strong>deactivated</strong>
                    and linked services (bank accounts, PAN, SIM) being suspended.</p>
                    <p>Update online: <a href="http://aadhaar-update-online.in/biometric" style="color: blue;">
                        https://uidai.gov.in/update-biometrics</a></p>
                    <p>— UIDAI, Government of India</p>
                </div>
            """,
            "is_phishing": True,
            "red_flags": json.dumps([
                "UIDAI's official domain is 'uidai.gov.in', not 'uidai-aadhaar-gov.in'",
                "Biometric updates can only be done at Aadhaar centers, not online via a link",
                "Link text shows uidai.gov.in but real URL is aadhaar-update-online.in",
                "Threatens deactivation of Aadhaar — UIDAI doesn't deactivate for missing updates",
                "Creates panic about linked services being suspended"
            ]),
            "display_url": "https://uidai.gov.in/update-biometrics",
            "real_url": "http://aadhaar-update-online.in/biometric",
            "category": "government",
            "difficulty": 2,
            "xp_reward": 15,
        },
        # === LEGITIMATE EMAILS ===
        {
            "sender_name": "IRCTC",
            "sender_email": "donotreply@irctc.co.in",
            "subject": "Booking Confirmation — PNR: 4521678901 (Delhi → Mumbai)",
            "body_html": """
                <div style="font-family: Arial, sans-serif;">
                    <p>Dear Passenger,</p>
                    <p>Your ticket has been booked successfully.</p>
                    <p><strong>PNR:</strong> 4521678901<br>
                    <strong>Train:</strong> 12952 Mumbai Rajdhani Express<br>
                    <strong>Date:</strong> 15-Nov-2025<br>
                    <strong>Class:</strong> 3A<br>
                    <strong>Status:</strong> CNF/S7/42</p>
                    <p>You can check your PNR status at
                    <a href="https://www.irctc.co.in" style="color: blue;">irctc.co.in</a>.</p>
                    <p>Happy Journey!<br>IRCTC e-Ticketing</p>
                </div>
            """,
            "is_phishing": False,
            "red_flags": json.dumps([]),
            "display_url": "https://www.irctc.co.in",
            "real_url": "https://www.irctc.co.in",
            "category": "government",
            "difficulty": 1,
            "xp_reward": 10,
        },
        {
            "sender_name": "Google",
            "sender_email": "no-reply@accounts.google.com",
            "subject": "Security Alert: New Sign-in to Your Google Account",
            "body_html": """
                <div style="font-family: Arial, sans-serif;">
                    <p>Hello,</p>
                    <p>Your Google Account was just signed in to from a new Windows device.</p>
                    <p><strong>Device:</strong> Windows PC<br>
                    <strong>Location:</strong> Mumbai, India<br>
                    <strong>Time:</strong> Nov 10, 2025, 2:30 PM IST</p>
                    <p>If this was you, you can ignore this email. If not, please review your
                    recent activity at
                    <a href="https://myaccount.google.com/security" style="color: blue;">
                        myaccount.google.com</a>.</p>
                    <p>— The Google Accounts Team</p>
                </div>
            """,
            "is_phishing": False,
            "red_flags": json.dumps([]),
            "display_url": "https://myaccount.google.com/security",
            "real_url": "https://myaccount.google.com/security",
            "category": "social",
            "difficulty": 1,
            "xp_reward": 10,
        },
        {
            "sender_name": "Flipkart",
            "sender_email": "noreply@flipkart.com",
            "subject": "Your Order FLK-789456123 Has Been Shipped!",
            "body_html": """
                <div style="font-family: Arial, sans-serif;">
                    <p>Hi Customer,</p>
                    <p>Great news! Your order <strong>FLK-789456123</strong> has been shipped
                    and is on its way.</p>
                    <p><strong>Item:</strong> boAt Airdopes 141 Bluetooth Earbuds<br>
                    <strong>Expected Delivery:</strong> Nov 18, 2025<br>
                    <strong>Tracking ID:</strong> FKMP12345678</p>
                    <p>Track your order on the
                    <a href="https://www.flipkart.com/track" style="color: blue;">Flipkart app</a>.</p>
                    <p>Thank you for shopping with Flipkart!</p>
                </div>
            """,
            "is_phishing": False,
            "red_flags": json.dumps([]),
            "display_url": "https://www.flipkart.com/track",
            "real_url": "https://www.flipkart.com/track",
            "category": "ecommerce",
            "difficulty": 1,
            "xp_reward": 10,
        },
        {
            "sender_name": "NPCI UPI",
            "sender_email": "alerts@npci.org.in",
            "subject": "UPI Transaction Alert: ₹2,500 Debited",
            "body_html": """
                <div style="font-family: Arial, sans-serif;">
                    <p>Dear Customer,</p>
                    <p>A UPI transaction has been processed from your linked account.</p>
                    <p><strong>Amount:</strong> ₹2,500.00 (Debited)<br>
                    <strong>UPI Ref No:</strong> 432198765012<br>
                    <strong>To:</strong> swiggy@axisbank<br>
                    <strong>Date:</strong> 10-Nov-2025 13:45:22 IST</p>
                    <p>If you did not authorize this transaction, please contact your bank immediately.</p>
                    <p>— National Payments Corporation of India</p>
                </div>
            """,
            "is_phishing": False,
            "red_flags": json.dumps([]),
            "display_url": "",
            "real_url": "",
            "category": "banking",
            "difficulty": 2,
            "xp_reward": 15,
        },
        {
            "sender_name": "LinkedIn",
            "sender_email": "notifications-noreply@linkedin.com",
            "subject": "Priya Sharma viewed your profile",
            "body_html": """
                <div style="font-family: Arial, sans-serif;">
                    <p>Hi there,</p>
                    <p><strong>Priya Sharma</strong>, Software Engineer at Infosys, viewed your profile.</p>
                    <p>See who else has viewed your profile on
                    <a href="https://www.linkedin.com/me/profile-views" style="color: blue;">LinkedIn</a>.</p>
                    <p>— The LinkedIn Team</p>
                </div>
            """,
            "is_phishing": False,
            "red_flags": json.dumps([]),
            "display_url": "https://www.linkedin.com/me/profile-views",
            "real_url": "https://www.linkedin.com/me/profile-views",
            "category": "social",
            "difficulty": 2,
            "xp_reward": 15,
        },
        {
            "sender_name": "Paytm Payments Bank",
            "sender_email": "support@paytm-wallet-refund.co",
            "subject": "Paytm Wallet Refund of ₹3,499 — Action Required",
            "body_html": """
                <div style="font-family: Arial, sans-serif;">
                    <p>Dear Paytm User,</p>
                    <p>A refund of <strong>₹3,499</strong> is pending for your Paytm Wallet.
                    Due to a system error, we need you to confirm your wallet PIN to process the refund.</p>
                    <p>Click here to confirm:
                    <a href="http://paytm-wallet-refund.co/confirm" style="color: blue;">
                        https://paytm.com/refund/confirm</a></p>
                    <p>— Paytm Support</p>
                </div>
            """,
            "is_phishing": True,
            "red_flags": json.dumps([
                "Domain 'paytm-wallet-refund.co' is not Paytm's official 'paytm.com'",
                "Paytm NEVER asks for wallet PIN via email",
                "Link text shows paytm.com but actual URL is paytm-wallet-refund.co",
                "Refunds are processed automatically — you never need to 'confirm' via a link",
                "Asking for wallet PIN is a clear social engineering attempt"
            ]),
            "display_url": "https://paytm.com/refund/confirm",
            "real_url": "http://paytm-wallet-refund.co/confirm",
            "category": "banking",
            "difficulty": 3,
            "xp_reward": 20,
        },
    ]

    for data in examples:
        if not PhishingExample.query.filter_by(subject=data["subject"]).first():
            example = PhishingExample(**data)
            db.session.add(example)
            label = "PHISH" if data["is_phishing"] else "LEGIT"
            print(f"  Created phishing example: [{label}] {data['subject'][:50]}...")

    db.session.commit()


def seed_incident_scenarios():
    """Create incident response scenarios."""
    scenarios = [
        {
            "title": "Ransomware Attack on Hospital Network",
            "description": "A major hospital's IT systems have been encrypted by ransomware. Patient records, scheduling systems, and billing are all inaccessible. The attackers demand 50 Bitcoin within 72 hours.",
            "scenario_type": "incident_response",
            "steps": json.dumps([
                {
                    "step_number": 1,
                    "title": "Alert & Initial Assessment",
                    "narrative": "The IT helpdesk receives multiple calls about encrypted files. The desktop wallpaper on affected machines shows a ransom note. What is your first action?",
                    "choices": [
                        {"text": "Immediately pay the ransom to restore services", "is_correct": False, "feedback": "Never pay ransom as a first response. It doesn't guarantee data recovery and encourages more attacks."},
                        {"text": "Isolate affected systems from the network immediately", "is_correct": True, "feedback": "Correct! Network isolation prevents the ransomware from spreading to more systems."},
                        {"text": "Shut down all hospital systems including unaffected ones", "is_correct": False, "feedback": "Shutting down everything is too drastic. Only isolate confirmed-affected systems to preserve evidence."},
                        {"text": "Post about the incident on social media to warn others", "is_correct": False, "feedback": "Public disclosure should only happen after proper assessment and through official channels."}
                    ]
                },
                {
                    "step_number": 2,
                    "title": "Identification",
                    "narrative": "You've isolated affected machines. Now you need to identify the ransomware variant and scope of infection. What's your approach?",
                    "choices": [
                        {"text": "Check ransom note for ransomware family, analyze encrypted file extensions, check logs for patient zero", "is_correct": True, "feedback": "Correct! Identifying the variant helps determine if decryption tools exist. Finding patient zero reveals the attack vector."},
                        {"text": "Format all affected drives immediately to remove the malware", "is_correct": False, "feedback": "Formatting destroys forensic evidence and may not be necessary if a decryptor exists."},
                        {"text": "Contact the attackers to negotiate", "is_correct": False, "feedback": "Negotiation should only be a last resort and done through law enforcement, not directly."}
                    ]
                },
                {
                    "step_number": 3,
                    "title": "Containment",
                    "narrative": "You've identified the ransomware as LockBit 3.0, spread via a phishing email. 40% of workstations are affected. What containment measures do you implement?",
                    "choices": [
                        {"text": "Block the phishing sender domain, disable compromised accounts, segment the network to protect critical systems", "is_correct": True, "feedback": "Correct! Multi-layered containment addresses the attack vector, compromised credentials, and network spread."},
                        {"text": "Only block the sender domain and hope it stops spreading", "is_correct": False, "feedback": "Blocking the domain alone is insufficient. The malware is already inside the network and may have multiple C2 channels."},
                        {"text": "Disconnect the hospital from the internet entirely", "is_correct": False, "feedback": "While reducing risk, complete internet disconnection may harm patient care systems that need connectivity."}
                    ]
                },
                {
                    "step_number": 4,
                    "title": "Eradication",
                    "narrative": "Containment is holding. Now you need to remove the ransomware and restore systems. You have backups from 48 hours ago. What's your eradication strategy?",
                    "choices": [
                        {"text": "Verify backup integrity, clean affected systems, restore from backups, patch the vulnerability that was exploited", "is_correct": True, "feedback": "Correct! Verify backups first (they might be compromised too), then restore and patch to prevent re-infection."},
                        {"text": "Just restore from backups without patching", "is_correct": False, "feedback": "Restoring without patching leaves the same vulnerability open for another attack."},
                        {"text": "Pay the ransom since 48-hour-old backups mean data loss", "is_correct": False, "feedback": "48 hours of data loss is better than funding cybercriminals. Plus, paying doesn't guarantee full recovery."}
                    ]
                },
                {
                    "step_number": 5,
                    "title": "Recovery & Lessons Learned",
                    "narrative": "Systems are being restored. What post-incident actions should you take?",
                    "choices": [
                        {"text": "Document the incident, report to CERT-In, conduct staff phishing training, improve backup frequency, implement email filtering", "is_correct": True, "feedback": "Correct! A comprehensive post-incident response includes reporting, documentation, and systemic improvements."},
                        {"text": "Just get back to normal operations as quickly as possible", "is_correct": False, "feedback": "Rushing back without learning from the incident means you'll likely be hit again."},
                        {"text": "Fire the employee who clicked the phishing email", "is_correct": False, "feedback": "Blaming individuals is counterproductive. The organization should have had better technical controls and training."}
                    ]
                }
            ]),
            "mitre_tactics": "TA0001,TA0002,TA0040,TA0005",
            "difficulty": 2,
            "xp_reward": 50,
        },
        {
            "title": "Insider Threat — Data Exfiltration",
            "description": "The DLP (Data Loss Prevention) system has flagged a user who transferred 2GB of confidential R&D files to a personal cloud storage account over the past week. The user is a senior engineer who recently gave their resignation notice.",
            "scenario_type": "incident_response",
            "steps": json.dumps([
                {
                    "step_number": 1,
                    "title": "Alert & Assessment",
                    "narrative": "The DLP alert shows the senior engineer uploaded proprietary design documents to a personal Google Drive. Their last day is in 2 weeks. What do you do first?",
                    "choices": [
                        {"text": "Immediately confront the employee and demand an explanation", "is_correct": False, "feedback": "Direct confrontation may tip them off, leading to evidence destruction or accelerated exfiltration."},
                        {"text": "Quietly escalate to HR and Legal, begin covert monitoring of the account's activity", "is_correct": True, "feedback": "Correct! Involving HR/Legal ensures proper procedures. Covert monitoring preserves evidence."},
                        {"text": "Lock the employee's account immediately", "is_correct": False, "feedback": "Immediate lockout alerts the employee and may interfere with evidence gathering."}
                    ]
                },
                {
                    "step_number": 2,
                    "title": "Investigation",
                    "narrative": "With Legal approval, you review the employee's activity logs. What evidence do you collect?",
                    "choices": [
                        {"text": "Email logs, file access history, USB device usage logs, VPN connection records, cloud upload activity", "is_correct": True, "feedback": "Correct! Comprehensive evidence collection from multiple sources builds a strong case."},
                        {"text": "Just check the DLP logs — that's sufficient", "is_correct": False, "feedback": "DLP logs alone may not show the full scope. The employee may have used other channels too."},
                        {"text": "Access the employee's personal email to check what they sent", "is_correct": False, "feedback": "Accessing personal email without a court order is illegal and inadmissible as evidence."}
                    ]
                },
                {
                    "step_number": 3,
                    "title": "Containment",
                    "narrative": "Evidence confirms deliberate exfiltration of trade secrets. The employee also shared files with a competitor's email. What containment actions do you take?",
                    "choices": [
                        {"text": "Revoke access to sensitive systems, disable cloud sync, coordinate with HR for immediate supervised termination", "is_correct": True, "feedback": "Correct! Remove access without tipping off, then handle termination through proper HR channels."},
                        {"text": "Delete the employee's account and all their files", "is_correct": False, "feedback": "Deleting evidence would compromise any legal action against the employee."},
                        {"text": "Send a company-wide email warning about the insider threat", "is_correct": False, "feedback": "Public disclosure during an active investigation can compromise legal proceedings."}
                    ]
                },
                {
                    "step_number": 4,
                    "title": "Eradication & Recovery",
                    "narrative": "The employee has been terminated. What steps ensure the exfiltrated data doesn't cause further harm?",
                    "choices": [
                        {"text": "Work with Legal to send cease-and-desist to the competitor, request Google to preserve/remove the uploaded files, rotate any API keys or credentials the employee had access to", "is_correct": True, "feedback": "Correct! Legal action, platform cooperation, and credential rotation are all necessary."},
                        {"text": "Just change the passwords on shared systems", "is_correct": False, "feedback": "Password changes alone don't address the already-exfiltrated data or legal implications."}
                    ]
                },
                {
                    "step_number": 5,
                    "title": "Post-Incident",
                    "narrative": "What systemic improvements should you recommend?",
                    "choices": [
                        {"text": "Implement automated access revocation for departing employees, enhance DLP rules, add USB port restrictions, conduct regular access reviews", "is_correct": True, "feedback": "Correct! Systemic controls prevent future insider threats better than relying on individual trust."},
                        {"text": "Ban all employees from using cloud storage", "is_correct": False, "feedback": "Blanket bans reduce productivity. Better to implement proper DLP and access controls."},
                        {"text": "Install keyloggers on all employee machines", "is_correct": False, "feedback": "Mass surveillance is legally problematic and destroys trust. Targeted monitoring with legal basis is the proper approach."}
                    ]
                }
            ]),
            "mitre_tactics": "TA0009,TA0010,TA0001",
            "difficulty": 3,
            "xp_reward": 60,
        },
        {
            "title": "DDoS Attack with Data Breach Cover",
            "description": "Your e-commerce platform is experiencing a massive DDoS attack. While the security team is focused on mitigating the DDoS, a separate intrusion is discovered — attackers used the DDoS as a smokescreen to breach the customer database.",
            "scenario_type": "incident_response",
            "steps": json.dumps([
                {
                    "step_number": 1,
                    "title": "Alert",
                    "narrative": "Traffic spikes to 100x normal levels. The website is down. Meanwhile, a junior analyst notices unusual database queries. What's your priority?",
                    "choices": [
                        {"text": "Focus only on DDoS mitigation — the database alert can wait", "is_correct": False, "feedback": "Ignoring the DB alert is exactly what the attackers want. DDoS is often used as a distraction."},
                        {"text": "Split the team: one group handles DDoS mitigation, another investigates the database anomaly immediately", "is_correct": True, "feedback": "Correct! Recognizing that DDoS can be a smokescreen is crucial. Always investigate concurrent anomalies."},
                        {"text": "Shut down the entire infrastructure", "is_correct": False, "feedback": "Complete shutdown causes maximum business impact and may not stop the data breach if the attacker already has access."}
                    ]
                },
                {
                    "step_number": 2,
                    "title": "Identify",
                    "narrative": "Investigation reveals: DDoS is a volumetric UDP flood, and a SQL injection was used to dump the customer table (50,000 records with names, emails, hashed passwords). What do you identify as the scope?",
                    "choices": [
                        {"text": "Two concurrent attacks: DDoS (availability) and SQLi data breach (confidentiality). Both need parallel response tracks.", "is_correct": True, "feedback": "Correct! This is a coordinated multi-vector attack. Both the DDoS and the breach need separate but coordinated responses."},
                        {"text": "The DDoS is the main attack; the SQL injection is probably automated", "is_correct": False, "feedback": "Underestimating the breach is dangerous. The SQLi was likely the real objective, with DDoS as cover."}
                    ]
                },
                {
                    "step_number": 3,
                    "title": "Contain",
                    "narrative": "How do you contain both attacks?",
                    "choices": [
                        {"text": "Enable DDoS mitigation (CDN/WAF scrubbing), patch the SQLi vulnerability, revoke the compromised database credentials, isolate the breached DB server", "is_correct": True, "feedback": "Correct! Address both attack vectors: DDoS at the network edge and SQLi at the application/database layer."},
                        {"text": "Just enable the CDN's DDoS protection", "is_correct": False, "feedback": "CDN only handles the DDoS. The SQL injection breach still needs containment."},
                        {"text": "Block all traffic from the attacking IP range", "is_correct": False, "feedback": "DDoS uses many IPs (often botnets), and the SQLi attacker may use a different IP than the DDoS sources."}
                    ]
                },
                {
                    "step_number": 4,
                    "title": "Eradicate",
                    "narrative": "DDoS is mitigated and the SQLi is patched. 50,000 customer records were stolen. What now?",
                    "choices": [
                        {"text": "Audit all input validation across the app, implement WAF rules, rotate all database credentials, conduct full vulnerability scan", "is_correct": True, "feedback": "Correct! The SQLi vulnerability suggests systemic input validation issues. A comprehensive audit prevents similar breaches."},
                        {"text": "Just patch the one SQL injection point", "is_correct": False, "feedback": "If one SQLi existed, there are likely others. A single patch gives false confidence."}
                    ]
                },
                {
                    "step_number": 5,
                    "title": "Recover & Report",
                    "narrative": "What are your post-incident obligations for the data breach?",
                    "choices": [
                        {"text": "Notify affected users within 72 hours, report to CERT-In, engage forensics firm, implement breach notification as per IT Act, offer credit monitoring", "is_correct": True, "feedback": "Correct! Data breach notification is legally required. CERT-In must be informed. Affected users deserve transparency."},
                        {"text": "Keep quiet about the breach to avoid reputation damage", "is_correct": False, "feedback": "Concealing a breach violates the IT Act and can lead to severe legal penalties. It also erodes trust when inevitably discovered."},
                        {"text": "Notify users but don't report to CERT-In", "is_correct": False, "feedback": "CERT-In reporting is mandatory for significant cybersecurity incidents in India."}
                    ]
                }
            ]),
            "mitre_tactics": "TA0001,TA0040,TA0009,TA0010",
            "difficulty": 3,
            "xp_reward": 60,
        },
    ]

    for data in scenarios:
        if not IncidentScenario.query.filter_by(title=data["title"]).first():
            scenario = IncidentScenario(**data)
            db.session.add(scenario)
            print(f"  Created scenario: {data['title'][:50]}...")

    db.session.commit()


def seed_questions():
    """Create sample quiz questions."""
    questions = [
        {
            "module": "phishing",
            "tier": 1,
            "prompt": "What is the most reliable way to verify if an email is genuinely from your bank?",
            "choices": json.dumps(["Click the link in the email", "Check the sender's email domain", "Reply to the email asking if it's real", "Forward it to friends"]),
            "correct_answer": "Check the sender's email domain",
            "explanation": "Always verify the sender's domain matches the official domain. Banks use their official domain (e.g., @sbi.co.in), not random domains.",
            "difficulty": 1,
        },
        {
            "module": "phishing",
            "tier": 1,
            "prompt": "You receive an SMS saying 'Your SBI account will be blocked. Click here to verify: bit.ly/sbi-verify'. What should you do?",
            "choices": json.dumps(["Click the link immediately", "Call SBI's official number to verify", "Reply STOP to the SMS", "Ignore it — banks never send such SMS"]),
            "correct_answer": "Call SBI's official number to verify",
            "explanation": "Never click links in unsolicited SMS. Contact your bank directly through their official helpline number.",
            "difficulty": 1,
        },
        {
            "module": "general",
            "tier": 1,
            "prompt": "Which of the following is the strongest password?",
            "choices": json.dumps(["password123", "MyD0g$Name!2024", "12345678", "qwerty"]),
            "correct_answer": "MyD0g$Name!2024",
            "explanation": "Strong passwords use a mix of uppercase, lowercase, numbers, and symbols. They should be at least 12 characters long.",
            "difficulty": 1,
        },
        {
            "module": "sqli",
            "tier": 3,
            "prompt": "Which SQL injection payload would bypass a login form that uses: SELECT * FROM users WHERE username='INPUT' AND password='INPUT'?",
            "choices": json.dumps(["admin", "' OR 1=1 --", "SELECT * FROM users", "DROP TABLE users"]),
            "correct_answer": "' OR 1=1 --",
            "explanation": "The payload ' OR 1=1 -- closes the username string, adds an always-true condition, and comments out the rest of the query.",
            "difficulty": 3,
        },
        {
            "module": "xss",
            "tier": 3,
            "prompt": "Which type of XSS attack stores the malicious script in the server's database?",
            "choices": json.dumps(["Reflected XSS", "Stored XSS", "DOM-based XSS", "Blind XSS"]),
            "correct_answer": "Stored XSS",
            "explanation": "Stored (Persistent) XSS saves the malicious script in the database. It executes whenever other users view the affected page.",
            "difficulty": 3,
        },
        {
            "module": "general",
            "tier": 2,
            "prompt": "What does 'k-Anonymity' mean in the context of password breach checking?",
            "choices": json.dumps([
                "The password is encrypted k times",
                "Only a partial hash is sent to the server, preserving privacy",
                "The password is checked against k databases",
                "The user remains anonymous while checking"
            ]),
            "correct_answer": "Only a partial hash is sent to the server, preserving privacy",
            "explanation": "k-Anonymity in HIBP means only the first 5 characters of the SHA-1 hash are sent. The server returns all matching suffixes, and matching is done locally.",
            "difficulty": 2,
        },
    ]

    for data in questions:
        if not Question.query.filter_by(prompt=data["prompt"]).first():
            q = Question(**data)
            db.session.add(q)
            print(f"  Created question: {data['prompt'][:50]}...")

    db.session.commit()


def seed_all():
    """Run all seeders."""
    print("\n🌱 Seeding database...\n")

    print("📦 Creating users...")
    seed_users()

    print("\n🏆 Creating badges...")
    seed_badges()

    print("\n📧 Creating phishing examples...")
    seed_phishing_examples()

    print("\n🚨 Creating incident scenarios...")
    seed_incident_scenarios()

    print("\n❓ Creating questions...")
    seed_questions()

    print("\n✅ Database seeding complete!\n")
    print("Demo accounts:")
    print("  Admin:    admin@chakravyu.in / admin123")
    print("  Student:  aarav@student.edu / student123  (Tier 1)")
    print("  Student:  priya@student.edu / student123  (Tier 2)")
    print("  Student:  karthik@student.edu / student123  (Tier 3)")
    print()


# Register as Flask CLI command
@click.command("seed")
@with_appcontext
def seed_command():
    """Seed the database with demo data."""
    seed_all()


def register_seed_command(app):
    """Register the seed CLI command with the Flask app."""
    app.cli.add_command(seed_command)


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
        seed_all()
