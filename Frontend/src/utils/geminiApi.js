import api from './api';

export const generateQuestionsWithGemini = async (role, experience, skills) => {
  try {
    const response = await api.post('/ai/generate-questions', {
      role,
      experience,
      skills
    });
    
    return response.data.questions;
  } catch (error) {
    console.error('Error generating questions with Gemini:', error);
    throw error;
  }
};

export const analyzeInterviewWithGemini = async (interviewData) => {
  try {
    const response = await api.post('/ai/analyze-interview', interviewData);
    return response.data;
  } catch (error) {
    console.error('Error analyzing interview with Gemini:', error);
    throw error;
  }
};

export default {
  generateQuestionsWithGemini,
  analyzeInterviewWithGemini
};