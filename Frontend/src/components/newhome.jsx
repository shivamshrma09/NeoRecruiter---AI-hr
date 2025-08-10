import React from "react";
import "tailwindcss/tailwind.css";
import { FaRobot, FaGlobe, FaPencilAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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



      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -50, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
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
      </motion.div>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -50, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
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
                name: "Physics Wallah",
                logo: "data:image/png;base64,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",
              },
              {
                name: "Unacademy",
                logo: "data:image/jpeg;base64,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",
              },
              {
                name: "Zomato",
                logo: "data:image/png;base64,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",
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
      </motion.div>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -50, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
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
                img: "data:image/jpeg;base64,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",
              },
              {
                name: "Priya Verma",
                role: "Candidate",
                text: "The live feedback and voice answers made the interview process so much more engaging and modern. A truly great experience!",
                img: "data:image/jpeg;base64,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",
              },
              {
                name: "Rahul Gupta",
                role: "Tech Lead",
                text: "The quality of candidates we've found through NeoRecruiter is exceptional. The platform is intuitive and powerful.",
                img: "data:image/jpeg;base64,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",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="w-full md:w-1/3 bg-gray-50 rounded-xl shadow-lg p-8 flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300"
              >
                <img
                  src={testimonial.img}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-200"
                />
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
      </motion.div>

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
