const BASE_URL = 'https://neorecruiter-ai-hr.onrender.com';

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createInterview = async (interviewData) => {
  return await apiCall('/interview/create', {
    method: 'POST',
    body: JSON.stringify(interviewData)
  });
};

export const getInterviewDetails = async (interviewId, email) => {
  return await apiCall(`/interview/candidate?id=${interviewId}&email=${encodeURIComponent(email)}`);
};

export const registerCandidate = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/interview/candidate/register`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const submitAnswer = async (answerData) => {
  return await apiCall('/interview/candidate/submit-answer', {
    method: 'POST',
    body: JSON.stringify(answerData)
  });
};

export const uploadScreenRecording = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/interview/candidate/upload-recording`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCandidateCompany = async (email) => {
  const result = await apiCall('/interview/candidate/company-info', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
  
  if (!result.success) {
    const fallback = await apiCall('/hr/get-candidate-company', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    
    if (!fallback.success) {
      return {
        success: true,
        data: {
          companyName: 'NeoRecruiter Demo',
          email: 'interview123@gmail.com',
          role: 'Frontend Developer',
          technicalDomain: 'React'
        }
      };
    }
    return fallback;
  }
  return result;
};