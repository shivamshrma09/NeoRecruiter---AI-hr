import axios from 'axios';

const api = axios.create({
  baseURL: 'https://neorecruiter-ai-hr.onrender.com',
  withCredentials: true, // Enable credentials for auth cookies
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000 // 30 second timeout
});

// Function to get a fresh token - only uses existing token, no auto-login
const getStoredToken = () => {
  return localStorage.getItem('token');
};

// Update the base URL if needed based on environment
if (window.location.hostname === 'neorecruiter.vercel.app') {
  api.defaults.baseURL = 'https://neorecruiter-ai-hr.onrender.com';
}

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
    
    // Special handling for interviews endpoint
    if (originalRequest?.url === '/hr/interviews' && (!error.response || error.response.status >= 400)) {
      console.log('Trying fallback interviews endpoint...');
      try {
        // Try the fallback endpoint
        const fallbackResponse = await axios({
          ...originalRequest,
          method: 'GET',
          url: '/mock/data',
          baseURL: originalRequest.baseURL
        });
        console.log('Fallback successful, using mock data');
        return fallbackResponse;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError.message);
        // Try local mock data as a last resort
        return {
          data: {
            interviews: [
              {
                _id: "demo-interview-1",
                role: "Frontend Developer",
                technicalDomain: "React",
                questions: [
                  { text: "What is React?", expectedAnswer: "React is a UI library developed by Facebook" }
                ],
                candidates: [
                  {
                    email: "candidate@example.com",
                    name: "John Doe",
                    status: "completed",
                    scores: [{ overallscore: "4 - Good" }]
                  }
                ],
                createdAt: new Date()
              }
            ],
            totalInterviews: 1,
            totalCandidates: 1,
            completedInterviews: 1,
            balance: 1000
          }
        };
      }
    }
    
    // For any other error, log it
    console.error(`API Error (${originalRequest?.url}):`, error.message);
    
    return Promise.reject(error);
  }
);

export default api;
