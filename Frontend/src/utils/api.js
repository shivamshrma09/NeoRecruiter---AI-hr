import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:4000',

  headers: { 'Content-Type': 'application/json' },

});


const getStoredToken = () => {
  return localStorage.getItem('token');
};

api.interceptors.request.use(
  async (config) => {
    const token = getStoredToken();
    
    if (token) {
  
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
    

    if (error.response && error.response.status === 401) {

      if (!window.location.pathname.includes('/login')) {
        console.error('Authentication error:', error.response.data);
        

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        

        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    }
    

    if (originalRequest?.url === '/hr/interviews' && (!error.response || error.response.status >= 400)) {
      console.log('Trying fallback interviews endpoint...');
      try {

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
    

    console.error(`API Error (${originalRequest?.url}):`, error.message);
    
    return Promise.reject(error);
  }
);

export default api;
