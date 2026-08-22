import { apiClient } from './api';
import { mockSimulations } from '../data/mockSimulations';

export const simulationService = {
  getPhishingEmails: async () => mockSimulations.phishingEmails,
  getSmishingMessages: async () => mockSimulations.smishingMessages,
  getSocialEngineeringScenarios: async () => mockSimulations.socialEngineeringScenarios,
  getUrlInspectorSamples: async () => mockSimulations.urlInspectorSamples,
  getQuizQuestions: async () => mockSimulations.quizQuestions,

  checkPasswordBreach: async (password) => {
    try {
      const res = await apiClient.post('/api/check-password-breach', { password });
      return res.data;
    } catch (e) {
      // Local fallback breach checker simulation
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
      const count = commonBreaches[clean] || (clean.length < 8 ? 450 : 0);
      return {
        breach_count: count,
        message: count > 0 
          ? `Warning: This password pattern has been seen ${count.toLocaleString()} times in known data breaches!` 
          : 'Good news: This password was not found in known common breach dumps.'
      };
    }
  }
};
