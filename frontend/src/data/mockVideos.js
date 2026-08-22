export const mockVideos = [
  {
    id: "vid-phishing-anatomy",
    title: "Anatomy of a Modern Phishing Attack: From Fake Email to Bank Drain",
    titleHi: "फिशिंग अटैक का पूरा चक्र: फर्जी ईमेल से बैंक खाली होने तक",
    category: "Phishing",
    duration: "7:45",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    embedUrl: "https://www.youtube-nocookie.com/embed/o0btvyyd-Io",
    description: "A step-by-step visual breakdown of how phishing links mimic legitimate banking portals, bypass spam filters, and trick users through psychological urgency.",
    descriptionHi: "यह वीडियो दिखाता है कि कैसे हैकर्स असली जैसी दिखने वाली फर्जी वेबसाइटें बनाते हैं और घबराहट पैदा करके पासवर्ड चुराते हैं।",
    keyTakeaways: [
      "Hover over links to preview true target URLs before clicking.",
      "Check the domain name spelling meticulously (e.g., `netfIix.com` with an uppercase 'i' instead of 'l').",
      "No genuine bank sends unsolicited links demanding KYC updates within 2 hours.",
      "Always verify unexpected emails via official phone lines."
    ],
    timestamps: [
      { time: "0:00", label: "Introduction: Why Phishing Still Works" },
      { time: "1:30", label: "Deconstructing the Fake Urgent Email" },
      { time: "3:15", label: "Inspecting the Fake Login Page" },
      { time: "5:00", label: "How Attackers Intercept Real-time OTPs" },
      { time: "6:40", label: "The 3 Golden Defense Rules" }
    ],
    relatedArticleId: "art-phishing-101",
    relatedSimId: "sim-phishing-lab"
  },
  {
    id: "vid-password-passphrases",
    title: "Mastering Passphrases & 2-Factor Authentication",
    titleHi: "मजबूत पासफ़्रेज़ और 2FA का सही इस्तेमाल",
    category: "Password Safety",
    duration: "6:20",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80",
    embedUrl: "https://www.youtube-nocookie.com/embed/zMAnETbXfE0",
    description: "Why long passphrases beat complex short passwords every time, and how Authenticator apps protect your online life even if your password is stolen.",
    descriptionHi: "सरल लेकिन 4 शब्दों का लंबा पासफ़्रेज़ कैसे किसी भी हैकर को रोक सकता है और ऑथेंटिकेटर ऐप का क्या फायदा है।",
    keyTakeaways: [
      "Length > Complexity: 16+ character passphrases resist supercomputer cracking.",
      "Never reuse the same password on more than one account.",
      "Hardware keys and Authenticator apps are immune to SMS SIM-swap fraud."
    ],
    timestamps: [
      { time: "0:00", label: "The Problem with 'P@ssw0rd!'" },
      { time: "1:45", label: "How GPU Hashcat Password Crackers Work" },
      { time: "3:30", label: "The 4-Word Passphrase Strategy" },
      { time: "4:50", label: "Setting Up an Authenticator App" }
    ],
    relatedArticleId: "art-password-safety",
    relatedSimId: "sim-password-lab"
  },
  {
    id: "vid-social-engineering-tactics",
    title: "The Psychology of Scams: Digital Arrest, Fake Tech Support & Panic",
    titleHi: "स्कैम्स का मनोविज्ञान: डिजिटल अरेस्ट, फर्जी पुलिस और डर का खेल",
    category: "Social Engineering",
    duration: "9:10",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    embedUrl: "https://www.youtube-nocookie.com/embed/sdpxddDzXfE",
    description: "Deep dive into real-world social engineering tactics used by cyber syndicates—including 'Digital Arrest' video calls, fake investment schemes, and impersonation.",
    descriptionHi: "साइबर ठग कैसे फर्जी पुलिस की वर्दी पहनकर वीडियो कॉल करते हैं और लोगों को डराकर करोड़ों की ठगी करते हैं।",
    keyTakeaways: [
      "There is no legal provision for 'Digital Arrest' under Indian Law.",
      "Never download remote desktop software (AnyDesk, TeamViewer) at a caller's request.",
      "When pressurized, pause, breathe, hang up, and consult family members."
    ],
    timestamps: [
      { time: "0:00", label: "Understanding Psychological Traps" },
      { time: "2:10", label: "Case Study: The Fake Customs & Courier Scam" },
      { time: "4:40", label: "The Anatomy of a 'Digital Arrest' Video Call" },
      { time: "7:00", label: "Emergency Response & Reporting to 1930" }
    ],
    relatedArticleId: "art-social-engineering",
    relatedSimId: "sim-social-eng"
  },
  {
    id: "vid-wifi-network-security",
    title: "Public Wi-Fi Traps & How Man-In-The-Middle Attacks Work",
    titleHi: "पब्लिक वाई-फाई के खतरे और Man-in-the-Middle अटैक कैसे होता है",
    category: "Network Security",
    duration: "8:05",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    embedUrl: "https://www.youtube-nocookie.com/embed/pLp6zF-4K_0",
    description: "Visual demonstration of packet sniffing on open wireless networks, fake 'Evil Twin' hotspots, and how VPN encryption shields your network packets.",
    descriptionHi: "हवाई अड्डे और कैफे के खुले वाई-फाई पर हैकर्स कैसे आपका डेटा देखते हैं और VPN कैसे आपको सुरक्षित रखता है।",
    keyTakeaways: [
      "Avoid logging into sensitive accounts on unencrypted open public Wi-Fi.",
      "Use cellular mobile hotspot or a reputable VPN for financial transactions.",
      "Turn off automatic Wi-Fi network joining in your phone settings."
    ],
    timestamps: [
      { time: "0:00", label: "The Hidden Danger of Free Wi-Fi" },
      { time: "2:00", label: "Demonstration of Evil Twin Hotspots" },
      { time: "4:30", label: "What HTTPS Protects vs What Stays Exposed" },
      { time: "6:15", label: "How VPN Tunnels Secure Your Device" }
    ],
    relatedArticleId: "art-safe-browsing",
    relatedSimId: "sim-network-visualizer"
  },
  {
    id: "vid-ai-deepfakes-audio",
    title: "AI Voice Cloning & Generative Deceptions in 2026",
    titleHi: "AI वॉयस क्लोनिंग और डीपफेक फ्रॉड से बचाव",
    category: "Emerging Threats",
    duration: "6:50",
    level: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    embedUrl: "https://www.youtube-nocookie.com/embed/g2gO2A2j2vI",
    description: "How generative AI allows scammers to clone human voices from social media clips and how to implement a family emergency verification safe-word.",
    descriptionHi: "जानिए कैसे AI द्वारा आवाज की नकल की जाती है और परिवार के लिए 'सुरक्षा पासवर्ड' क्यों जरूरी है।",
    keyTakeaways: [
      "Never react to frantic money requests without verifying on a secondary known channel.",
      "Establish a family safe-word for emergency distress situations.",
      "Be mindful of sharing high-definition voice and video samples publicly."
    ],
    timestamps: [
      { time: "0:00", label: "The Rise of AI-Powered Impersonation" },
      { time: "1:40", label: "Audio Spectral Analysis of Cloned Voices" },
      { time: "3:50", label: "Setting Up Family Verification Protocols" },
      { time: "5:30", label: "Action Steps if Targeted" }
    ],
    relatedArticleId: "art-emerging-threats",
    relatedSimId: "sim-social-eng"
  }
];
