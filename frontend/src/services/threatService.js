import { apiClient } from './api';
import { mockThreats } from '../data/mockThreats';

export const threatService = {
  getAllThreats: async () => {
    try {
      const res = await apiClient.get('/api/threats');
      return res.data?.length ? res.data : mockThreats;
    } catch (e) {
      return mockThreats;
    }
  },

  getThreatById: async (id) => {
    try {
      const res = await apiClient.get(`/api/threats/${id}`);
      return res.data || mockThreats.find(t => t.id === id);
    } catch (e) {
      return mockThreats.find(t => t.id === id) || null;
    }
  }
};
