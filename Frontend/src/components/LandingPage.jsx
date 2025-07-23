import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaGift, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import SEO from './SEO';

export default function LandingPage() {
  const trackConversion = () => {
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-CONVERSION_ID/SIGNUP_CONVERSION_LABEL'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <SEO 
        title="Get ₹1000 FREE Credits - NeoRecruiter AI Interview Platform"
        description="Start your AI-powered hiring journey with ₹1000 FREE credits! Transform interviews, screen candidates instantly, and make smarter hiring decisions. Limited time offer!"
        keywords="free AI interview credits, hiring platform offer, recruitment software trial, candidate screening bonus, HR technology discount"
        url="/landing"
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6 animate-pulse">
            <FaGift className="mr-2" />
            <span className="font-bold">LIMITED TIME OFFER</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Get ₹1000 FREE Credits
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Transform your hiring process with AI-powered interviews. 
            <span className="font-bold text-blue-600"> Start FREE today</span> and get instant candidate analysis!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              to="/Signup" 
              onClick={trackConversion}
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center"
            >
              <FaRocket className="mr-2" />
              Claim ₹1000 FREE Credits
              <FaArrowRight className="ml-2" />
            </Link>
            
            <div className="text-sm text-gray-600">
              ✅ No Credit Card Required • ✅ Instant Setup • ✅ 50+ Free Interviews
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <FaCheckCircle className="text-3xl text-green-500" />,
              title: "AI-Powered Analysis",
              desc: "Get instant candidate scoring with advanced AI technology"
            },
            {
              icon: <FaCheckCircle className="text-3xl text-blue-500" />,
              title: "Save 80% Time",
              desc: "Automate screening and focus on top candidates only"
            },
            {
              icon: <FaCheckCircle className="text-3xl text-purple-500" />,
              title: "₹1000 FREE Credits",
              desc: "Start immediately with 50+ free AI interviews included"
            }
          ].map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring?</h2>
          <p className="text-xl mb-6">Join 500+ companies already using NeoRecruiter</p>
          <Link 
            to="/Signup"
            onClick={trackConversion}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Start Free Trial Now
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}