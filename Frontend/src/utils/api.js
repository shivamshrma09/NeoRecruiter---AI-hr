import axios from 'axios';

const api = axios.create({
  baseURL: 'https://neorecruiter-ai-hr-1.onrender.com',
  withCredentials: true, // Enable credentials for auth cookies
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000 // 30 second timeout
});

// Function to get a fresh token - only uses existing token, no auto-login
const getStoredToken = () => {
  return localStorage.getItem('token');
};

api.interceptors.request.use(
  async (config) => {
    const token = getStoredToken();
    
    if (token) {
      // Make sure we're using the correct format for the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 (unauthorized)
    if (error.response && error.response.status === 401) {
      // If we're not on the login page, redirect to login
      if (!window.location.pathname.includes('/login')) {
        console.error('Authentication error:', error.response.data);
        
        // Clear token and user data if unauthorized
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    }
    
    // For any other error, log it
    console.error(`API Error (${originalRequest?.url}):`, error.message);
    
    return Promise.reject(error);
  }
);

export default api;
