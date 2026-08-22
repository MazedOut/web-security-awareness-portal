import { apiClient } from './api';
import { mockCyberStats } from '../data/mockStats';

export const statsService = {
  getCyberStatistics: async () => {
    try {
      const res = await apiClient.get('/api/cyber-statistics');
      return res.data || mockCyberStats;
    } catch (e) {
      return mockCyberStats;
    }
  }
};
