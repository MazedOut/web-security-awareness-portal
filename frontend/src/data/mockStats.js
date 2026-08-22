export const mockCyberStats = {
  headlineMetrics: [
    {
      id: "stat-daily-attacks",
      label: "Global Cyber Attacks Per Day",
      labelHi: "प्रतिदिन वैश्विक साइबर हमले",
      value: 2200,
      suffix: "+",
      unit: "attacks/day",
      change: "+15.4% YoY",
      trend: "up",
      icon: "Activity",
      color: "red",
      description: "One cyber attack occurs approximately every 39 seconds across connected networks."
    },
    {
      id: "stat-phishing-share",
      label: "Breaches Involving Human Phishing",
      labelHi: "फिशिंग से जुड़े कुल डेटा लीक",
      value: 84,
      suffix: "%",
      unit: "of all breaches",
      change: "+8.2% vs 2023",
      trend: "up",
      icon: "Flame",
      color: "gold",
      description: "Human error and social deception remain the #1 entry vector for initial compromise."
    },
    {
      id: "stat-avg-breach-cost",
      label: "Average Cost of a Data Breach",
      labelHi: "डेटा ब्रीच का औसत नुकसान",
      value: 4.88,
      prefix: "$",
      suffix: "M",
      unit: "USD per incident",
      change: "+10% vs 2023",
      trend: "up",
      icon: "DollarSign",
      color: "purple",
      description: "Global average data breach cost reached an all-time high according to IBM Security."
    },
    {
      id: "stat-2fa-defense",
      label: "Account Takeovers Prevented by 2FA",
      labelHi: "2FA द्वारा रोके गए खाते के हमले",
      value: 99.9,
      suffix: "%",
      unit: "protection rate",
      change: "Proven defense",
      trend: "safe",
      icon: "ShieldCheck",
      color: "green",
      description: "Enabling multi-factor authentication blocks nearly all automated bot attacks."
    }
  ],

  // Monthly Cyber Incident Trends
  monthlyAttackTrends: [
    { month: "Jan", attacks: 18500, phishing: 12400, ransomware: 3200 },
    { month: "Feb", attacks: 21000, phishing: 14100, ransomware: 3800 },
    { month: "Mar", attacks: 24500, phishing: 16800, ransomware: 4100 },
    { month: "Apr", attacks: 22800, phishing: 15200, ransomware: 3900 },
    { month: "May", attacks: 28400, phishing: 19500, ransomware: 4600 },
    { month: "Jun", attacks: 31200, phishing: 21600, ransomware: 5200 },
    { month: "Jul", attacks: 33800, phishing: 23400, ransomware: 5800 },
    { month: "Aug", attacks: 36500, phishing: 25100, ransomware: 6300 },
  ],

  // Primary Attack Vectors Distribution
  attackVectorsDistribution: [
    { name: "Phishing & Social Eng", value: 43, color: "#EF4444" },
    { name: "Stolen Credentials / Brute Force", value: 24, color: "#F59E0B" },
    { name: "Unpatched Vulnerabilities", value: 16, color: "#8B5CF6" },
    { name: "Malware & Ransomware", value: 12, color: "#3B82F6" },
    { name: "Insider Threats / Misconfig", value: 5, color: "#10B981" },
  ],

  // Password Cracking Time Matrix (by GPU Hashcat 2026 speeds)
  passwordCrackingMatrix: [
    { length: "6 chars", numbersOnly: "Instant", lowerOnly: "Instant", mixedCase: "1 sec", withSymbols: "4 secs" },
    { length: "8 chars", numbersOnly: "Instant", lowerOnly: "Instant", mixedCase: "22 mins", withSymbols: "8 hours" },
    { length: "10 chars", numbersOnly: "Instant", lowerOnly: "3 weeks", mixedCase: "5 years", withSymbols: "400 years" },
    { length: "12 chars", numbersOnly: "25 secs", lowerOnly: "200 years", mixedCase: "100k years", withSymbols: "34M years" },
    { length: "16 chars (Passphrase)", numbersOnly: "10 days", lowerOnly: "1 Trillion yrs", mixedCase: "Infinity", withSymbols: "Infinity" },
  ],

  // Targeted Industry Sectors
  targetedSectors: [
    { sector: "Finance & Banking", percentage: 27, color: "#F59E0B" },
    { sector: "Healthcare & Hospitals", percentage: 22, color: "#EF4444" },
    { sector: "Government & Public Utilities", percentage: 19, color: "#8B5CF6" },
    { sector: "Education & Research", percentage: 15, color: "#3B82F6" },
    { sector: "Retail & E-commerce", percentage: 11, color: "#06B6D4" },
    { sector: "Individual Citizens", percentage: 6, color: "#10B981" },
  ],

  // National / Regional Cybercrime Insights (India & Global)
  nationalInsights: [
    {
      title: "UPI & Digital Banking Fraud Volume",
      stat: "68% of Financial Cybercrime",
      note: "Fake QR codes, deceptive APK screen-share links, and urgent KYC SMS make up over two-thirds of individual financial frauds reported on the 1930 portal."
    },
    {
      title: "Average Resolution Golden Hour",
      stat: "First 2 Hours",
      note: "Reporting fraudulent transactions within the first 2 hours to 1930 results in an over 75% fund freeze and recovery success rate."
    },
    {
      title: "Deceptive Domain Registrations",
      stat: "120,000+ Fake Domains / Month",
      note: "Cyber syndicates register over 120,000 lookalike brand domains monthly targeting utility bills, tax refunds, and courier tracking."
    }
  ]
};
