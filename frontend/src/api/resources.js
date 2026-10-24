// API Configuration for Security Insights / Cyber Threat Feed
// Integrates live server-side threat feed aggregator (CISA KEV, NVD CVE, CISA Advisories, Security News)

import { apiClient } from '../services/api';

/**
 * Fetches the latest live cybersecurity threat telemetry and advisories from the Flask backend.
 * Falls back to labeled offline sample records only if the backend is unreachable.
 */
export const fetchSecurityResources = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.severity && filters.severity !== 'All') params.append('severity', filters.severity);
    if (filters.item_type && filters.item_type !== 'All') params.append('type', filters.item_type);
    if (filters.actively_exploited) params.append('actively_exploited', 'true');
    if (filters.sort_by) params.append('sort', filters.sort_by);
    if (filters.page) params.append('page', filters.page);
    if (filters.per_page) params.append('per_page', filters.per_page);

    const response = await apiClient.get(`/api/threat-feed?${params.toString()}`);
    if (response.data && response.data.items) {
      return {
        items: response.data.items,
        totalItems: response.data.total_items,
        totalPages: response.data.total_pages,
        currentPage: response.data.page,
        lastSync: response.data.last_sync,
        sourceStatuses: response.data.source_statuses || {},
        isLive: true
      };
    }
  } catch (error) {
    console.warn('Backend threat feed unreachable; serving labeled educational reference.', error.message);
  }

  // Graceful offline fallback with clearly labeled simulated/educational flag
  const fallback = getOfflineSampleResources();
  return {
    items: fallback,
    totalItems: fallback.length,
    totalPages: 1,
    currentPage: 1,
    lastSync: null,
    sourceStatuses: {
      offline_cache: { name: 'Offline Emergency Cache', status: 'fallback', items: fallback.length }
    },
    isLive: false
  };
};

/**
 * Trigger manual server-side refresh of threat intelligence feeds.
 */
export const triggerThreatFeedRefresh = async () => {
  try {
    const response = await apiClient.post('/api/threat-feed/refresh');
    return response.data;
  } catch (error) {
    console.warn('Failed to refresh threat feed:', error.message);
    throw error;
  }
};

function getOfflineSampleResources() {
  return [
    {
      id: 'sim-cve-2024-4577',
      title: '[Simulated/Historical Sample] PHP CGI Argument Injection Remote Code Execution',
      summary: 'A critical vulnerability in PHP allowed attackers to bypass protections and achieve unauthenticated remote code execution via argument injection on Windows servers.',
      severity: 'Critical',
      cvss_score: 9.8,
      cve_id: 'CVE-2024-4577',
      vendor: 'PHP Group',
      product: 'PHP',
      category: 'Web Applications & Web Shells',
      item_type: 'advisory',
      is_actively_exploited: true,
      published_at: '2024-06-06T00:00:00Z',
      fetched_at: new Date().toISOString(),
      source_name: 'CISA KEV / NVD (Historical Baseline)',
      source_url: 'https://nvd.nist.gov/vuln/detail/CVE-2024-4577',
      required_action: 'Upgrade to PHP 8.1.29, 8.2.20, or 8.3.8 immediately.',
      notes: 'Included in CISA KEV catalog as actively exploited.'
    },
    {
      id: 'sim-adv-002',
      title: '[Simulated/Historical Sample] CERT-In Issues Advisory on Multi-Platform Mobile Spyware',
      summary: 'CERT-In flagged malicious APKs distributed via instant messaging platforms disguised as courier tracking and tax refund notifications.',
      severity: 'High',
      cvss_score: 8.4,
      cve_id: null,
      vendor: 'Android / Telephony',
      product: 'Mobile Ecosystem',
      category: 'Phishing & Social Engineering',
      item_type: 'incident',
      is_actively_exploited: true,
      published_at: '2024-08-15T00:00:00Z',
      fetched_at: new Date().toISOString(),
      source_name: 'CERT-In Advisory',
      source_url: 'https://www.cert-in.org.in/',
      required_action: 'Block unauthorized APK installations and verify SMS sender headers.',
      notes: ''
    }
  ];
}
