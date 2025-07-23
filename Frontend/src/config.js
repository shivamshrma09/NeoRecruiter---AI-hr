export const API_BASE_URL = "https://neorecruiter-ai-hr.onrender.com";

// Dynamically set the API URL based on environment
const hostname = window.location.hostname;
if (hostname === 'localhost' || hostname === '127.0.0.1') {
  // Local development
  export const API_URL = "http://localhost:3000";
} else {
  // Production
  export const API_URL = "https://neorecruiter-ai-hr.onrender.com";
}