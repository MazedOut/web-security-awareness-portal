import { apiClient } from './api';

export const aiService = {
  askAssistant: async (prompt, lang = 'en') => {
    // 1. Query secure backend proxy (GEMINI_API_KEY resides server-side only, FR-05.5)
    try {
      const res = await apiClient.post('/api/ai-explain', {
        question: prompt,
        user_answer: 'User security inquiry',
        is_correct: true,
        difficulty: 'general',
        static_fallback: ''
      });
      if (res.data?.explanation || res.data?.feedback) {
        return res.data.explanation || res.data.feedback;
      }
    } catch (e) {
      // Backend unreachable or returned error, fall back to local intelligence engine
    }

    // 2. High-Intelligence Local Security Knowledge Engine (Instant offline fallback, FR-05.4)
    return generateLocalSecurityAdvice(prompt, lang);
  },

  explainQuestion: async ({ question, answer, isCorrect, difficulty, staticFallback }) => {
    // Query backend AI explanation with static fallback (FR-05.1-5.7)
    try {
      const res = await apiClient.post('/api/ai-explain', {
        question,
        user_answer: answer,
        is_correct: isCorrect,
        difficulty: difficulty || 'beginner',
        static_fallback: staticFallback || ''
      });
      return {
        text: res.data?.explanation || res.data?.feedback || staticFallback,
        isAI: !!res.data?.is_ai,
        source: res.data?.source || (res.data?.is_ai ? 'ai' : 'static_fallback')
      };
    } catch {
      return {
        text: staticFallback || "Review the explanation above to understand this security concept.",
        isAI: false,
        source: 'static_fallback'
      };
    }
  }
};

function generateLocalSecurityAdvice(query, lang) {
  const q = query.toLowerCase();

  if (lang === 'hi') {
    if (q.includes('otp') || q.includes('ओटीपी') || q.includes('bank') || q.includes('बैंक')) {
      return `🛑 **स्वर्णिम सुरक्षा नियम (Golden Rule):**
कोई भी असली बैंक कर्मचारी, पुलिस या कंपनी का प्रतिनिधि आपसे कभी भी फोन या मैसेज पर **OTP (One Time Password)**, **ATM PIN**, या **CVV** नहीं मांगता है।

💡 **आपको क्या करना चाहिए:**
1. किसी को भी अपना OTP न बताएं, भले ही वह खुद को बैंक मैनेजर बताए।
2. अगर कोई डराए कि 'खाता बंद हो जाएगा', तो तुरंत फोन काट दें।
3. तुरंत अपने बैंक के आधिकारिक नंबर पर संपर्क करें या **1930** पर कॉल करें।`;
    }

    if (q.includes('phishing') || q.includes('फिशिंग') || q.includes('dhokha') || q.includes('धोखा')) {
      return `🎣 **फिशिंग (Phishing) क्या है?**
फिशिंग एक ऑनलाइन धोखाधड़ी है जिसमें जालसाज बैंक, बिजली विभाग, कूरियर (India Post) या लॉटरी के नाम पर फर्जी मैसेज या ईमेल भेजते हैं।

⚠️ **चेतावनी के संकेत (Red Flags):**
• 'आज रात 9:30 बजे बिजली कट जाएगी' जैसे डराने वाले मैसेज।
• फर्जी लिंक जैसे \`bit.ly\` या \`sbi-kyc-update.xyz\`।
• फ्री गिफ्ट या लॉटरी का लालच।

🛡️ **सुरक्षा मंत्र:**
किसी भी अनजान लिंक पर क्लिक न करें। हमेशा आधिकारिक ऐप या वेबसाइट खोलकर ही चेक करें।`;
    }

    if (q.includes('password') || q.includes('पासवर्ड') || q.includes('2fa') || q.includes('सुरक्षा')) {
      return `🔐 **मजबूत पासवर्ड और 2FA कैसे बनाएं:**
1. **लंबाई सबसे जरूरी है:** 'Password123' की जगह 4 आसान शब्दों का पासफ़्रेज़ बनाएं, जैसे: \`Chai-Pahar-Barish-2026!\`
2. **2-Step Verification (2FA) चालू करें:** Google Authenticator या Microsoft Authenticator ऐप का उपयोग करें।
3. हर वेबसाइट के लिए अलग पासवर्ड रखें ताकि एक जगह लीक होने पर दूसरा खाता सुरक्षित रहे।`;
    }

    if (q.includes('digital arrest') || q.includes('डिजिटल अरेस्ट') || q.includes('police') || q.includes('cbi') || q.includes('पुलिस')) {
      return `🚨 **सावधान! 'डिजिटल अरेस्ट' नाम का कोई कानून नहीं है!**
भारतीय कानून में Skype, WhatsApp या वीडियो कॉल पर किसी को गिरफ्तार करने (Digital Arrest) का कोई प्रावधान नहीं है।

• असली पुलिस या CBI कभी भी वीडियो कॉल पर पैसे ट्रांसफर करने की मांग नहीं करती।
• घबराएं नहीं! तुरंत कॉल काटें, परिवार को बताएं और **1930** पर रिपोर्ट करें।`;
    }

    return `🛡️ **चक्रव्यूह AI सुरक्षा सलाह:**
आपके सवाल *" ${query} "* के संदर्भ में:

• इंटरनेट पर किसी भी अनजान व्यक्ति के कहने पर **AnyDesk**, **TeamViewer** या **QuickSupport** जैसे स्क्रीन-शेयरिंग ऐप्स कभी इंस्टॉल न करें।
• संदिग्ध मैसेज, फर्जी कॉल्स या ऑनलाइन फ्रॉड की शिकायत तुरंत राष्ट्रीय साइबर हेल्पलाइन **1930** या **cybercrime.gov.in** पर दर्ज करें।
• अगर आपके पास कोई विशेष SMS या लिंक है, तो मुझे बताएं, मैं उसकी जांच करके बताऊँगा।`;
  }

  // English fallback responses
  if (q.includes('otp') || q.includes('bank') || q.includes('pin') || q.includes('cvv')) {
    return `🛑 **Golden Defense Rule:**
No legitimate bank, police officer, or telecom executive will EVER ask for your **One-Time Password (OTP)**, **ATM PIN**, or **Card CVV** over phone, SMS, or WhatsApp.

💡 **Immediate Action Steps:**
1. **Never disclose your OTP**, even if the caller displays your correct name and claims your account is locked.
2. If pressured with threats, **hang up immediately**.
3. Call your bank directly using the phone number printed on the back of your debit card, or dial **1930** (Cyber Crime Helpline).`;
  }

  if (q.includes('phishing') || q.includes('fake link') || q.includes('suspicious') || q.includes('sms')) {
    return `🎣 **Understanding Phishing & Smishing:**
Phishing is the #1 vector used by cybercriminals. Attackers create convincing replicas of legitimate services (Netflix, Amazon, SBI, HDFC, Electricity boards) accompanied by manufactured urgency.

⚠️ **Key Red Flags:**
• Artificial deadlines: *"Account suspended in 2 hours!"*
• Sender address mismatch (e.g. \`alert@hdfc-security-updates.net\` instead of \`@hdfcbank.com\`).
• Shortened links (\`bit.ly\`, \`tinyurl\`, \`.xyz\`, \`.top\`).

🛡️ **Best Practice:**
Never click embedded links in unprompted emails or SMS. Open a fresh browser tab and navigate to the official domain directly.`;
  }

  if (q.includes('password') || q.includes('2fa') || q.includes('passphrase') || q.includes('mfa')) {
    return `🔐 **Password Strength & 2FA Strategy:**
• **Passphrases beat short passwords:** A 4-word memorable passphrase like \`Mango-River-Bicycle-2026!\` takes billions of years to crack on modern GPU clusters.
• **Enable App-based 2FA:** Switch from SMS OTP to authenticator apps (Google Authenticator, Bitwarden, Apple Keychain) to stay immune to SIM-swap attacks.
• **Never reuse passwords:** Use a reputable password manager so a breach on one site doesn't compromise your entire digital footprint.`;
  }

  if (q.includes('digital arrest') || q.includes('police') || q.includes('customs') || q.includes('cbi') || q.includes('fedex')) {
    return `🚨 **Critical Alert: 'Digital Arrest' is a 100% Scam!**
There is **NO provision for 'Digital Arrest'** under Indian criminal law or procedural code.

• Law enforcement agencies (Police, CBI, ED, Customs) NEVER conduct arrests, trials, or ask for clearance deposits via WhatsApp/Skype video calls.
• Scammers use fake police station backdrops and forged seals.
• **Action:** Disconnect immediately, do not send any money, and report the caller number to **1930** or **cybercrime.gov.in**.`;
  }

  return `🛡️ **Chakravyuh Security Guidance:**
Regarding your inquiry on *" ${query} "*:

1. **Verify Out-of-Band:** Always cross-verify unexpected demands for money or credentials using an official, independently found contact number.
2. **Never Install Remote Apps:** Do not download AnyDesk, TeamViewer, or RustDesk at the instruction of an unknown caller.
3. **Emergency Support:** If you suspect financial fraud has occurred within the last 2 hours, call **1930** immediately to activate golden-hour fund freezing.

Feel free to paste any suspicious message, email, or URL here for instant breakdown!`;
}
