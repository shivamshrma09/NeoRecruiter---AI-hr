import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaUser, FaEnvelope, FaPhone, FaFileAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import api from '../utils/api';

export default function InterviewResults() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interview, setInterview] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchInterviewResults = async () => {
      try {
        // Fetch interview details
        const response = await api.get(`/hr/interviews`);
        const interviews = response.data.interviews || [];
        const foundInterview = interviews.find(i => i._id === id);
        
        if (!foundInterview) {
          setError('Interview not found');
          setLoading(false);
          return;
        }
        
        setInterview(foundInterview);
        
        // Sort candidates by score (highest first)
        const sortedCandidates = [...foundInterview.candidates].sort((a, b) => {
          const scoreA = calculateAverageScore(a.scores);
          const scoreB = calculateAverageScore(b.scores);
          return scoreB - scoreA;
        });
        
        setCandidates(sortedCandidates);
      } catch (err) {
        console.error('Failed to fetch interview results:', err);
        setError(err.response?.data?.message || 'Failed to load interview results');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInterviewResults();
    } else {
      setError('Interview ID is required');
      setLoading(false);
    }
  }, [id]);

  const calculateAverageScore = (scores) => {
    if (!scores || scores.length === 0) return 0;
    
    const total = scores.reduce((sum, score) => {
      const overallScore = score.overallscore || '';
      const numericScore = parseInt(overallScore.split(' ')[0]) || 0;
      return sum + numericScore;
    }, 0);
    
    return Math.round((total / scores.length) * 20); // Scale to 0-100
  };

  const handleBack = () => {
    if (selectedCandidate) {
      setSelectedCandidate(null);
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading interview results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">
            <FaExclamationTriangle className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!interview) return null;

  if (selectedCandidate) {
    // Candidate detail view
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-700 hover:text-blue-900 mb-6"
          >
            <FaChevronLeft className="mr-2" /> Back to Candidates
          </button>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white">
              <h1 className="text-2xl font-bold">Candidate Details</h1>
              <p className="opacity-90">{interview.role} Position</p>
            </div>
            
            <div className="p-6">
              {/* Candidate Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-2xl font-bold mr-4">
                    {selectedCandidate.name ? selectedCandidate.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{selectedCandidate.name || 'Unnamed Candidate'}</h2>
                    <p className="text-gray-600">{selectedCandidate.email}</p>
                    {selectedCandidate.phone && <p className="text-gray-600">{selectedCandidate.phone}</p>}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Overall Score</p>
                  <p className="text-3xl font-bold text-blue-700">{calculateAverageScore(selectedCandidate.scores)}%</p>
                </div>
              </div>
              
              {/* Cheating Warning */}
              {selectedCandidate.cheatingDetected && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex">
                    <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
                    <div>
                      <h3 className="text-red-800 font-semibold">Suspicious Activity Detected</h3>
                      <p className="text-red-700">This candidate showed signs of potential cheating during the interview.</p>
                      {selectedCandidate.cheatingFlags && selectedCandidate.cheatingFlags.length > 0 && (
                        <ul className="mt-2 list-disc list-inside text-red-700">
                          {selectedCandidate.cheatingFlags.map((flag, index) => (
                            <li key={index}>{flag}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Resume */}
              {selectedCandidate.resume && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Resume</h3>
                  <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                    <FaFileAlt className="text-blue-700 text-xl mr-3" />
                    <div className="flex-1">
                      <p className="text-gray-700">Candidate Resume</p>
                      <p className="text-sm text-gray-500">{selectedCandidate.resume.split('/').pop()}</p>
                    </div>
                    <a 
                      href={`/uploads/${selectedCandidate.resume}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800"
                    >
                      View Resume
                    </a>
                  </div>
                </div>
              )}
              
              {/* Answers & Scores */}
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Interview Responses</h3>
              <div className="space-y-6">
                {interview.questions.map((question, index) => {
                  const answer = selectedCandidate.answers[index] || 'No answer provided';
                  const score = selectedCandidate.scores[index] || null;
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800">Question {index + 1}</h4>
                        {score && (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            Score: {parseInt(score.overallscore?.split(' ')[0]) * 20 || 0}%
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{question.text}</p>
                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Candidate's Answer:</p>
                        <p className="text-gray-600">{answer}</p>
                      </div>
                      
                      {score && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 mb-2">AI Analysis:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>Relevance: {score.Relevance}</div>
                            <div>Content Depth: {score.ContentDepth}</div>
                            <div>Communication: {score.CommunicationSkill}</div>
                            <div>Sentiment: {score.Sentiment}</div>
                          </div>
                          {score.improvement && (
                            <div className="mt-2 p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
                              <p className="text-xs font-medium text-yellow-800">Improvement Suggestion:</p>
                              <p className="text-xs text-yellow-700">{score.improvement}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Candidates list view
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-700 hover:text-blue-900 mb-6"
        >
          <FaChevronLeft className="mr-2" /> Back to Dashboard
        </button>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white">
            <h1 className="text-2xl font-bold">{interview.role} - Interview Results</h1>
            <p className="opacity-90">{interview.technicalDomain || 'General'}</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-3xl font-bold text-blue-700">{interview.questions.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Candidates</p>
                <p className="text-3xl font-bold text-green-700">{interview.candidates.length}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Completed Interviews</p>
                <p className="text-3xl font-bold text-purple-700">
                  {interview.candidates.filter(c => c.status === 'completed').length}
                </p>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-4">Candidates</h2>
            
            {candidates.length > 0 ? (
              <div className="space-y-4">
                {candidates.map((candidate, index) => {
                  const score = calculateAverageScore(candidate.scores);
                  const isCompleted = candidate.status === 'completed';
                  
                  return (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer ${
                        isCompleted ? 'border-green-200' : 'border-yellow-200'
                      }`}
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                            isCompleted ? 'bg-green-600' : 'bg-yellow-500'
                          }`}>
                            {candidate.name ? candidate.name.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{candidate.name || candidate.email}</h3>
                            <p className="text-sm text-gray-600">{candidate.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {candidate.cheatingDetected && (
                            <div className="flex items-center text-red-600">
                              <FaExclamationTriangle className="mr-1" />
                              <span className="text-sm">Suspicious Activity</span>
                            </div>
                          )}
                          
                          <div className="text-center">
                            <p className={`text-lg font-bold ${
                              score >= 80 ? 'text-green-600' : 
                              score >= 60 ? 'text-blue-600' : 
                              'text-yellow-600'
                            }`}>
                              {score}%
                            </p>
                            <p className="text-xs text-gray-500">Score</p>
                          </div>
                          
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isCompleted 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {isCompleted ? (
                              <span className="flex items-center">
                                <FaCheckCircle className="mr-1" /> Completed
                              </span>
                            ) : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No candidates have taken this interview yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}