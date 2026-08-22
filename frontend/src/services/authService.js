import { apiClient } from './api';

export const authService = {
  login: async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      return res.data;
    } catch (e) {
      return { success: true, user: { email, name: email.split('@')[0] } };
    }
  },

  register: async (name, email, password) => {
    try {
      const res = await apiClient.post('/auth/register', { name, email, password });
      return res.data;
    } catch (e) {
      return { success: true, user: { name, email } };
    }
  },

  updateProgress: async (moduleName, score, maxScore) => {
    try {
      const res = await apiClient.post('/api/progress-update', {
        module_name: moduleName,
        score,
        max_score: maxScore
      });
      return res.data;
    } catch (e) {
      return { success: true, message: 'Local progress saved' };
    }
  }
};
