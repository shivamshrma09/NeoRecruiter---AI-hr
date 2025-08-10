import React from "react";
import "tailwindcss/tailwind.css";
import { FaRobot, FaGlobe, FaPencilAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function NewHome() {
  const [isVisible, setIsVisible] = useState(false);

  const [features, setFeatures] = useState([
    {
      title: "AI-Powered Analysis",
      description: "Get instant insights and rankings for candidates.",
      icon: FaRobot,   
    },
    {
      title: "Multilingual Support",
      description: "Conduct interviews in multiple languages seamlessly.",
      icon: FaGlobe,    
    },
    {
      title: "Customizable Questions",
      description: "Tailor interview questions to fit your needs.",
      icon: FaPencilAlt,
    },
  ]);

  const handleScroll = () => {
    const position = window.scrollY;
    if (position > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div className="w-full h-[60px] bg-white  text-xl text-blue-500 flex items-center justify-between px-8 shadow-md">
        <div className="flex items-center">
          <strong className="text-2xl text-blue-500">
            Neo<strong className=" text-2xl 2 text-black">Recruiter</strong>
          </strong>
        </div>
        <div className="flex gap-[-2px] text-lg">
          <Link
            to="/signup"
            className="ml-1 bg-white text-blue-600 hover:text-blue-700 transition px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition duration-300"
          >
            SingUp
          </Link>
          <Link
              to="/student-interview"
            className="ml-1 bg-white text-blue-600 hover:text-blue-700 transition px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition duration-300"
          >
            Mock Interview
          </Link>
          <div className="flex items-center">
            <Link
              to="/login"
              className=" bg-blue-600 text-white px-5 py-1 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full h-[700px] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center gap-12 px-6">
          <div className="text-center md:text-left  mt-[-100px]">
            <h1 className="text-5xl font-bold mb-3 mt-3">
              &nbsp;&nbsp;&nbsp; Hire smarter with <br />
            </h1>
            <h2 className="text-blue-500  text-5xl font-bold ">
              AI-powered interviews
            </h2>
            <p className="text-lg text-gray-600 mb-4 mt-4 ml-[-100px]">
              Transform your recruitment process with intelligent interviews
              that evaluate candidates <br /> &nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;fairly, save time, and help
              you find the perfect fit for your team.
            </p>
            <div className=" ml-[-65px] flex flex-col items-center md:items-start gap-4 mt-6 w-[650px] h-[200px] bg-white p-6 rounded-lg shadow-lg">
              <input
                type="text"
                placeholder="Enter job title or interview details"
                className="w-[600px] h-[200px] h-[50px] px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-600 transition">
                Start Interview
              </button>
            </div>
          </div>

          <img
            src="images-removebg-preview (1).png"
            alt="AI Recruitment"
            className="w-[600px] h-[300px] mt-[-230px]"
          />
        </div>
      </div>

      <div>
        <div className="text-center text-3xl  font-bold text-blue-500 mb-5">
          Features
        </div>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto mb-8">
          Discover the powerful features that make NeoRecruiter the best choice
          for your hiring needs.
        </p>

        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="w-[350px] h-[200px] bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 mx-auto"
              >
                <div>
                  <Icon
                    size={40}
                    color="blue"
                    style={{ marginLeft: "8px", marginBottom: "4px" }}
                  />
                </div>
                <div className="text-center text-blue-700 font-bold text-xl">
                  {feature.title}
                </div>
                <p className="text-gray-600 mt-2">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ marginTop: "20px" }}
      >
        <div className="bg-white py-16 text-center px-4">
          <h2 className="text-3xl font-bold text-blue-500 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Your go-to platform for AI-powered recruitment solutions in four
            easy steps.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              "Create your Account",
              "Set Interview Preferences",
              "Start Interview",
              "Get Results",
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white mb-4 text-lg font-bold">
                  {index + 1}
                </div>
                <span className="text-xl text-blue-500 font-semibold">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ marginTop: "20px" }}
      >
        <div className="bg-gray-50 py-16 text-center px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Our Alumni Work At
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Candidates from our platform have been hired by top companies.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 sm:gap-x-16 gap-y-8 max-w-4xl mx-auto">
            {[
              {
                name: "Amazon",
                logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
              },
              {
                name: "Google",
                logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
              },
              {
                name: "Microsoft",
                logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
              },
              {
                name: "Apple",
                logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
              },
            ].map((company) => (
              <img
                key={company.name}
                src={company.logo}
                alt={company.name}
                className="h-10 sm:h-12 object-contain grayscale hover:grayscale-0 transition duration-300"
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ marginTop: "20px" }}
      >
        <div className="bg-white py-16 text-center px-4">
          <h2 className="text-3xl font-bold text-blue-500 mb-4">
            Testimonials
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Hear what our users have to say about NeoRecruiter.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Amit Sharma",
                role: "HR Manager",
                text: "NeoRecruiter has transformed our hiring process. The AI analysis is fast and accurate, saving us countless hours.",
              },
              {
                name: "Priya Verma",
                role: "Candidate",
                text: "The live feedback and voice answers made the interview process so much more engaging and modern. A truly great experience!",
              },
              {
                name: "Rahul Gupta",
                role: "Tech Lead",
                text: "The quality of candidates we've found through NeoRecruiter is exceptional. The platform is intuitive and powerful.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="w-full md:w-1/3 bg-gray-50 rounded-xl shadow-lg p-8 flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-200 bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                  {testimonial.name.charAt(0)}
                </div>
                <p className="text-gray-600 italic mb-4 flex-grow">
                  "{testimonial.text}"
                </p>
                <div>
                  <h3 className="text-xl font-bold text-blue-900">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-blue-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} NeoRecruiter. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition"
                aria-label="Twitter"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition"
                aria-label="Facebook"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default NewHome;