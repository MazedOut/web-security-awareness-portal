// API Configuration for Security Insights / Cyber Awareness Feed
// Prepares the platform for integrating live RSS feeds and Threat Intelligence APIs

const RESOURCE_API_KEY = import.meta.env.VITE_RESOURCE_API_KEY || '';
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || '';

/**
 * Fetches the latest cybersecurity awareness articles and threat reports.
 * In a production environment, this would call out to a backend aggregator or direct APIs 
 * (like NewsAPI, CERT-In RSS feeds, or Threat Intel feeds).
 * 
 * For now, this returns a curated list of mock high-quality resources to build the UI/UX.
 */
export const fetchSecurityResources = async (filters = {}) => {
  // If we had the live APIs connected, it would look like this:
  /*
  if (RESOURCE_API_KEY) {
    const response = await fetch(`https://api.cyberthreats.com/v1/articles?key=${RESOURCE_API_KEY}&category=${filters.category}`);
    return await response.json();
  }
  */

  // Fallback to high-quality curated mock data for UI implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockResources());
    }, 600); // Simulate network latency
  });
};

function getMockResources() {
  return [
    {
      id: 'res-001',
      title: 'CERT-In Issues High Severity Warning for Android Users',
      sourceName: 'CERT-In',
      sourceLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png',
      publicationDate: '2026-08-20',
      category: 'Threat News',
      threatType: 'Malware',
      readingTime: '3 min read',
      previewText: 'The Indian Computer Emergency Response Team (CERT-In) has flagged multiple vulnerabilities in Android versions 12, 13, and 14, allowing attackers to execute arbitrary code...',
      beginnerExplanation: {
        en: 'Hackers found a weakness in Android phones. If you don\'t update your phone, they could install bad apps on it without you knowing. Update your phone immediately.',
        hi: 'हैकर्स ने एंड्रॉइड फोन में एक कमी ढूंढ ली है। अगर आप अपना फोन अपडेट नहीं करते हैं, तो वे आपकी जानकारी के बिना उसमें खतरनाक ऐप डाल सकते हैं। तुरंत अपना फोन अपडेट करें।'
      },
      originalUrl: 'https://www.cert-in.org.in/',
      verifiedSafe: true
    },
    {
      id: 'res-002',
      title: 'Understanding the Rise of Deepfake Phishing Scams',
      sourceName: 'Microsoft Security',
      sourceLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      publicationDate: '2026-08-18',
      category: 'Cyber Awareness',
      threatType: 'Social Engineering',
      readingTime: '5 min read',
      previewText: 'Deepfake technology is increasingly being utilized by threat actors to impersonate C-level executives in highly targeted Business Email Compromise (BEC) and video call scams...',
      beginnerExplanation: {
        en: 'Scammers are using AI to create fake videos and voices that look exactly like your boss or family members to trick you into sending them money.',
        hi: 'जालसाज AI का इस्तेमाल करके आपके बॉस या परिवार वालों की नकली आवाज़ और वीडियो बना रहे हैं, ताकि आपसे पैसे ऐंठ सकें।'
      },
      originalUrl: 'https://www.microsoft.com/en-us/security/blog/',
      verifiedSafe: true
    },
    {
      id: 'res-003',
      title: 'Credential Stuffing Attacks Hit Major Retailers',
      sourceName: 'The Hacker News',
      sourceLogo: 'https://thehackernews.com/images/-p09Jc4T3230/YqX8Bq3G3XI/AAAAAAAABQY/PXYVvY3vQ5g5W2y3v5v5v5v5v5v5v5v5v5w/s0/thn.png',
      publicationDate: '2026-08-15',
      category: 'Data Breaches',
      threatType: 'Credential Stuffing',
      readingTime: '4 min read',
      previewText: 'Several prominent e-commerce platforms have reported massive spikes in credential stuffing attacks utilizing combinations of username/password pairs leaked in previous breaches...',
      beginnerExplanation: {
        en: 'Attackers use leaked passwords from one website to try logging into other websites. This is why you must never use the same password twice.',
        hi: 'हमलावर एक वेबसाइट से लीक हुए पासवर्ड का उपयोग करके दूसरी वेबसाइटों में लॉग इन करने की कोशिश करते हैं। इसलिए कभी भी एक ही पासवर्ड का दोबारा उपयोग न करें।'
      },
      originalUrl: 'https://thehackernews.com/',
      verifiedSafe: true
    },
    {
      id: 'res-004',
      title: 'Zero-Click iOS Exploit Discovered in the Wild',
      sourceName: 'Cloudflare Security',
      sourceLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.png',
      publicationDate: '2026-08-10',
      category: 'Security Research',
      threatType: 'Zero-Day',
      readingTime: '6 min read',
      previewText: 'Researchers have identified a new zero-click exploit chain targeting iOS users via malicious iMessage attachments, requiring no user interaction to compromise the device...',
      beginnerExplanation: {
        en: 'A highly advanced attack that can infect an iPhone just by receiving a message—you don\'t even have to click a link. Apple has released a patch, so update your device now.',
        hi: 'एक बहुत ही उन्नत हमला जो सिर्फ एक मैसेज प्राप्त करने से iPhone को संक्रमित कर सकता है—आपको किसी लिंक पर क्लिक करने की भी आवश्यकता नहीं है। अपना फोन अपडेट करें।'
      },
      originalUrl: 'https://blog.cloudflare.com/',
      verifiedSafe: true
    }
  ];
}
