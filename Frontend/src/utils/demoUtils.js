import api from './api';

/**
 * Get a demo token for a candidate
 * @param {string} email - The candidate's email
 * @returns {Promise<Object>} - The result of the token request
 */
export const getDemoToken = async (email) => {
  try {
    const response = await api.post('/demo/token', { email });
    return {
      success: true,
      token: response.data.token
    };
  } catch (error) {
    console.error('Error getting demo token:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get demo token'
    };
  }
};

/**
 * Validate a demo token
 * @param {string} email - The candidate's email
 * @param {string} token - The demo token to validate
 * @returns {Promise<Object>} - The result of the validation
 */
export const validateDemoToken = async (email, token) => {
  try {
    const response = await api.post('/demo/validate', { email, token });
    return {
      success: true,
      interviewData: response.data.interviewData
    };
  } catch (error) {
    console.error('Error validating demo token:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to validate demo token'
    };
  }
};

/**
 * Store demo token in localStorage
 * @param {string} email - The candidate's email
 * @param {string} token - The demo token to store
 */
export const storeDemoToken = (email, token) => {
  localStorage.setItem('demoEmail', email);
  localStorage.setItem('demoToken', token);
};

/**
 * Get stored demo token from localStorage
 * @returns {Object|null} - The stored demo token info or null if not found
 */
export const getStoredDemoToken = () => {
  const email = localStorage.getItem('demoEmail');
  const token = localStorage.getItem('demoToken');
  
  if (email && token) {
    return { email, token };
  }
  
  return null;
};

/**
 * Clear stored demo token from localStorage
 */
export const clearDemoToken = () => {
  localStorage.removeItem('demoEmail');
  localStorage.removeItem('demoToken');
};