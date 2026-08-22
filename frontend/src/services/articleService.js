import { apiClient } from './api';
import { mockArticles } from '../data/mockArticles';

export const articleService = {
  getAllArticles: async () => {
    try {
      const res = await apiClient.get('/api/articles');
      return res.data?.length ? res.data : mockArticles;
    } catch (e) {
      return mockArticles;
    }
  },

  getArticleById: async (id) => {
    try {
      const res = await apiClient.get(`/api/articles/${id}`);
      return res.data || mockArticles.find(a => a.id === id);
    } catch (e) {
      return mockArticles.find(a => a.id === id) || null;
    }
  },

  getArticlesByCategory: async (category) => {
    const all = await articleService.getAllArticles();
    if (!category || category === 'All') return all;
    return all.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }
};
