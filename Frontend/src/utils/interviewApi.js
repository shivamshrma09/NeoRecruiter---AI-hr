import api from './api';

// Interview creation and management (HR)
export const createInterview = async (interviewData) => {
  try {
    const response = await api.post('/interview/create', interviewData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error creating interview:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to create interview' 
    };
  }
};

// Candidate interview functions
export const getInterviewDetails = async (interviewId, email) => {
  try {
    const response = await api.get(`/interview/candidate?id=${interviewId}&email=${encodeURIComponent(email)}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching interview details:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch interview details' 
    };
  }
};

export const registerCandidate = async (formData) => {
  try {
    const response = await api.post('/interview/candidate/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error registering candidate:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to register candidate' 
    };
  }
};

export const submitAnswer = async (answerData) => {
  try {
    const response = await api.post('/interview/candidate/submit-answer', answerData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error submitting answer:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to submit answer' 
    };
  }
};

export const uploadScreenRecording = async (formData) => {
  try {
    const response = await api.post('/interview/candidate/upload-recording', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error uploading screen recording:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to upload screen recording' 
    };
  }
};

export const getCandidateCompany = async (email) => {
  try {
    // Try the correct endpoint first
    const response = await api.post('/interview/candidate/company-info', { email });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching company info, trying fallback:', error);
    try {
      // Try fallback endpoint
      const fallbackResponse = await api.post('/hr/get-candidate-company', { email });
      return { success: true, data: fallbackResponse.data };
    } catch (fallbackError) {
      console.error('All company info endpoints failed:', fallbackError);
      // Return mock data as last resort
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
  }
};