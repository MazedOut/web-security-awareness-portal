export const mockThreats = [
  {
    id: "threat-malware",
    name: "Malware & Spyware",
    nameHi: "मैलवेयर और स्पाईवेयर (जासूसी वायरस)",
    severity: "Critical",
    badgeColor: "red",
    icon: "Bug",
    whatIsIt: "Malware (short for malicious software) is any intrusive software developed by cybercriminals to steal data, damage devices, or spy on your keystrokes and webcam without your consent.",
    whatIsItHi: "मैलवेयर हानिकारक सॉफ्टवेयर या वायरस होता है जिसे हैकर्स आपके कंप्यूटर या फोन से गुप्त जानकारी चुराने, स्क्रीन रिकॉर्ड करने या डिवाइस को खराब करने के लिए बनाते हैं।",
    howItWorks: [
      "Victim downloads a pirated movie, cracked software, or shady email attachment.",
      "The hidden payload executes silently in the background.",
      "A Keylogger or Spyware module logs typed banking credentials and OTPs.",
      "Stolen data is transmitted to an offshore Command & Control (C2) hacker server."
    ],
    howItWorksHi: [
      "उपयोगकर्ता किसी पायरेटेड ऐप, फर्जी गेम या संदिग्ध ईमेल अटैचमेंट को डाउनलोड करता है।",
      "वायरस चुपचाप बैकग्राउंड में इंस्टॉल होकर चलने लगता है।",
      "की-लॉगर या जासूसी प्रोग्राम आपके द्वारा टाइप किए गए पासवर्ड और बैंक डिटेल्स रिकॉर्ड करता है।",
      "चुराई गई जानकारी हैकर के सर्वर पर भेज दी जाती है।"
    ],
    realWorldExample: "In 2024, the 'FluHorse' Android malware infected thousands of users across Asia. Disguised as legitimate courier tracking apps, it intercepted incoming SMS OTPs and cleared bank accounts before victims noticed.",
    realWorldExampleHi: "2024 में 'FluHorse' नामक एंड्रॉयड मैलवेयर ने कूरियर ट्रैकिंग ऐप का रूप धरकर हजारों लोगों के फोन से बैंक के OTP चुराए और खाते खाली कर दिए।",
    warningSigns: [
      "Phone or laptop suddenly running extremely slow, overheating, or battery draining rapidly",
      "Unexpected popups appearing even when your web browser is closed",
      "New apps, extensions, or toolbars you never installed appearing automatically",
      "Antivirus or Windows Security turning off on its own"
    ],
    protectionMethods: [
      "Only install apps from official stores (Google Play, Apple App Store, Microsoft Store).",
      "Keep your Operating System and antivirus real-time scanning updated.",
      "Never download pirated games, cracked software, or torrent key generators.",
      "Regularly audit app permissions to revoke unnecessary microphone and SMS access."
    ],
    simLink: "/simulations?tab=url-inspector"
  },
  {
    id: "threat-phishing",
    name: "Phishing & Spoofing",
    nameHi: "फिशिंग और फर्जी संदेश (Phishing & Spoofing)",
    severity: "High",
    badgeColor: "red",
    icon: "Flame",
    whatIsIt: "Phishing is the fraudulent practice of sending deceptive messages disguised as a reputable organization (bank, courier, government) to trick individuals into revealing sensitive credentials.",
    whatIsItHi: "फिशिंग एक ऐसा ऑनलाइन धोखा है जिसमें ठग बैंक, पुलिस या बड़ी कंपनी का फर्जी रूप धरकर आपसे पासवर्ड, बैंक डिटेल या OTP मांगते हैं।",
    howItWorks: [
      "Attacker creates a pixel-perfect replica of a banking, Netflix, or webmail login portal.",
      "A mass email or SMS is dispatched with fabricated urgency (e.g. 'Account Suspended in 2 hours').",
      "Victim clicks the deceptive link and enters their username, password, and OTP.",
      "The fake server captures the credentials and immediately initiates fraudulent fund transfers."
    ],
    howItWorksHi: [
      "हैकर असली बैंक या ईमेल जैसी दिखने वाली हूबहू फर्जी वेबसाइट बनाता है।",
      "डर या लालच भरा संदेश भेजा जाता है (जैसे: 'खाता 2 घंटे में बंद हो जाएगा')।",
      "पीड़ित व्यक्ति लिंक पर क्लिक करके अपना पासवर्ड और OTP दर्ज कर देता है।",
      "हैकर तुरंत इन डिटेल्स का उपयोग करके असली खाते से पैसे निकाल लेता है।"
    ],
    realWorldExample: "Over 89% of modern corporate security breaches originate from a spear-phishing email targeting an employee with a fake PDF invoice containing a credential harvesting portal.",
    realWorldExampleHi: "दुनिया भर में 89% साइबर हमले फर्जी इनवॉइस या पार्सल के नाम पर भेजे गए ईमेल लिंक से शुरू होते हैं।",
    warningSigns: [
      "Urgent threats of account suspension, legal penalty, or lost lottery prizes",
      "Mismatched sender domain (e.g., email from `support@sbi-updates.net` instead of `sbi.co.in`)",
      "Generic greetings like 'Dear Valued Customer' instead of your registered name",
      "Requests for your password, CVV, or one-time verification passcode (OTP)"
    ],
    protectionMethods: [
      "Inspect the full URL in your browser address bar before entering credentials.",
      "Never click links in unrequested SMS or emails—navigate to official portals directly.",
      "Enable hardware security keys (FIDO2/WebAuthn) or Authenticator apps.",
      "Report phishing messages to cybercrime portals immediately."
    ],
    simLink: "/simulations?tab=phishing"
  },
  {
    id: "threat-ransomware",
    name: "Ransomware Extortion",
    nameHi: "रैनसमवेयर (कंप्यूटर बंधक वायरस)",
    severity: "Critical",
    badgeColor: "red",
    icon: "Lock",
    whatIsIt: "Ransomware is a dangerous form of malware that encrypts all files, photos, and databases on a victim's device, locking access until a cryptocurrency ransom is paid.",
    whatIsItHi: "रैनसमवेयर एक ऐसा वायरस है जो आपके कंप्यूटर के सभी फोटो, डॉक्यूमेंट और फाइलों पर डिजिटल ताला लगा देता है और उन्हें खोलने के लिए फिरौती (रुपये/बिटकॉइन) मांगता है।",
    howItWorks: [
      "Ransomware enters via an unpatched software vulnerability or malicious email attachment.",
      "It scans connected hard drives and encrypts files with military-grade AES-256 / RSA encryption.",
      "Desktop wallpaper is replaced with a ransom note demanding Bitcoin within 72 hours.",
      "Threat actors often threaten to publish confidential personal photos online if unpaid."
    ],
    howItWorksHi: [
      "रैनसमवेयर किसी असुरक्षित डाउनलोड या ईमेल अटैचमेंट से सिस्टम में घुसता है।",
      "यह कंप्यूटर की सभी फाइलों को मजबूत कोड में लॉक कर देता है।",
      "स्क्रीन पर एक धमकी भरा संदेश आ जाता है कि 72 घंटे में पैसे दो वरना फाइलें कभी नहीं खुलेंगी।",
      "हैकर डेटा इंटरनेट पर लीक करने की धमकी भी देते हैं।"
    ],
    realWorldExample: "The 2022 AIIMS New Delhi ransomware incident locked hospital patient records for nearly two weeks, highlighting the catastrophic impact on healthcare infrastructure.",
    realWorldExampleHi: "2022 में दिल्ली के AIIMS अस्पताल पर हुए रैनसमवेयर हमले ने दो हफ्तों तक मरीजों के रिकॉर्ड लॉक कर दिए थे, जिससे स्वास्थ्य सेवाओं पर भारी असर पड़ा था।",
    warningSigns: [
      "File icons changing to unknown formats (e.g. `.locked`, `.crypt`, `.enc`)",
      "Inability to open standard documents, spreadsheets, or family photos",
      "A pop-up window or text file appearing on the desktop with ransom payment instructions",
      "Unusual surge in hard drive activity and fan noise"
    ],
    protectionMethods: [
      "Maintain offline, disconnected 3-2-1 backups of all critical documents on an external drive.",
      "Never pay the ransom—law enforcement and CISA confirm payment does not guarantee file recovery.",
      "Keep operating system security patches and firmware updated.",
      "Use reputable endpoint protection with anti-ransomware rollback capabilities."
    ],
    simLink: "/simulations?tab=quiz"
  },
  {
    id: "threat-password-attacks",
    name: "Password Attacks & Credential Stuffing",
    nameHi: "पासवर्ड क्रैकिंग और क्रेडेंशियल स्टफिंग",
    severity: "High",
    badgeColor: "gold",
    icon: "KeyRound",
    whatIsIt: "Password attacks involve automated bots attempting millions of common passwords, dictionary words, or previously leaked database combinations to break into user accounts.",
    whatIsItHi: "पासवर्ड अटैक में हैकर्स ऑटोमेटेड कंप्यूटर प्रोग्राम का इस्तेमाल करके करोड़ों आम पासवर्ड और लीक हुए डेटा का उपयोग कर आपके खाते का ताला तोड़ने की कोशिश करते हैं।",
    howItWorks: [
      "Attackers obtain a dump of 500 million leaked email/password pairs from the dark web.",
      "Automated scripts attempt these identical pairs across Amazon, Gmail, PayPal, and banking portals.",
      "Because 65% of people reuse passwords, attackers successfully breach multiple secondary accounts."
    ],
    howItWorksHi: [
      "हैकर डार्क वेब से पहले से लीक हुए करोड़ों ईमेल और पासवर्ड की लिस्ट लेते हैं।",
      "ऑटोमैटिक रोबोट्स वही पासवर्ड बैंक, अमेज़ॅन और अन्य सोशल मीडिया पर ट्राई करते हैं।",
      "क्योंकि ज्यादातर लोग हर जगह एक ही पासवर्ड रखते हैं, हैकर आसानी से कई खाते खोल लेते हैं।"
    ],
    realWorldExample: "In credential stuffing campaigns, automated botnets make over 10 billion malicious login attempts daily across global financial and e-commerce websites.",
    realWorldExampleHi: "हर दिन अरबों बार ऑटोमैटिक कंप्यूटर हैकर्स लीक हुए पासवर्ड्स को विभिन्न साइटों पर डालकर लोगों के खाते हैक करने की कोशिश करते हैं।",
    warningSigns: [
      "Receiving unexpected 'Password Reset' emails or 2FA login prompt notifications",
      "Notifications of logins originating from unknown devices, cities, or countries",
      "Finding your email in public breach search engines like Have I Been Pwned",
      "Unexplained account lockouts due to excessive failed attempts"
    ],
    protectionMethods: [
      "Use unique, non-overlapping passwords for every online account.",
      "Adopt a secure Password Manager to generate high-entropy passwords.",
      "Enable App-based 2FA or FIDO2 Passkeys on all essential services.",
      "Immediately rotate passwords if notified of a vendor breach."
    ],
    simLink: "/simulations?tab=password"
  },
  {
    id: "threat-fake-websites",
    name: "Fake Websites & Typosquatting",
    nameHi: "फर्जी वेबसाइटें और मिलते-जुलते डोमेन (Typosquatting)",
    severity: "High",
    badgeColor: "gold",
    icon: "Globe",
    whatIsIt: "Typosquatting is the registration of misleading domain names that mimic well-known brands (e.g., `amzon.com`, `paypa1.com`, `sbi-netbanking-login.in`) to intercept mistaken visitors.",
    whatIsItHi: "ठग असली वेबसाइटों के नाम में हल्का सा बदलाव करके (जैसे `paypa1.com` या `g00gle.com`) फर्जी पेज बना लेते हैं ताकि गलती से आने वाले लोग अपना पासवर्ड वहां डाल दें।",
    howItWorks: [
      "Fraudster registers lookalike domains with misspelled letters or strange extensions (`.xyz`, `.top`).",
      "They clone the exact visual look and logo of the legitimate brand.",
      "They run paid search engine ads so their fraudulent domain appears above the real website.",
      "Users clicking the top sponsored ad submit confidential credentials to the fraudster."
    ],
    howItWorksHi: [
      "ठग मिलते-जुलते नाम वाला डोमेन खरीदते हैं और असली जैसी दिखने वाली वेबसाइट बनाते हैं।",
      "वे गूगल पर विज्ञापन चलाते हैं ताकि उनकी फर्जी वेबसाइट सबसे ऊपर दिखाई दे।",
      "लोग बिना स्पेलिंग देखे उस पर क्लिक कर अपना पासवर्ड या कार्ड नंबर डाल देते हैं।"
    ],
    realWorldExample: "In 2023, cyber criminals purchased Google Ads for popular open-source software (OBS Studio, VLC, Blender). Victims downloading from the sponsored lookalike link received the RedLine Stealer trojan.",
    realWorldExampleHi: "2023 में हैकर्स ने सर्च इंजन पर फर्जी विज्ञापन चलाकर असली सॉफ्टवेयर की जगह वायरस वाली कॉपी डाउनलोड करवाई।",
    warningSigns: [
      "The top search engine result has a small 'Sponsored' or 'Ad' tag pointing to an unfamiliar URL",
      "Subtle typos in the URL (e.g. using numeral '1' for letter 'l', or '0' for 'o')",
      "The site certificate is issued to an unknown individual rather than the verified corporation",
      "Payment page offers only direct UPI QR transfers without card gateway options"
    ],
    protectionMethods: [
      "Always bookmark your primary banking, government, and shopping portals.",
      "Carefully read domain names in the browser address bar from right to left before submitting forms.",
      "Avoid clicking top 'Sponsored Ad' search results for customer support numbers.",
      "Use an ad-blocker to suppress deceptive search engine advertisement injections."
    ],
    simLink: "/simulations?tab=url-inspector"
  },
  {
    id: "threat-social-engineering",
    name: "Social Engineering & Vishing",
    nameHi: "सोशल इंजीनियरिंग और फर्जी कॉल्स (Vishing & Impersonation)",
    severity: "Critical",
    badgeColor: "purple",
    icon: "Users",
    whatIsIt: "Social Engineering relies on psychological manipulation rather than technical hacking—manipulating people into performing actions or divulging confidential information.",
    whatIsItHi: "सोशल इंजीनियरिंग में हैकर्स किसी सॉफ्टवेयर को नहीं, बल्कि इंसान के मनोविज्ञान, डर या भरोसे का फायदा उठाकर फ्रॉड करते हैं।",
    howItWorks: [
      "Attacker investigates the victim's social media for personal info (family names, recent travel).",
      "They call pretending to be an authority figure (Cyber Police, Customs, CEO, Bank Manager).",
      "They induce extreme anxiety or urgency to bypass the victim's logical reasoning.",
      "The victim is coached to transfer funds, install screen-sharing software, or read out 2FA OTPs."
    ],
    howItWorksHi: [
      "ठग सोशल मीडिया से आपके बारे में जानकारी इकट्ठा करता है।",
      "फिर वह बड़ा अफसर (पुलिस, कस्टम, बैंक मैनेजर) बनकर फोन करता है।",
      "वह इतना डराता है कि आप बिना सोचे-समझे उसकी बात मान लें।",
      "वह आपसे पैसे ट्रांसफर करवाता है या स्क्रीन शेयर ऐप डाउनलोड करवा लेता है।"
    ],
    realWorldExample: "'Digital Arrest' syndicates defrauded citizens of over ₹1,200 Crores in 2024 alone by intimidating victims on fake video calls complete with mock police station backdrops.",
    realWorldExampleHi: "2024 में फर्जी पुलिस स्टेशन का सेटअप बनाकर वीडियो कॉल पर डराने वाले 'डिजिटल अरेस्ट' गिरोहों ने लोगों से 1200 करोड़ से ज्यादा की ठगी की।",
    warningSigns: [
      "Caller demands you maintain absolute secrecy and forbid you from calling your family",
      "Threats of immediate arrest or courier seizure over a phone or Skype/WhatsApp video call",
      "Requests to download screen sharing software like AnyDesk or QuickSupport",
      "Offers of miraculous high-yield crypto or stock trading tips in private Telegram groups"
    ],
    protectionMethods: [
      "Remember: Real government, tax, or police authorities NEVER demand funds via video calls.",
      "Practice the 'Pause & Verify' rule: Disconnect the call and dial the verified official phone number.",
      "Discuss unexpected urgent financial requests with a trusted family member or mentor.",
      "Report extortion calls to the National Cyber Crime Reporting Portal (1930)."
    ],
    simLink: "/simulations?tab=social-eng"
  },
  {
    id: "threat-data-breaches",
    name: "Data Breaches & Identity Theft",
    nameHi: "डेटा ब्रीच और पहचान की चोरी (Data Breaches & Identity Theft)",
    severity: "High",
    badgeColor: "blue",
    icon: "ShieldAlert",
    whatIsIt: "A data breach occurs when cybercriminals unlawfully penetrate a corporate or government database, stealing millions of user records, emails, phone numbers, and financial details.",
    whatIsItHi: "जब हैकर्स किसी कंपनी या पोर्टल के सर्वर में सेंध लगाकर करोड़ों ग्राहकों के ईमेल, मोबाइल नंबर, पासवर्ड और पते चुरा लेते हैं, तो उसे डेटा ब्रीच कहते हैं।",
    howItWorks: [
      "Attackers exploit an unpatched database or phishing compromise to breach an enterprise network.",
      "Sensitive customer database tables are exfiltrated to offshore servers.",
      "The stolen database is published or auctioned on dark web forums.",
      "Secondary scammers use this personal info to run highly convincing tailored phishing attacks."
    ],
    howItWorksHi: [
      "हैकर किसी कंपनी के सर्वर की सुरक्षा कमजोरी का फायदा उठाकर डेटा चुराते हैं।",
      "लाखों ग्राहकों का डेटा डार्क वेब पर बेच दिया जाता है।",
      "अन्य ठग उस डेटा का इस्तेमाल कर आपको फोन करके आपके बारे में सब बताकर आपका भरोसा जीतते हैं।"
    ],
    realWorldExample: "Major telecom and healthcare data breaches in recent years exposed over 800 million Indian citizen phone numbers and Aadhaar linked records onto underground forums.",
    realWorldExampleHi: "हाल के वर्षों में कई बड़े टेलीकॉम और हेल्थकेयर डेटा लीक में करोड़ों नागरिकों के नंबर और पते डार्क वेब पर लीक हुए।",
    warningSigns: [
      "Receiving scam calls where the caller suspiciously knows your full name, address, and date of birth",
      "Notifications from services like Have I Been Pwned or Google Password Checkup",
      "Sudden unauthorized charges on credit cards or loans taken in your name",
      "SIM card suddenly losing signal permanently (possible SIM Swap attempt)"
    ],
    protectionMethods: [
      "Check your personal email on Have I Been Pwned / Firefox Monitor regularly.",
      "Freeze or regularly monitor your CIBIL / credit bureau score for unknown loans.",
      "Lock your Aadhaar biometric data via the official mAadhaar application.",
      "Rotate passwords immediately if a service you use announces a security incident."
    ],
    simLink: "/simulations?tab=password"
  }
];
