export const mockSimulations = {
  phishingEmails: [
    {
      id: "phish-email-1",
      type: "email",
      subject: "URGENT: Your HDFC NetBanking Account will be Suspended in 24 Hours",
      senderName: "HDFC Bank Alert Services",
      senderEmail: "alert-support@hdfc-verification-security.net",
      date: "Today, 10:14 AM",
      isPhishing: true,
      difficulty: "Beginner",
      bodyHtml: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
          <div style="border-bottom: 2px solid #004c8f; padding-bottom: 10px; margin-bottom: 15px;">
            <strong style="color: #004c8f; font-size: 18px;">HDFC BANK — Security Alert</strong>
          </div>
          <p>Dear Customer,</p>
          <p>We noticed irregular login attempts from an unverified device in Russia (IP: 185.220.101.4). As per RBI mandatory guidelines, your netbanking access is scheduled for <strong>immediate suspension</strong> unless your KYC PAN is re-verified within <strong>2 hours</strong>.</p>
          <div style="margin: 25px 0;">
            <a href="https://secure-hdfc-kyc-portal.xyz/login" style="background-color: #004c8f; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Update KYC & Restore Account Now
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b;">
            Note: Failure to comply will result in a ₹5,000 regulatory penalty fee. Do not reply to this automated system.
          </p>
        </div>
      `,
      headers: {
        "Return-Path": "<attacker-relay@botnet-node44.ru>",
        "Received-SPF": "FAIL (domain does not match server IP 185.220.101.4)",
        "DKIM-Signature": "NONE / INVALID",
        "Target-Link": "https://secure-hdfc-kyc-portal.xyz/login"
      },
      redFlags: [
        "Sender address is `@hdfc-verification-security.net`, not the official `@hdfcbank.com` domain.",
        "SPF check FAILED and Return-Path points to an unknown relay server.",
        "Artificial deadline and fear tactic ('Account suspended in 2 hours + ₹5000 fine').",
        "Target button URL points to a `.xyz` suspicious domain rather than the official banking portal."
      ],
      explanation: "This is a classic urgency-driven banking phishing email. Banks will never threaten immediate fines or send `.xyz` domain links for KYC verification."
    },
    {
      id: "phish-email-2",
      type: "email",
      subject: "Your Netflix Monthly Subscription Payment Failed — Action Required",
      senderName: "Netflix Customer Support",
      senderEmail: "billing@netflix-account-center.com",
      date: "Yesterday, 8:45 PM",
      isPhishing: true,
      difficulty: "Intermediate",
      bodyHtml: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; padding: 20px; border-radius: 8px;">
          <div style="color: #e50914; font-size: 24px; font-weight: 900; margin-bottom: 15px;">NETFLIX</div>
          <h2 style="font-size: 18px; color: #0f172a;">Please update your payment method</h2>
          <p>We're having trouble with your current billing information. We'll try again, but in the meantime, please update your credit or debit card details to continue watching.</p>
          <div style="margin: 20px 0;">
            <a href="http://netflix-billing-update.top/account" style="background-color: #e50914; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
              Update Payment Details
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b;">The Netflix Team | Need help? Visit Help Center</p>
        </div>
      `,
      headers: {
        "Return-Path": "<mailer@unverified-vps.org>",
        "Received-SPF": "SOFTFAIL",
        "DKIM-Signature": "INVALID",
        "Target-Link": "http://netflix-billing-update.top/account"
      },
      redFlags: [
        "Sender address `@netflix-account-center.com` is a spoofed domain (Netflix uses `@netflix.com` or `@mailer.netflix.com`).",
        "The CTA link uses unencrypted `http://` and points to a `.top` top-level domain.",
        "Generic greeting with no account owner name specified."
      ],
      explanation: "Scammers mass-email millions hoping recipients have active streaming subscriptions. Always verify billing directly on the official app."
    },
    {
      id: "phish-email-3",
      type: "email",
      subject: "Security Notification: New Sign-in from Chrome on Windows",
      senderName: "Google Accounts Security",
      senderEmail: "no-reply@accounts.google.com",
      date: "3 days ago, 2:15 PM",
      isPhishing: false,
      difficulty: "Intermediate",
      bodyHtml: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
          <div style="font-size: 20px; font-weight: bold; color: #4285f4; margin-bottom: 10px;">Google</div>
          <h3>New sign-in to your Google Account</h3>
          <p>Your Google Account was just accessed from a new Chrome browser on Windows.</p>
          <p style="background: #f1f5f9; padding: 10px; border-radius: 6px; font-family: monospace;">
            Device: Windows 11 / Chrome 124<br/>
            Location: New Delhi, India<br/>
            Time: Aug 22, 2026 2:15 PM IST
          </p>
          <p>If this was you, you don't need to do anything. If this wasn't you, we'll help you secure your account.</p>
          <div style="margin: 20px 0;">
            <a href="https://myaccount.google.com/notifications" style="background-color: #1a73e8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block;">
              Check Activity
            </a>
          </div>
        </div>
      `,
      headers: {
        "Return-Path": "<3w-z890@bounces.google.com>",
        "Received-SPF": "PASS (google.com designates 209.85.220.41 as permitted sender)",
        "DKIM-Signature": "PASS (domain google.com verified with cryptographic key)",
        "Target-Link": "https://myaccount.google.com/notifications"
      },
      redFlags: [],
      explanation: "This is a legitimate security notification from Google. The domain, SPF/DKIM cryptographic signatures, and link destination (`myaccount.google.com`) are 100% verified."
    }
  ],

  // SMS / Smishing Scenarios
  smishingMessages: [
    {
      id: "sms-1",
      sender: "VK-POWERC",
      text: "Dear Consumer, your electricity power supply will be DISCONNECTED tonight at 9.30 PM from the sub-station because your previous bill was not updated. Please immediately call our nodal officer Mr. Sharma at 9811223344 for immediate relief.",
      isScam: true,
      redFlags: ["Fake power disconnection threat", "Personal 10-digit mobile number provided instead of official toll-free helpline", "Inducing panic to make you call an imposter"],
      advice: "Never call random mobile numbers in electricity warning SMS. Dial your state electricity board's official customer care."
    },
    {
      id: "sms-2",
      sender: "AD-SBIINB",
      text: "Dear SBI User, your YONO reward points worth Rs.9,850 will expire today. Click here http://bit.ly/sbi-yono-claim to redeem points directly into your savings account.",
      isScam: true,
      redFlags: ["Banks never ask you to redeem reward points via bit.ly shortened links", "High monetary lure to encourage clicking", "Fake sender disguise"],
      advice: "Reward points expire automatically or are redeemed inside official netbanking, never via third-party link forms."
    },
    {
      id: "sms-3",
      sender: "JM-SWIGGY",
      text: "Your Swiggy delivery partner Suresh is arriving in 8 minutes with your order #49102. Share delivery code 4821 with him upon arrival.",
      isScam: false,
      redFlags: [],
      advice: "This is a standard order notification. Notice it asks for delivery code only on in-person arrival, not online."
    }
  ],

  // Social Engineering Dialogue Trees
  socialEngineeringScenarios: [
    {
      id: "scenario-digital-arrest",
      title: "The 'Digital Arrest' & Fake Telecom Warrant",
      difficulty: "Advanced",
      character: "Inspector Vikram Rathore (CBI / Cyber Crime Division)",
      avatar: "UserX",
      initialPrompt: "Namaste. I am Inspector Vikram Rathore from Central Cyber Crime Bureau. Your National ID is linked to 14 bank accounts involved in international money laundering and a courier intercepted in Mumbai with narcotics. A non-bailable arrest warrant has been approved by the Magistrate.",
      options: [
        {
          id: "opt-1",
          text: "Oh my god! Sir I am an innocent citizen, please don't arrest me! What can I do to clear my name?",
          outcome: "danger",
          response: "The scammer intensifies the pressure: 'You must stay on this video call, do not speak to anyone, and transfer ₹1,50,000 as a temporary court security deposit to our RBI clearance escrow account immediately!'",
          isCorrect: false,
          feedback: "Falling into panic allows the scammer to manipulate you into transferring funds under emotional stress."
        },
        {
          id: "opt-2",
          text: "I understand. Under Indian Law, police cannot conduct 'Digital Arrest' or demand money on video calls. I am disconnecting and calling 1930 and visiting my local police station.",
          outcome: "safe",
          response: "The scammer immediately becomes angry, threatens you with bogus sections, and hangs up when they realize you understand legal facts!",
          isCorrect: true,
          feedback: "Outstanding! You recognized that 'Digital Arrest' is a complete fiction and invoked official law enforcement channels."
        },
        {
          id: "opt-3",
          text: "Can you send me your CBI ID card photo on WhatsApp so I can verify you first?",
          outcome: "warning",
          response: "The scammer readily sends a forged fake ID card with a photoshopped badge and seal, reinforcing their fake credibility.",
          isCorrect: false,
          feedback: "Scammers have hundreds of forged IDs ready. Never rely on documents sent via WhatsApp for verification."
        }
      ]
    },
    {
      id: "scenario-ceo-giftcard",
      title: "The Urgent Executive WhatsApp Request",
      difficulty: "Beginner",
      character: "Unknown Number (Display Name: CEO Rajesh Mehta)",
      avatar: "Briefcase",
      initialPrompt: "Hi, I am Rajesh (CEO). I'm currently stuck in an important board meeting with investors and can't take phone calls. I urgently need you to purchase 5 Apple Gift Cards of ₹10,000 each for our client gifts. Send the card codes here right now. I will reimburse you by evening.",
      options: [
        {
          id: "opt-1",
          text: "Sure Rajesh sir! Buying them right away and sending codes to this number.",
          outcome: "danger",
          response: "The scammer steals the codes and redeems ₹50,000 within seconds. The real CEO knows nothing about it.",
          isCorrect: false,
          feedback: "Gift card payment requests are the #1 red flag of executive impersonation scams."
        },
        {
          id: "opt-2",
          text: "Hello. Corporate policy requires written email authorization through official company channels. I will verify this through our finance department.",
          outcome: "safe",
          response: "The scammer deletes the WhatsApp message and leaves the chat when they realize corporate protocols are being followed.",
          isCorrect: true,
          feedback: "Perfect defense! Always verify out-of-band requests through established internal channels."
        }
      ]
    }
  ],

  // URL / Typosquatting Inspector Samples
  urlInspectorSamples: [
    {
      id: "url-1",
      url: "https://www.paypal.com/signin",
      domain: "paypal.com",
      status: "Safe",
      isSafe: true,
      analysis: "Exact registered domain of PayPal with EV SSL certificate and no homoglyph replacements."
    },
    {
      id: "url-2",
      url: "https://www.paypa1-security.com/login",
      domain: "paypa1-security.com",
      status: "Malicious Phishing",
      isSafe: false,
      analysis: "Typosquatting: Replaces letter 'l' with numeral '1' and appends '-security.com' to trick careless eyes."
    },
    {
      id: "url-3",
      url: "http://sbi-online-kyc-update.xyz/verify",
      domain: "sbi-online-kyc-update.xyz",
      status: "High Risk Phishing",
      isSafe: false,
      analysis: "Unencrypted HTTP protocol on a generic `.xyz` domain. Official State Bank of India is `onlinesbi.sbi`."
    },
    {
      id: "url-4",
      url: "https://www.google.com/search?q=cyber+security",
      domain: "google.com",
      status: "Safe",
      isSafe: true,
      analysis: "Authentic Google search domain with valid Google Trust Services TLS certificate."
    }
  ],

  // Gamified Quiz Questions
  quizQuestions: [
    {
      id: "quiz-1",
      category: "Phishing Defense",
      question: "You receive an SMS claiming you won a ₹25,00,000 lottery from Kaun Banega Crorepati (KBC), asking for your Aadhaar and bank details. What is this?",
      questionHi: "आपको KBC से ₹25 लाख की लॉटरी जीतने का SMS आता है, जिसमें आधार और बैंक खाता मांगा गया है। यह क्या है?",
      options: [
        "A genuine lucky draw reward",
        "A classic Advance-Fee Lottery Phishing Scam",
        "A tax department notification",
        "A new RBI savings scheme"
      ],
      correctIndex: 1,
      xp: 50,
      explanation: "Lottery scams entice victims with nonexistent prizes, subsequently demanding 'processing fees' or banking credentials.",
      explanationHi: "यह एक फर्जी लॉटरी फ्रॉड है। ठग बड़ा इनाम दिखाकर प्रोसेसिंग फीस या बैंक डिटेल चुराने की कोशिश करते हैं।"
    },
    {
      id: "quiz-2",
      category: "Credentials & 2FA",
      question: "Which of the following methods provides the strongest protection against SIM-swap attacks?",
      questionHi: "SIM-Swap अटैक के खिलाफ इनमें से कौन सा तरीका सबसे ज्यादा सुरक्षा देता है?",
      options: [
        "SMS-based One Time Password (OTP)",
        "App-based Authenticator (e.g., Google/Microsoft Authenticator or Passkeys)",
        "Security questions like 'What is your mother's maiden name?'",
        "Using your birthday as your password"
      ],
      correctIndex: 1,
      xp: 50,
      explanation: "Authenticator Apps and Hardware Passkeys are bound to your physical device, rendering SIM cloning completely ineffective.",
      explanationHi: "ऑथेंटिकेटर ऐप्स और पासकीज आपके डिवाइस से जुड़े होते हैं, इसलिए सिम बदलने पर भी हैकर को कोड नहीं मिलता।"
    },
    {
      id: "quiz-3",
      category: "Social Engineering",
      question: "A stranger on a train asks to borrow your phone to make an 'urgent emergency call'. What risk exists if you hand it unlocked without supervision?",
      questionHi: "ट्रेन में कोई अनजान व्यक्ति इमरजेंसी कॉल के लिए आपका अनलॉक फोन मांगता है। क्या जोखिम हो सकता है?",
      options: [
        "They might dial call-forwarding shortcodes (`*21*number#`) or inspect your banking apps",
        "No risk at all",
        "It will drain your phone battery",
        "It improves your credit score"
      ],
      correctIndex: 0,
      xp: 50,
      explanation: "Malicious actors use call-forwarding codes to intercept future banking OTPs or quickly open payment apps. Always dial the number yourself on speakerphone.",
      explanationHi: "ठग कॉल-फॉरवर्डिंग कोड डालकर आपके आने वाले OTP अपने फोन पर ट्रांसफर कर सकते हैं। हमेशा खुद नंबर डायल करके स्पीकर पर बात करवाएं।"
    }
  ]
};
