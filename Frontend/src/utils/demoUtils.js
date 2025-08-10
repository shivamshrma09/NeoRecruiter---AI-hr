import api from './api';


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


export const storeDemoToken = (email, token) => {
  localStorage.setItem('demoEmail', email);
  localStorage.setItem('demoToken', token);
};


export const getStoredDemoToken = () => {
  const email = localStorage.getItem('demoEmail');
  const token = localStorage.getItem('demoToken');
  
  if (email && token) {
    return { email, token };
  }
  
  return null;
};


export const clearDemoToken = () => {
  localStorage.removeItem('demoEmail');
  localStorage.removeItem('demoToken');
};