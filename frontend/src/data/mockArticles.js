export const mockArticles = [
  {
    id: "art-web-basics",
    category: "Web Security Basics",
    title: "Demystifying HTTPS, Padlocks & Safe Web Browsing",
    titleHi: "HTTPS, पैडलॉक और सुरक्षित वेब ब्राउज़िंग की पूरी समझ",
    readTime: "5 min read",
    difficulty: "Beginner",
    summary: "Understand what happens when you visit a website, why the padlock icon matters, and how to spot insecure connections.",
    summaryHi: "वेबसाइट खोलते समय क्या होता है, पैडलॉक का क्या महत्व है और असुरक्षित कनेक्शनों को कैसे पहचानें।",
    stage1SimpleExplanation: {
      en: "Imagine sending a private postcard through standard mail where anyone handling it can read your letter. That's HTTP (Unencrypted). HTTPS is like placing that message in an armored steel safe that only you and the recipient bank or website have the secret key to open.",
      hi: "मान लीजिए आप एक पोस्टकार्ड भेज रहे हैं जिसे रास्ते में कोई भी पढ़ सकता है। यह है HTTP (असुरक्षित)। HTTPS उस पत्र को एक स्टील की तिजोरी में बंद करने जैसा है जिसकी चाबी सिर्फ आपके और बैंक/वेबसाइट के पास है।"
    },
    stage2RealExample: {
      en: "Rohan connected to free railway Wi-Fi to pay a ₹500 electricity bill on an old `http://` website. An attacker on the same open Wi-Fi used a network sniffer tool to intercept his unencrypted password and credit card number in plain text.",
      hi: "रोहन ने रेलवे स्टेशन के फ्री वाई-फाई पर बिना `https://` वाली पुरानी वेबसाइट से ₹500 का बिजली बिल भरा। उसी वाई-फाई पर बैठे एक हैकर ने रोहन का पासवर्ड और कार्ड नंबर सादे अक्षरों में चुरा लिया।"
    },
    stage3WarningSigns: [
      { sign: "URL starts with `http://` instead of `https://`", risk: "High" },
      { sign: "Browser shows 'Not Secure' or a broken red shield alert", risk: "Critical" },
      { sign: "Sudden aggressive popups urging you to download an 'Antivirus update'", risk: "High" },
      { sign: "Domain name has weird spelling mistakes (e.g. `g00gle.com` or `bankk-login.co`)", risk: "Critical" }
    ],
    stage4ProtectionSteps: [
      "Always check for `https://` and a valid security certificate before typing passwords or card details.",
      "Never enter sensitive banking credentials on public Wi-Fi without a trusted VPN.",
      "Install browser extensions like HTTPS Everywhere / uBlock Origin.",
      "Keep your browser updated to automatically block known malicious domains."
    ],
    stage5InteractiveChallenge: {
      question: "Which of the following websites is completely safe to enter your bank netbanking password?",
      questionHi: "इनमें से किस वेबसाइट पर बैंक नेटबैंकिंग पासवर्ड डालना सुरक्षित है?",
      options: [
        "http://secure-hdfcbank-login.net",
        "https://www.hdfcbank.com",
        "https://hdfcbank-kyc-update.xyz",
        "http://192.168.1.1/banking"
      ],
      correctIndex: 1,
      explanation: "`https://www.hdfcbank.com` is the official domain with valid HTTPS encryption. The others are either unencrypted HTTP or deceptive lookalike domains.",
      explanationHi: "`https://www.hdfcbank.com` असली और वैध HTTPS एन्क्रिप्शन वाला आधिकारिक डोमेन है। बाकी फर्जी या असुरक्षित हैं।"
    },
    relatedSimId: "sim-url-inspector"
  },
  {
    id: "art-phishing-101",
    category: "Phishing Awareness",
    title: "Spotting Phishing, Smishing & Deceptive Urgent Messages",
    titleHi: "फिशिंग, फर्जी SMS और डराने वाले संदेशों को कैसे पहचानें",
    readTime: "6 min read",
    difficulty: "Beginner",
    summary: "Learn the psychological tricks scam artists use to induce panic, fake deadlines, and steal your one-time passwords (OTPs).",
    summaryHi: "साइबर ठग लोगों में डर और जल्दबाजी पैदा करके कैसे OTP और पासवर्ड चुराते हैं, जानें आसान भाषा में।",
    stage1SimpleExplanation: {
      en: "Phishing is digital fishing. Attackers throw fake bait (a fake message, SMS, or email pretending to be your bank, electricity board, or Netflix) hoping you will bite and surrender your passwords or OTPs.",
      hi: "फिशिंग इंटरनेट का कांटा डालने जैसा है। धोखेबाज एक लालच या डर भरा फर्जी मैसेज (जैसे बिजली कटने की धमकी या लॉटरी) भेजते हैं ताकि आप घबराकर अपना पासवर्ड या OTP उन्हें दे दें।"
    },
    stage2RealExample: {
      en: "Sunita received an SMS: 'Dear Customer, your electricity will be disconnected tonight at 9:30 PM due to unpaid bill. Call officer at 9876543210 immediately.' In panic, she called, downloaded a remote sharing app, and lost ₹45,000.",
      hi: "सुनीता को SMS आया: 'प्रिय उपभोक्ता, बिल न भरने के कारण आज रात 9:30 बजे आपकी बिजली काट दी जाएगी। तुरंत इस नंबर पर कॉल करें।' घबराहट में उन्होंने कॉल की और ठग के कहने पर स्क्रीन शेयर ऐप डाउनलोड कर ₹45,000 गंवा दिए।"
    },
    stage3WarningSigns: [
      { sign: "Artificial urgency: 'Act within 10 minutes or account blocked!'", risk: "Critical" },
      { sign: "Requests for OTP, CVV, or PIN (Legitimate institutions NEVER ask for OTP)", risk: "Critical" },
      { sign: "Sender address comes from a free email like `hdfc_helpdesk@gmail.com`", risk: "High" },
      { sign: "Shortened links like `bit.ly/kyc-fix` or unknown domains like `.top`, `.xyz`", risk: "High" }
    ],
    stage4ProtectionSteps: [
      "Remember: No bank, police officer, or electricity board will EVER ask for your OTP or password.",
      "If a message claims urgent action, close it and open the official app directly to verify.",
      "Never install screen-sharing apps (AnyDesk, TeamViewer, RustDesk) on instructions from unknown callers.",
      "Report fake SMS immediately to 1930 (National Cyber Crime Helpline)."
    ],
    stage5InteractiveChallenge: {
      question: "You receive an email from 'Netflix Support' saying your payment failed and your account is locked. What is the safest first step?",
      questionHi: "'Netflix सपोर्ट' से ईमेल आया कि आपका पेमेंट फेल हो गया है। सबसे सुरक्षित पहला कदम क्या है?",
      options: [
        "Click the link inside the email and enter your card details quickly",
        "Reply to the email with your username and password",
        "Open a fresh browser tab, go directly to netflix.com, and check your account status",
        "Forward the email to all your friends"
      ],
      correctIndex: 2,
      explanation: "Always navigate directly to the official platform yourself rather than clicking links inside unexpected urgency emails.",
      explanationHi: "ईमेल के लिंक पर क्लिक करने के बजाय खुद आधिकारिक वेबसाइट/ऐप खोलकर खाता स्थिति जांचना सबसे सुरक्षित तरीका है।"
    },
    relatedSimId: "sim-phishing-lab"
  },
  {
    id: "art-password-safety",
    category: "Password Safety",
    title: "Beyond 'Password123': Building Fortress Passphrases & 2FA",
    titleHi: "'Password123' से आगे: मजबूत पासफ़्रेज़ और 2FA का कवच",
    readTime: "5 min read",
    difficulty: "Beginner",
    summary: "Why complexity alone fails against modern GPU crackers, how long passphrases win, and why Two-Factor Authentication is non-negotiable.",
    summaryHi: "छोटा लेकिन कठिन पासवर्ड क्यों आसानी से क्रैक हो जाता है, 4 शब्दों का पासफ़्रेज़ कैसे सबसे सुरक्षित है और 2FA क्यों जरूरी है।",
    stage1SimpleExplanation: {
      en: "A password with 8 characters like `Tr0ub4dor&` takes modern supercomputers mere minutes to crack. A 4-word memorable passphrase like `Mango-River-Bicycle-2026!` takes billions of years to crack, while being 10x easier for you to remember!",
      hi: "8 अक्षरों का पासवर्ड जैसे `P@ss123` हैकर्स के कंप्यूटर कुछ ही सेकंड में तोड़ लेते हैं। लेकिन 4 आसान शब्दों का पासफ़्रेज़ जैसे `Aam-Nadi-Cycle-2026!` अरबों सालों तक भी क्रैक नहीं हो सकता!"
    },
    stage2RealExample: {
      en: "Vikram reused the same password across 15 websites. When a small gaming forum was breached, hackers tried his leaked password on his primary Gmail and gained access to his bank accounts and social media.",
      hi: "विक्रम हर जगह एक ही पासवर्ड इस्तेमाल करता था। जब एक गेमिंग वेबसाइट का डेटा लीक हुआ, तो हैकर्स ने वही पासवर्ड उसके मुख्य ईमेल पर आजमाया और सारे अकाउंट्स हैक कर लिए।"
    },
    stage3WarningSigns: [
      { sign: "Reusing identical passwords across work, email, and shopping sites", risk: "Critical" },
      { sign: "Passwords containing your name, birthday, pet name, or '123456'", risk: "High" },
      { sign: "Not having 2-Step Verification / Authenticator App enabled", risk: "Critical" },
      { sign: "Writing down passwords on sticky notes attached to monitors", risk: "Medium" }
    ],
    stage4ProtectionSteps: [
      "Use 4 random unrelated words separated by dashes or numbers for your master passwords.",
      "Use a reputable Password Manager (Bitwarden, 1Password, or Apple/Google Keychain) to create unique passwords for every site.",
      "Enable 2FA (Two-Factor Authentication) using an Authenticator App (Google Authenticator, Microsoft Authenticator) instead of SMS OTP.",
      "Check your email on Have I Been Pwned regularly to see if your credentials leaked in a public data breach."
    ],
    stage5InteractiveChallenge: {
      question: "Which of the following passwords has the highest mathematical resistance against modern GPU brute-force attacks?",
      questionHi: "इनमें से कौन सा पासवर्ड हैकर्स के कंप्यूटर द्वारा तोड़े जाने के खिलाफ सबसे ज्यादा मजबूत है?",
      options: [
        "P@ssw0rd1",
        "Summer2026!",
        "Blue-Elephant-Dancing-Chai-99",
        "qwertyuiop"
      ],
      correctIndex: 2,
      explanation: "Length is king. A 29-character passphrase with 4 distinct words and numbers has exponentially higher entropy (over 90 bits) than short complex passwords.",
      explanationHi: "लंबाई सबसे महत्वपूर्ण है। 4 अलग-अलग शब्दों वाला 29 अक्षरों का पासफ़्रेज़ गणितीय रूप से अरबों गुना ज्यादा सुरक्षित होता है।"
    },
    relatedSimId: "sim-password-lab"
  },
  {
    id: "art-social-engineering",
    category: "Social Engineering",
    title: "The Art of Human Hacking: Pretexting, Urgency & Fake Authority",
    titleHi: "इंसानी दिमाग की हैकिंग: दबाव, डर और फर्जी अफसरों के जाल",
    readTime: "7 min read",
    difficulty: "Intermediate",
    summary: "Attackers don't always hack code—they hack human psychology through fear, sympathy, or false authority.",
    summaryHi: "साइबर अपराधी सिर्फ कंप्यूटर हैक नहीं करते—वे इंसान के डर, लालच या भरोसे का फायदा उठाकर फ्रॉड करते हैं।",
    stage1SimpleExplanation: {
      en: "Social Engineering is psychological manipulation. Instead of finding a glitch in software, the attacker tricks a real human into handing over keys, granting remote access, or authorizing a fraudulent transfer.",
      hi: "सोशल इंजीनियरिंग का मतलब है इंसान के दिमाग से खेलना। हैकर्स सॉफ्टवेयर में कमी निकालने के बजाय आपसे झूठ बोलकर खुद चाबी हासिल कर लेते हैं।"
    },
    stage2RealExample: {
      en: "An elderly gentleman received a call from a man pretending to be a Telecom Officer: 'Your Aadhaar is linked to illegal narcotics. A police arrest warrant is issued. Transfer ₹2 Lakhs to the court clearance account immediately or face arrest within 1 hour.'",
      hi: "एक वरिष्ठ नागरिक को फर्जी पुलिस/टेलीकॉम अफसर बनकर फोन आया: 'आपके आधार कार्ड से गैरकानूनी काम हुआ है। अरेस्ट वारंट जारी है। अगर 1 घंटे में ₹2 लाख वेरिफिकेशन खाते में नहीं डाले तो पुलिस आ जाएगी।' इसे डिजिटल अरेस्ट स्कैम कहते हैं।"
    },
    stage3WarningSigns: [
      { sign: "Callers claiming to be CBI, Police, or FedEx putting you under 'Digital Arrest'", risk: "Critical" },
      { sign: "Extreme pressure: Demanding you stay on video call and not tell family", risk: "Critical" },
      { sign: "Boss/Manager messaging on WhatsApp from an unknown number asking for urgent gift cards", risk: "High" },
      { sign: "Overly friendly strangers offering romantic interest or fake crypto investment returns", risk: "High" }
    ],
    stage4ProtectionSteps: [
      "Understand: Indian Law Enforcement NEVER conducts 'Digital Arrest' via Skype or WhatsApp video calls.",
      "When someone claims an emergency, disconnect immediately and call the official verified helpline.",
      "Talk to family members or trusted friends before making any urgent financial transfer.",
      "Never share screen access using AnyDesk or QuickSupport with unknown callers."
    ],
    stage5InteractiveChallenge: {
      question: "Someone calls claiming to be a CBI Inspector over WhatsApp video call and demands a security deposit to drop a case. What is the correct response?",
      questionHi: "कोई व्यक्ति WhatsApp वीडियो कॉल पर CBI अफसर बनकर केस वापस लेने के लिए पैसे मांगता है। सही कदम क्या है?",
      options: [
        "Pay the money quickly so you don't get arrested",
        "Disconnect immediately, block the number, and file a report on cybercrime.gov.in / call 1930",
        "Share your bank statements to prove your innocence",
        "Ask them to send their CBI badge photo over WhatsApp"
      ],
      correctIndex: 1,
      explanation: "Real police and investigative agencies never conduct arrests or demand money via WhatsApp video calls. Hang up and report to 1930 immediately.",
      explanationHi: "असली पुलिस कभी भी WhatsApp वीडियो कॉल पर अरेस्ट नहीं करती और न ही पैसे मांगती है। तुरंत कॉल काटें और 1930 पर रिपोर्ट करें।"
    },
    relatedSimId: "sim-social-eng"
  },
  {
    id: "art-safe-browsing",
    category: "Safe Browsing",
    title: "Public Wi-Fi, Rogue Extensions & Malicious Downloads",
    titleHi: "पब्लिक वाई-फाई, खतरनाक ब्राउज़र एक्सटेंशन और फर्जी डाउनलोड",
    readTime: "5 min read",
    difficulty: "Intermediate",
    summary: "How open networks expose your data packets, the danger of unverified browser add-ons, and how to browse securely.",
    summaryHi: "हवाई अड्डे या कैफ़े का खुला वाई-फाई कैसे आपकी जासूसी करा सकता है और सुरक्षित रहने के आसान नियम।",
    stage1SimpleExplanation: {
      en: "Public Wi-Fi at airports or coffee shops has no encryption barrier. Anyone sitting nearby with cheap software can listen to unencrypted traffic passing through the airwaves.",
      hi: "होटल या स्टेशन का खुला वाई-फाई बिना दीवार वाले कमरे की तरह है। वहां कोई भी आपकी ऑनलाइन गतिविधियों को आसानी से देख सकता है।"
    },
    stage2RealExample: {
      en: "Pooja installed a free 'Video Downloader' chrome extension from a third-party website. The extension secretly injected advertisements, tracked her search history, and stole login session cookies.",
      hi: "पूजा ने किसी वेबसाइट से एक फ्री वीडियो डाउनलोडर एक्सटेंशन डाउनलोड किया। उस एक्सटेंशन ने चुपके से उसके फेसबुक और ईमेल के लॉगिन कुकीज चुरा लिए।"
    },
    stage3WarningSigns: [
      { sign: "Public Wi-Fi networks requiring no password or login credentials", risk: "Medium" },
      { sign: "Browser extensions asking for 'Read and change all your data on all websites'", risk: "High" },
      { sign: "Files downloading as `.exe`, `.scr`, or `.bat` when you expected a `.pdf`", risk: "Critical" },
      { sign: "Search engine results showing fake 'Sponsored Ad' links above genuine company websites", risk: "High" }
    ],
    stage4ProtectionSteps: [
      "Use a reputable Virtual Private Network (VPN) whenever connecting to public or unverified networks.",
      "Only install browser extensions from the official Chrome Web Store / Firefox Add-ons with high review counts.",
      "Check file extensions carefully before opening downloads (e.g. `Invoice.pdf.exe` is malware).",
      "Do not save payment cards in browser autofill on shared devices."
    ],
    stage5InteractiveChallenge: {
      question: "You downloaded an electricity bill that is named `Bill_August2026.pdf.exe`. What should you do?",
      questionHi: "आपने बिजली बिल डाउनलोड किया जिसका नाम `Bill_August2026.pdf.exe` है। आपको क्या करना चाहिए?",
      options: [
        "Double click to open it and check the bill amount",
        "Rename it to `.pdf` and open it",
        "Do NOT open it; delete it immediately as it is an executable malware disguise",
        "Send it to your colleagues"
      ],
      correctIndex: 2,
      explanation: "A file ending in `.exe` is an executable program, not a document. Attackers append `.pdf` in the filename to deceive victims.",
      explanationHi: "जिस फाइल के अंत में `.exe` लगा हो वह एक कंप्यूटर प्रोग्राम/वायरस होती है, PDF नहीं। इसे तुरंत डिलीट कर दें।"
    },
    relatedSimId: "sim-url-inspector"
  },
  {
    id: "art-emerging-threats",
    category: "Emerging Threats",
    title: "AI Voice Cloning, Deepfakes & Malicious QR Codes (Quishing)",
    titleHi: "AI वॉयस क्लोनिंग, डीपफेक और फर्जी QR कोड (क्विशिंग) के नए खतरे",
    readTime: "6 min read",
    difficulty: "Advanced",
    summary: "Learn how generative AI enables voice impersonation scams and why scanning unknown QR codes can drain bank accounts.",
    summaryHi: "AI द्वारा रिश्तेदारों की आवाज की नकल और दुकानों पर लगे फर्जी QR कोड के नए घोटालों से कैसे बचें।",
    stage1SimpleExplanation: {
      en: "Scammers now use just 3 seconds of someone's social media video to clone their voice with AI. They call parents claiming their child was in an accident, demanding immediate ransom.",
      hi: "आजकल हैकर्स सिर्फ 3 सेकंड की आवाज से AI द्वारा किसी की भी हूबहू आवाज बना लेते हैं। फिर वे परिजनों को फोन करके इमरजेंसी का झांसा देकर पैसे मांगते हैं।"
    },
    stage2RealExample: {
      en: "A shopkeeper at a local market found a rogue scammer had pasted a fake sticker QR code over his genuine UPI payment standee. Customers scanning it sent money directly to the fraudster's account.",
      hi: "एक दुकानदार के असली UPI QR कोड के ऊपर किसी ठग ने अपना फर्जी QR कोड स्टीकर चिपका दिया। ग्राहक पैसे भेजते रहे और वह सीधे ठग के खाते में जाते रहे।"
    },
    stage3WarningSigns: [
      { sign: "A frantic call from a family member's cloned voice asking for urgent cash transfers", risk: "Critical" },
      { sign: "QR codes received via WhatsApp claiming 'Scan this QR to RECEIVE money in your bank'", risk: "Critical" },
      { sign: "Video calls where facial movements look robotic, blurry around lips, or audio has slight latency", risk: "High" },
      { sign: "Search engine top ads leading to lookalike helpline numbers", risk: "High" }
    ],
    stage4ProtectionSteps: [
      "Golden Rule of UPI: You NEVER need to scan a QR code or enter your UPI PIN to RECEIVE money. PIN is only for PAYING.",
      "Establish a secret family 'Safe Word' / passphrase to verify identities during emergency distress calls.",
      "Always inspect physical QR code stickers at stores to ensure no rogue sticker was pasted over the original.",
      "Verify unexpected distress claims by calling back on the person's known personal phone number."
    ],
    stage5InteractiveChallenge: {
      question: "A buyer on OLX sends you a QR code on WhatsApp and says: 'Scan this QR code and enter your UPI PIN to receive payment of ₹5,000 for your sofa.' What is the truth?",
      questionHi: "OLX पर एक खरीदार ने WhatsApp पर QR कोड भेजकर कहा: 'पैसे पाने के लिए QR स्कैन करें और UPI PIN डालें।' सच क्या है?",
      options: [
        "Scanning the QR and entering PIN will credit ₹5,000 to your bank",
        "It is a 100% scam! Entering your UPI PIN always DEBITS money from your account, never credits it",
        "You should enter the PIN twice to confirm",
        "It is standard RBI banking procedure"
      ],
      correctIndex: 1,
      explanation: "Entering your UPI PIN ALWAYS debits (deducts) money from your account. You NEVER enter a PIN to receive money.",
      explanationHi: "UPI PIN डालने से हमेशा आपके खाते से पैसे कटते हैं, कभी आते नहीं। पैसे पाने के लिए कभी PIN नहीं डालना पड़ता।"
    },
    relatedSimId: "sim-phishing-lab"
  }
];
