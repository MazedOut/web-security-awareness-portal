import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Smartphone,
  CreditCard,
  Lock,
  Wifi,
  Mail,
  Eye,
  PhoneCall,
  CheckCircle2,
  BookOpen,
  Users
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { HeritageSeparator } from '../components/common/HeritageSeparator';
import { useLanguage } from '../context/LanguageContext';

const categories = [
  { id: 'all', label: 'All Tips', labelHi: 'सभी टिप्स' },
  { id: 'passwords', label: 'Passwords', labelHi: 'पासवर्ड' },
  { id: 'phishing', label: 'Phishing', labelHi: 'फिशिंग' },
  { id: 'payments', label: 'Payments', labelHi: 'भुगतान' },
  { id: 'social', label: 'Social Media', labelHi: 'सोशल मीडिया' },
  { id: 'device', label: 'Devices', labelHi: 'डिवाइस' },
];

const tips = [
  {
    id: 1,
    category: 'passwords',
    icon: Lock,
    title: 'Use Strong, Unique Passwords',
    titleHi: 'मजबूत और अलग-अलग पासवर्ड उपयोग करें',
    tip: 'Create passwords with at least 12 characters, mixing uppercase, lowercase, numbers, and symbols. Never reuse the same password across multiple accounts.',
    tipHi: 'कम से कम 12 अक्षरों का पासवर्ड बनाएं जिसमें बड़े-छोटे अक्षर, संख्या और प्रतीक हों। कभी भी एक ही पासवर्ड कई जगह न उपयोग करें।',
    priority: 'Essential',
    color: 'blue',
  },
  {
    id: 2,
    category: 'passwords',
    icon: ShieldCheck,
    title: 'Enable Two-Factor Authentication (2FA)',
    titleHi: 'दो-चरणीय प्रमाणीकरण (2FA) चालू करें',
    tip: 'Always enable 2FA on your email, banking, and social media accounts. Even if your password is stolen, your account remains secure.',
    tipHi: 'अपने ईमेल, बैंकिंग और सोशल मीडिया खातों पर हमेशा 2FA चालू रखें। पासवर्ड चोरी होने पर भी आपका खाता सुरक्षित रहेगा।',
    priority: 'Essential',
    color: 'green',
  },
  {
    id: 3,
    category: 'phishing',
    icon: Mail,
    title: 'Verify Before You Click',
    titleHi: 'क्लिक करने से पहले जांचें',
    tip: 'Never click links in unsolicited emails or SMS. Hover over links to check the actual URL. Legitimate banks never ask for OTP or passwords via SMS/email.',
    tipHi: 'अनचाहे ईमेल या SMS में लिंक पर कभी क्लिक न करें। असली बैंक कभी OTP या पासवर्ड SMS/ईमेल से नहीं मांगते।',
    priority: 'Essential',
    color: 'red',
  },
  {
    id: 4,
    category: 'payments',
    icon: CreditCard,
    title: 'Never Share OTP with Anyone',
    titleHi: 'OTP किसी को न बताएं',
    tip: 'Your bank, UPI, or any genuine service will never call you asking for OTP. If someone asks for your OTP, it is definitely a fraud call — hang up immediately.',
    tipHi: 'आपका बैंक, UPI या कोई भी असली सेवा कभी OTP मांगने के लिए कॉल नहीं करती। अगर कोई OTP मांगे, तुरंत फोन काट दें।',
    priority: 'Essential',
    color: 'red',
  },
  {
    id: 5,
    category: 'payments',
    icon: Eye,
    title: 'Check QR Codes Carefully',
    titleHi: 'QR कोड सावधानी से जांचें',
    tip: 'Scanning a QR code to receive money is a scam. QR codes are only for sending money, never for receiving it. If asked to scan to "receive" payment — it is fraud.',
    tipHi: 'पैसे पाने के लिए QR कोड स्कैन करना धोखाधड़ी है। QR कोड केवल पैसे भेजने के लिए होता है, पाने के लिए नहीं।',
    priority: 'High',
    color: 'gold',
  },
  {
    id: 6,
    category: 'phishing',
    icon: PhoneCall,
    title: 'Beware of "Digital Arrest" Scams',
    titleHi: '"डिजिटल अरेस्ट" स्कैम से सावधान',
    tip: 'No government agency (CBI, police, customs) will ever "arrest" you over a video call. Such calls claiming your number/Aadhaar is linked to crime are always fraud.',
    tipHi: 'कोई भी सरकारी एजेंसी (CBI, पुलिस, कस्टम) कभी वीडियो कॉल पर "गिरफ्तार" नहीं करती। ऐसी कोई भी कॉल हमेशा फर्जी होती है।',
    priority: 'High',
    color: 'red',
  },
  {
    id: 7,
    category: 'device',
    icon: Smartphone,
    title: 'Only Install Apps from Official Stores',
    titleHi: 'केवल आधिकारिक स्टोर से ऐप्स इंस्टॉल करें',
    tip: 'Never install APK files sent via WhatsApp or Telegram. Only download apps from Google Play Store or Apple App Store. Malicious APKs steal banking credentials.',
    tipHi: 'WhatsApp या Telegram पर भेजे APK फाइल कभी इंस्टॉल न करें। केवल Google Play Store या Apple App Store से ऐप्स डाउनलोड करें।',
    priority: 'Essential',
    color: 'blue',
  },
  {
    id: 8,
    category: 'device',
    icon: Wifi,
    title: 'Avoid Public Wi-Fi for Sensitive Tasks',
    titleHi: 'संवेदनशील कार्यों के लिए सार्वजनिक Wi-Fi से बचें',
    tip: 'Never access banking, email, or social media on public Wi-Fi. Use mobile data or a trusted VPN. Attackers on the same network can intercept your traffic.',
    tipHi: 'सार्वजनिक Wi-Fi पर बैंकिंग, ईमेल या सोशल मीडिया उपयोग न करें। मोबाइल डेटा या VPN का उपयोग करें।',
    priority: 'Medium',
    color: 'gold',
  },
  {
    id: 9,
    category: 'social',
    icon: Users,
    title: 'Review Your Privacy Settings',
    titleHi: 'अपनी गोपनीयता सेटिंग्स जांचें',
    tip: 'Restrict who can see your personal information on Facebook, Instagram, and WhatsApp. Your date of birth, phone number, and address should never be public.',
    tipHi: 'Facebook, Instagram और WhatsApp पर व्यक्तिगत जानकारी केवल दोस्तों के लिए रखें। जन्मतिथि, फोन नंबर और पता कभी सार्वजनिक न करें।',
    priority: 'Medium',
    color: 'blue',
  },
  {
    id: 10,
    category: 'social',
    icon: Eye,
    title: 'Think Before You Share',
    titleHi: 'शेयर करने से पहले सोचें',
    tip: 'Never share Aadhaar, PAN, bank account numbers, or credit card details on social media or unknown websites. Even partial information can be used for identity theft.',
    tipHi: 'सोशल मीडिया या अनजान वेबसाइट पर आधार, PAN, खाता नंबर या कार्ड विवरण कभी साझा न करें।',
    priority: 'High',
    color: 'gold',
  },
  {
    id: 11,
    category: 'passwords',
    icon: BookOpen,
    title: 'Use a Password Manager',
    titleHi: 'पासवर्ड मैनेजर उपयोग करें',
    tip: 'Tools like Bitwarden or Google Password Manager help you create and store unique passwords securely. You only need to remember one master password.',
    tipHi: 'Bitwarden या Google Password Manager जैसे टूल अद्वितीय पासवर्ड सुरक्षित रखते हैं। आपको केवल एक मास्टर पासवर्ड याद रखना होता है।',
    priority: 'Medium',
    color: 'green',
  },
  {
    id: 12,
    category: 'device',
    icon: ShieldCheck,
    title: 'Keep Software & Apps Updated',
    titleHi: 'सॉफ्टवेयर और ऐप्स अपडेट रखें',
    tip: 'Enable automatic updates for your phone OS and apps. Updates often include security patches that fix vulnerabilities that attackers actively exploit.',
    tipHi: 'अपने फोन और ऐप्स के ऑटोमैटिक अपडेट चालू रखें। अपडेट में सुरक्षा सुधार होते हैं।',
    priority: 'High',
    color: 'blue',
  },
];

const priorityColors = {
  Essential: 'red',
  High: 'gold',
  Medium: 'blue',
};

export const SafetyTipsPage = () => {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all' ? tips : tips.filter(t => t.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      <HeritageSeparator className="my-2" />

      {/* Header */}
      <GlassCard variant="default" className="p-6 sm:p-8 space-y-3 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Badge variant="green">Actionable Guidance</Badge>
          <Badge variant="blue">Digital Safety Fundamentals</Badge>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-graphite mt-2">
          {lang === 'hi' ? 'डिजिटल सुरक्षा के जरूरी टिप्स' : 'Essential Digital Safety Tips'}
        </h1>
        <p className="text-sm text-slate-600 font-medium max-w-3xl leading-relaxed">
          {lang === 'hi'
            ? 'इन सरल लेकिन प्रभावी उपायों को अपनाकर आप अपने आप को और अपने परिवार को साइबर अपराधियों से सुरक्षित रख सकते हैं।'
            : 'Simple, proven actions you can take today to protect yourself and your family from the most common cyber threats.'}
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm ${
                activeCategory === cat.id
                  ? 'bg-cyber-gold text-white border-cyber-gold-dark'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-cyber-gold/30 hover:text-cyber-gold-dark'
              }`}
            >
              {lang === 'hi' ? cat.labelHi : cat.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((tip, idx) => {
          const TipIcon = tip.icon;
          return (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <GlassCard variant="default" className="p-5 space-y-3 bg-white border border-slate-200 shadow-sm h-full flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    tip.color === 'red' ? 'bg-cyber-red/10 text-cyber-red-dark border-cyber-red/20' :
                    tip.color === 'green' ? 'bg-cyber-green/10 text-cyber-green-dark border-cyber-green/20' :
                    tip.color === 'gold' ? 'bg-cyber-gold/10 text-cyber-gold-dark border-cyber-gold/20' :
                    'bg-cyber-blue-light/20 text-cyber-blue-dark border-cyber-blue/20'
                  }`}>
                    <TipIcon className="w-4 h-4" />
                  </div>
                  <Badge variant={priorityColors[tip.priority]} size="sm">{tip.priority}</Badge>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-graphite leading-tight">
                    {lang === 'hi' ? tip.titleHi : tip.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed flex-1">
                  {lang === 'hi' ? tip.tipHi : tip.tip}
                </p>

                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-cyber-green-dark text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Security Practice</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Helpline Callout */}
      <div className="p-6 rounded-2xl bg-cyber-red/5 border border-cyber-red/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs font-bold text-cyber-red-dark uppercase tracking-wider block">Emergency Cybercrime Helpline</span>
          <h3 className="font-extrabold text-2xl font-display text-graphite mt-0.5">1930</h3>
          <p className="text-xs text-slate-600 font-medium mt-1">
            {lang === 'hi'
              ? 'साइबर धोखाधड़ी होने पर तुरंत 1930 पर कॉल करें। 2 घंटे के अंदर बैंक ट्रांजेक्शन रोका जा सकता है।'
              : 'Call immediately after a cyber fraud. Transactions can be blocked within 2 hours of reporting.'}
          </p>
        </div>
        <a
          href="tel:1930"
          className="px-6 py-3 rounded-xl bg-cyber-red-dark text-white font-bold text-sm shrink-0 hover:bg-red-700 transition-colors shadow-sm"
        >
          📞 Call 1930
        </a>
      </div>

    </div>
  );
};
