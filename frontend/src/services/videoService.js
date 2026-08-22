import { apiClient } from './api';
import { mockVideos } from '../data/mockVideos';

export const videoService = {
  getAllVideos: async () => {
    try {
      const res = await apiClient.get('/api/videos');
      return res.data?.length ? res.data : mockVideos;
    } catch (e) {
      return mockVideos;
    }
  },

  getVideoById: async (id) => {
    try {
      const res = await apiClient.get(`/api/videos/${id}`);
      return res.data || mockVideos.find(v => v.id === id);
    } catch (e) {
      return mockVideos.find(v => v.id === id) || null;
    }
  }
};
