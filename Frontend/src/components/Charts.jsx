import React from 'react';
import { FaChartBar, FaChartPie, FaChartLine, FaTrophy, FaUsers, FaClock } from 'react-icons/fa';

const BarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <FaChartBar className="mr-2 text-blue-600" />
        {title}
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm font-medium text-gray-600 truncate">
              {item.label}
            </div>
            <div className="flex-1 mx-3">
              <div className="bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="w-12 text-sm font-bold text-blue-600">
              {item.value}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <FaChartPie className="mr-2 text-green-600" />
        {title}
      </h3>
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -cumulativePercentage;
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
        </div>
        <div className="ml-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-600">{item.label}: {item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500 text-blue-600",
    green: "bg-green-500 text-green-600",
    purple: "bg-purple-500 text-purple-600",
    orange: "bg-orange-500 text-orange-600"
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const AnalyticsDashboard = ({ interviews = [] }) => {
  const totalCandidates = interviews.reduce((sum, interview) => sum + (interview.candidates?.length || 0), 0);
  const completedInterviews = interviews.reduce((sum, interview) => 
    sum + (interview.candidates?.filter(c => c.status === 'completed')?.length || 0), 0);
  
  let totalScores = 0;
  let scoreCount = 0;
  
  interviews.forEach(interview => {
    interview.candidates?.forEach(candidate => {
      if (candidate.scores?.length > 0) {
        candidate.scores.forEach(score => {
          const overallScore = score.OverallCompetency || score.overallscore || '0';
          const numericScore = parseInt(overallScore.toString().split(' ')[0]) || 0;
          totalScores += numericScore;
          scoreCount++;
        });
      }
    });
  });
  
  const avgScore = scoreCount > 0 ? (totalScores / scoreCount) : 0;
  
  const scoreDistribution = [
    { label: 'Excellent (4-5)', value: 25, color: '#10B981' },
    { label: 'Good (3-4)', value: 45, color: '#3B82F6' },
    { label: 'Average (2-3)', value: 20, color: '#F59E0B' },
    { label: 'Poor (1-2)', value: 10, color: '#EF4444' }
  ];

  const skillsData = [
    { label: 'Technical', value: 78 },
    { label: 'Communication', value: 85 },
    { label: 'Problem Solving', value: 72 },
    { label: 'Industry Knowledge', value: 68 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FaUsers}
          title="Total Candidates"
          value={totalCandidates}
          subtitle="Across all interviews"
          color="blue"
        />
        <StatCard
          icon={FaCheckCircle}
          title="Completed"
          value={completedInterviews}
          subtitle={`${Math.round((completedInterviews/totalCandidates)*100)}% completion rate`}
          color="green"
        />
        <StatCard
          icon={FaTrophy}
          title="Average Score"
          value={`${Math.round(avgScore * 20)}%`}
          subtitle="Overall performance"
          color="purple"
        />
        <StatCard
          icon={FaClock}
          title="Active Interviews"
          value={interviews.length}
          subtitle="Currently running"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart data={skillsData} title="Skills Analysis" />
        <PieChart data={scoreDistribution} title="Score Distribution" />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;