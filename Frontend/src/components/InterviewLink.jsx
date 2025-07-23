import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserTie, FaBuilding, FaCalendarAlt, FaQuestionCircle, FaArrowRight } from 'react-icons/fa';
import api from '../utils/api';
import { getDemoToken, storeDemoToken } from '../utils/demoUtils';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function InterviewLink() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const navigate = useNavigate();
  const query = useQuery();
  
  const interviewId = query.get('id');
  const candidateEmail = query.get('email');

  useEffect(() => {
    const fetchInterviewData = async () => {
      if (!interviewId || !candidateEmail) {
        setError('Invalid interview link. Missing required parameters.');
        setLoading(false);
        return;
      }

      try {
        // Get a demo token for this candidate
        const tokenResult = await getDemoToken(candidateEmail);
        if (tokenResult.success) {
          // Store the token for future use
          storeDemoToken(candidateEmail, tokenResult.token);
        }
        
        const response = await api.get(`/interview/candidate?id=${interviewId}&email=${encodeURIComponent(candidateEmail)}`);
        setInterviewData(response.data);
      } catch (err) {
        console.error('Failed to fetch interview data:', err);
        setError(err.response?.data?.message || 'Failed to load interview details. Please check your link.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, [interviewId, candidateEmail]);

  const startInterview = async () => {
    // Make sure we have a demo token before starting the interview
    const tokenResult = await getDemoToken(candidateEmail);
    if (tokenResult.success) {
      storeDemoToken(candidateEmail, tokenResult.token);
    }
    
    navigate(`/interview?id=${interviewId}&email=${encodeURIComponent(candidateEmail)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-700 mx-auto mb-4"></div>
          <p className="text-xl text-blue-800 font-semibold">Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">
            <FaQuestionCircle className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Interview Link Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-gray-600 mb-6">Please contact the HR team that sent you this invitation for assistance.</p>
        </div>
      </div>
    );
  }

  if (!interviewData) {
    return null;
  }

  const { interview, candidate } = interviewData;
  const isCompleted = candidate.answers.length === interview.questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white text-center">
            <h1 className="text-3xl font-bold mb-2">Interview Invitation</h1>
            <p className="text-xl opacity-90">AI-Powered Assessment</p>
          </div>
          
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Your Interview</h2>
              <p className="text-gray-600 mb-4">
                You've been invited to participate in an AI-powered interview for the <span className="font-semibold text-blue-700">{interview.role}</span> position.
                This innovative process allows you to showcase your skills and experience at your convenience.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Interview Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FaUserTie className="text-blue-700 text-xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-semibold text-gray-800">{interview.role}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaBuilding className="text-blue-700 text-xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Domain</p>
                    <p className="font-semibold text-gray-800">{interview.technicalDomain || 'General'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaQuestionCircle className="text-blue-700 text-xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Questions</p>
                    <p className="font-semibold text-gray-800">{interview.questions.length} questions</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-blue-700 text-xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Estimated Duration</p>
                    <p className="font-semibold text-gray-800">{Math.max(15, interview.questions.length * 5)} minutes</p>
                  </div>
                </div>
              </div>
            </div>
            
            {isCompleted ? (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      You have already completed this interview. Thank you for your participation!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 mb-8">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <span className="font-medium">Important:</span> Please ensure you have a stable internet connection and a quiet environment before starting.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={startInterview}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-8 rounded-lg shadow-lg flex items-center justify-center mx-auto transition-all duration-300 transform hover:scale-105"
                  >
                    Start Interview <FaArrowRight className="ml-2" />
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    By starting the interview, you agree to participate in this AI-powered assessment process.
                  </p>
                </div>
              </>
            )}
          </div>
          
          <div className="bg-gray-50 p-6 text-center border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} NeoRecruiter - AI-Powered Interview Platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}