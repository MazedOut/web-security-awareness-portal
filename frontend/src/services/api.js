import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Graceful error capture for demo & offline mode
    console.warn('API call failed or backend offline. Using fallback service layer.', error.message);
    return Promise.reject(error);
  }
);
