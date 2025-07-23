import axios from 'axios';

const api = axios.create({
  baseURL: 'https://neorecruiter-ai-hr-1.onrender.com',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't automatically redirect on 401 errors
      console.error('Authentication error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
