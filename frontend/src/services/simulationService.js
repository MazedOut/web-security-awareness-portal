import { apiClient } from './api';
import { mockSimulations } from '../data/mockSimulations';

/**
 * Compute SHA-1 hex digest locally in browser using Web Crypto API (FR-06.1).
 * Plaintext password and full hash NEVER leave the browser.
 */
async function sha1Hex(str) {
  if (!window.crypto || !window.crypto.subtle) return null;
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await window.crypto.subtle.digest('SHA-1', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export const simulationService = {
  getPhishingEmails: async () => mockSimulations.phishingEmails,
  getSmishingMessages: async () => mockSimulations.smishingMessages,
  getSocialEngineeringScenarios: async () => mockSimulations.socialEngineeringScenarios,
  getUrlInspectorSamples: async () => mockSimulations.urlInspectorSamples,
  getQuizQuestions: async () => mockSimulations.quizQuestions,

  checkPasswordBreach: async (password, signal) => {
    if (!password) return { breach_count: 0, message: '', service_unavailable: false };

    try {
      const fullHash = await sha1Hex(password);
      if (!fullHash) throw new Error('Web Crypto unavailable');

      const prefix = fullHash.slice(0, 5);
      const suffix = fullHash.slice(5);

      const res = await apiClient.get(`/api/pwned-range/${prefix}`, { signal });
      const lines = (res.data?.hashes || '').split('\n');
      let breachCount = 0;

      for (const line of lines) {
        const parts = line.trim().split(':');
        if (parts.length === 2 && parts[0].toUpperCase() === suffix) {
          breachCount = parseInt(parts[1], 10) || 0;
          break;
        }
      }

      return {
        breach_count: breachCount,
        service_unavailable: false,
        message: breachCount > 0
          ? `Warning: This exact password was found in ${breachCount.toLocaleString()} public data breaches!`
          : 'Good news: This password was not found in known exposed breach datasets.'
      };
    } catch (e) {
      if (e?.name === 'CanceledError' || e?.name === 'AbortError') {
        throw e;
      }
      // Offline fallback: check local common breaches dictionary
      const commonBreaches = {
        'password': 9823412,
        'password123': 4120934,
        '123456': 28410291,
        'qwerty': 8120491,
        'admin': 3290142,
        'iloveyou': 2190412,
        'welcome': 1849102,
        'monkey': 941029,
        'dragon': 749102,
      };
      const clean = password.toLowerCase().trim();
      const count = commonBreaches[clean] || 0;
      return {
        breach_count: count,
        service_unavailable: true,
        message: count > 0 
          ? `Offline Detection: Password matched common breach pattern (${count.toLocaleString()} occurrences).` 
          : 'Live breach service offline; offline check did not match common wordlists.'
      };
    }
  }
};
