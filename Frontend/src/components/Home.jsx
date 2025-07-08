import { useState, useEffect, useRef } from "react";
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaInstagram, FaLinkedin, FaTwitter, FaFacebook, FaArrowUp, FaRobot, FaUserTie, FaChartLine, FaLanguage, FaMicrophone, FaRegSmileBeam, FaShieldAlt,
  FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaFileAlt, FaLightbulb // New icons for added features
} from "react-icons/fa";

import "tailwindcss/tailwind.css"; // Ensure Tailwind CSS is imported
import { Link } from 'react-router-dom';

// Animated stats
function AnimatedNumber({ value, duration = 1800 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / (duration / 20));
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(start);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [value, duration]);
  return <span>{display.toLocaleString()}</span>;
}

const howWeWork = [
  {
    icon: <FaEnvelope className="text-3xl text-blue-700" />,
    title: "Bulk Personalized Invites",
    desc: "Send interview links with ATS/Sheets integration, reaching 100s of candidates in seconds.",
  },
  {
    icon: <FaUserTie className="text-3xl text-blue-900" />,
    title: "Candidate Joins Interview",
    desc: "Questions appear on screen, bot reads aloud, candidate answers by voice or typing.",
  },
  {
    icon: <FaChartLine className="text-3xl text-blue-700" />,
    title: "AI Deep Analysis",
    desc: "Every answer scored for sentiment, relevance, fluency, and key skills—instantly.",
  },
  {
    icon: <FaLanguage className="text-3xl text-blue-900" />,
    title: "Live Feedback & Multilingual",
    desc: "Real-time feedback in Hindi, English, and more—AI adapts to each candidate.",
  },
  {
    icon: <FaRegSmileBeam className="text-3xl text-blue-700" />,
    title: "Reports & Ranking",
    desc: "HR dashboard auto-generates ATS-ready reports and candidate rankings.",
  },
];

const newFeatures = [
  {
    icon: <FaMicrophone className="text-2xl text-blue-700" />,
    title: "Multimodal Interface",
    desc: "Questions shown and spoken, answer by voice or typing, supports technical/MCQ/case study.",
  },
  {
    icon: <FaRobot className="text-2xl text-blue-900" />,
    title: "AI-Driven Analysis",
    desc: "Deep analysis with Hugging Face/OpenAI, auto scoring, ranking, and feedback.",
  },
  {
    icon: <FaRegSmileBeam className="text-2xl text-blue-700" />,
    title: "Advanced Candidate Experience",
    desc: "Live feedback, multi-language, optional face/body language analysis.",
  },
  {
    icon: <FaUserTie className="text-2xl text-blue-900" />,
    title: "HR Dashboard",
    desc: "Reports, rankings, logs, custom questions, ATS/Sheets/Notion integration.",
  },
  {
    icon: <FaEnvelope className="text-2xl text-blue-700" />,
    title: "Bulk Campaigns",
    desc: "Bulk calling/email/WhatsApp invites, unique interview links for each candidate.",
  },
  {
    icon: <FaShieldAlt className="text-2xl text-blue-900" />,
    title: "Security & Privacy",
    desc: "Data encryption, GDPR compliance, candidate consent before recording.",
  },
  { // New Feature 1
    icon: <FaFileAlt className="text-2xl text-blue-700" />,
    title: "Resume Parsing & Matching",
    desc: "Automatically extract key information from resumes and match candidates to job requirements.",
  },
  { // New Feature 2
    icon: <FaCalendarAlt className="text-2xl text-blue-900" />,
    title: "Interview Scheduling Automation",
    desc: "Seamlessly schedule interviews directly from your dashboard, minimizing manual coordination.",
  },
  { // New Feature 3
    icon: <FaLightbulb className="text-2xl text-blue-700" />,
    title: "Advanced Analytics & Insights",
    desc: "Gain data-driven insights into your hiring pipeline, identify bottlenecks, and optimize strategies.",
  },
];

const testimonials = [
  {
    name: "Amit Sharma",
    role: "HR, TechCorp",
    text: "NeoRecruiter has transformed our hiring—AI scoring is fast, fair, and candidates love the experience.",
    img: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Priya Verma",
    role: "Candidate",
    text: "The live feedback and voice answers made the interview process so much more engaging and human.",
    img: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Sanjay Rao",
    role: "Recruiter, FinEdge",
    text: "Bulk invites and instant ranking saved us days of manual work. The dashboard is a game-changer.",
    img: "https://randomuser.me/api/portraits/men/65.jpg"
  },
  {
    name: "Dr. Anjali Singh",
    role: "Hiring Manager, HealthPlus",
    text: "The multilingual support meant we could assess a wider range of talent effectively. Truly impressed!",
    img: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    name: "Rajesh Kumar",
    role: "Software Engineer",
    text: "As a candidate, I appreciated the clarity of questions and immediate feedback. A very modern interview experience.",
    img: "https://randomuser.me/api/portraits/men/48.jpg"
  },
  {
    name: "Meera Devi",
    role: "Founder, GreenSol",
    text: "NeoRecruiter made our startup hiring process incredibly efficient. AI insights are spot-on!",
    img: "https://randomuser.me/api/portraits/women/72.jpg"
  }
];

const logos = [
  "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  "https://seeklogo.com/images/N/nodejs-logo-FBE122E377-seeklogo.com.png",
  "https://upload.wikimedia.org/wikipedia/commons/4/4b/MongoDB_Logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/4/4f/Logo-OpenAI.svg",
  "https://huggingface.co/front/assets/huggingface_logo-noborder.svg"
];

// Pricing Plans Data
const pricingPlans = [
  {
    name: "Basic",
    price: "$99",
    per: "/month",
    description: "Ideal for small teams and individual recruiters.",
    features: [
      { text: "100 AI Interviews/month", included: true },
      { text: "Multimodal Interface", included: true },
      { text: "Basic AI Analysis", included: true },
      { text: "Standard HR Dashboard", included: true },
      { text: "Email Invites", included: true },
      { text: "3 Languages Supported", included: true },
      { text: "Priority Support", included: false },
      { text: "Advanced ATS Integration", included: false },
      { text: "Custom Question Templates", included: false },
    ],
    buttonText: "Start Free Trial",
    buttonLink: "/signup", // Link to signup for basic
    buttonClass: "bg-blue-700 hover:bg-blue-800",
  },
  {
    name: "Pro",
    price: "$299",
    per: "/month",
    description: "Perfect for growing companies and mid-sized agencies.",
    features: [
      { text: "500 AI Interviews/month", included: true },
      { text: "Multimodal Interface", included: true },
      { text: "Deep AI Analysis", included: true },
      { text: "Advanced HR Dashboard", included: true },
      { text: "Email & WhatsApp Invites", included: true },
      { text: "10+ Languages Supported", included: true },
      { text: "Priority Support", included: true },
      { text: "Advanced ATS Integration", included: true },
      { text: "Custom Question Templates", included: true },
    ],
    buttonText: "Get Started",
    buttonLink: "/signup", // Link to signup for pro
    buttonClass: "bg-blue-900 hover:bg-blue-700", // Darker for emphasis
    highlight: true, // For a "most popular" tag
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "",
    description: "Tailored for large corporations with high volume hiring needs.",
    features: [
      { text: "Unlimited AI Interviews", included: true },
      { text: "Multimodal Interface", included: true },
      { text: "Advanced AI & Custom Models", included: true },
      { text: "Enterprise HR Dashboard", included: true },
      { text: "All Campaign Options", included: true },
      { text: "Full Multilingual Support", included: true },
      { text: "Dedicated Account Manager", included: true },
      { text: "Full ATS/CRM Integration", included: true },
      { text: "On-demand Training & Support", included: true },
    ],
    buttonText: "Contact Us",
    buttonLink: "#contact", // Scroll to contact section or open contact modal
    buttonClass: "bg-blue-700 hover:bg-blue-800",
  },
];


export default function Home() {
  const [input, setInput] = useState("");
  const [newsletter, setNewsletter] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const [demoJobDescription, setDemoJobDescription] = useState(""); // State for demo modal textarea
  const [generatedQuestions, setGeneratedQuestions] = useState([]); // State for generated questions
  const [isGenerating, setIsGenerating] = useState(false); // Loading state for demo generator

  const [showBookDemo, setShowBookDemo] = useState(false); // State for Book a Demo modal
  const [bookDemoForm, setBookDemoForm] = useState({ name: '', email: '', message: '' });
  const [bookDemoMsg, setBookDemoMsg] = useState("");

  const [showTop, setShowTop] = useState(false);

  const howItWorksRef = useRef(null);
  const [howItWorksVisible, setHowItWorksVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection Observer for "How It Works" animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHowItWorksVisible(true);
            observer.unobserve(entry.target); // Stop observing once visible
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
      }
    );

    if (howItWorksRef.current) {
      observer.observe(howItWorksRef.current);
    }

    return () => {
      if (howItWorksRef.current) {
        observer.unobserve(howItWorksRef.current);
      }
    };
  }, []);


  function handleNewsletter(e) {
    e.preventDefault();
    setNewsletterMsg("Subscribed! Thank you.");
    setNewsletter("");
    setTimeout(() => setNewsletterMsg(""), 3000);
  }

  const generateQuestions = async () => {
    setIsGenerating(true);
    setGeneratedQuestions([]); // Clear previous questions
    setDemoJobDescription("Generating questions based on your description..."); // Show loading message

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Replace with actual API call to your AI model
    // For demo, we'll just set some sample questions
    const sample = [
      "Describe your experience with scalable cloud infrastructure and DevOps practices.",
      "How do you approach securing sensitive data in a web application?",
      "Can you give an example of a time you used AI/ML to solve a complex problem?",
      "What are your strengths in project management and team collaboration?",
    ];
    setGeneratedQuestions(sample);
    setDemoJobDescription("Generated questions:"); // Reset input area message
    setIsGenerating(false);
  };

  const handleBookDemoSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send this data to your backend
    console.log("Book Demo Form Submitted:", bookDemoForm);
    setBookDemoMsg("Thank you! We've received your request and will contact you shortly.");
    setBookDemoForm({ name: '', email: '', message: '' }); // Clear form
    await new Promise(resolve => setTimeout(resolve, 3000));
    setShowBookDemo(false);
    setBookDemoMsg(""); // Clear message after modal closes
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-4 border-b bg-white/80 backdrop-blur-sm shadow-md z-10 sticky top-0">
        <div className="text-2xl font-black tracking-tight select-none flex items-center space-x-1">
          <span className="text-white bg-gradient-to-r from-blue-700 to-blue-900 px-2 py-1 rounded-l-xl shadow-md animate-fade-in">
            Neo
          </span>
          <span className="text-blue-700 bg-white px-2 py-1 rounded-r-xl shadow-md animate-fade-in">
            Recruiter
          </span>
        </div>
        <nav className="flex gap-3">
          <Link to="/login" className="px-4 py-2 rounded-lg hover:bg-blue-100 font-semibold text-blue-700 transition duration-300">Login</Link>
          <Link to="/signup" className="px-4 py-2 rounded-lg hover:bg-blue-100 font-semibold text-blue-700 transition duration-300">Signup</Link>
          <Link to="/docs" className="px-4 py-2 rounded-lg hover:bg-blue-100 font-semibold text-blue-700 transition duration-300">Docs</Link>
          <button className="px-4 py-2 rounded-lg bg-blue-900 text-white font-semibold shadow-lg hover:bg-blue-700 transition duration-300" onClick={() => setShowDemo(true)}>
            Try AI Question Generator
          </button>
        </nav>
      </header>

      {/* Signup Bonus Banner */}
      <div className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 px-6 text-center animate-pulse">
        <div className="flex items-center justify-center gap-3 text-lg font-bold">
          <span className="text-2xl">🎉</span>
          <span>Get ₹1000 FREE Credits on Signup!</span>
          <span className="text-2xl">🚀</span>
          <Link to="/signup" className="ml-4 bg-white text-blue-600 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition duration-300">
            Claim Now
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <main className="flex flex-col flex-1 items-center justify-center px-4">
        <div className="mt-16 mb-10 text-center animate-fade-in-up max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 select-none drop-shadow-lg">
            <span className="text-white bg-gradient-to-r from-blue-700 to-blue-900 px-3 py-1 rounded-l-xl shadow-lg">
              Neo
            </span>
            <span className="text-blue-700 bg-white px-3 py-1 rounded-r-xl shadow-lg">
              Recruiter
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 font-medium mb-2">
            <span className="text-blue-700 font-bold">Next-Gen Multimodal AI Interview Bot</span> for Recruitment
          </p>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            Screen + Voice | Deep AI Analysis | HR Dashboard | Bulk Campaigns | Multi-Language Support
          </p>
        </div>

        {/* CTA Form - Enlarged input */}
        <form
          className="relative w-full max-w-3xl mt-6 animate-fade-in"
          onSubmit={e => {
            e.preventDefault();
            setDemoJobDescription(input); // Set input to demo modal's textarea
            setShowDemo(true);
            generateQuestions(); // Trigger generation when form is submitted
          }}
        >
          <textarea
            className="w-full py-6 px-6 rounded-xl border-2 border-blue-700/30 focus:border-blue-700 outline-none text-lg shadow-lg bg-white transition duration-300 resize-none overflow-hidden h-32" // Increased height
            placeholder="Describe your ideal candidate, skills, or job role to generate AI interview questions (e.g., 'Senior React Developer with Node.js experience, familiar with AI APIs')..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-4 bottom-4 p-3 bg-blue-700 hover:bg-blue-900 rounded-full text-white shadow-lg transition-transform duration-300 hover:scale-110"
            aria-label="Generate Questions"
          >
            <FaRobot className="h-6 w-6" />
          </button>
        </form>
        <div className="mt-3 text-sm text-blue-900 font-semibold cursor-pointer underline hover:text-blue-700 transition duration-300" onClick={() => setShowDemo(true)}>
          Or try a quick demo of the AI Question Generator
        </div>

        {/* Animated Stats */}
        <section className="w-full max-w-5xl mt-20 mb-10 px-2 animate-fade-in-up">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center w-56 transform hover:scale-105 transition duration-300">
              <div className="text-4xl font-extrabold text-blue-700 mb-2"><AnimatedNumber value={25000} />+</div>
              <div className="font-semibold text-blue-900 mb-1 text-center">Candidates Interviewed</div>
            </div>
            <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center w-56 transform hover:scale-105 transition duration-300">
              <div className="text-4xl font-extrabold text-blue-900 mb-2"><AnimatedNumber value={120} />+</div>
              <div className="font-semibold text-blue-700 mb-1 text-center">Companies Using</div>
            </div>
            <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center w-56 transform hover:scale-105 transition duration-300">
              <div className="text-4xl font-extrabold text-blue-700 mb-2"><AnimatedNumber value={10} /></div>
              <div className="font-semibold text-blue-900 mb-1 text-center">Languages Supported</div>
            </div>
            <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center w-56 transform hover:scale-105 transition duration-300">
              <div className="text-4xl font-extrabold text-blue-900 mb-2"><AnimatedNumber value={99} />%</div>
              <div className="font-semibold text-blue-700 mb-1 text-center">Positive Feedback</div>
            </div>
          </div>
        </section>

        ---

        {/* Demo Video & Project Description - Refined content */}
        <section className="w-full max-w-6xl mx-auto my-16 px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Left: Project Description */}
            <div className="md:w-1/2 text-left animate-fade-in-up">
              <h2 className="text-3xl font-bold text-blue-700 mb-6">
                Revolutionize Your Hiring with AI Interviews
              </h2>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              </p>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              </p>
              <h3 className="text-xl font-semibold text-blue-900 mt-6 mb-3">Why AI Interviews are the Future:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
                <li>
                  <span className="font-medium text-blue-700">Efficiency:</span> Automate screening, saving countless hours for your HR team.
                </li>
                <li>
                  <span className="font-medium text-blue-700">Objectivity:</span> Reduce human bias with consistent, AI-driven evaluations.
                </li>
                <li>
                  <span className="font-medium text-blue-700">Scalability:</span> Handle large volumes of applicants without compromising quality.
                </li>
                <li>
                  <span className="font-medium text-blue-700">Candidate Experience:</span> Offer flexible, engaging, and personalized interview interactions.
                </li>
              </ul>
            </div>
            {/* Right: Demo Video */}
            <div className="md:w-1/2 flex justify-center items-center animate-fade-in">
              <div className="relative w-full pb-[56.25%] h-0 rounded-xl overflow-hidden shadow-2xl border-4 border-blue-200">
                {/* Replace YOUR_VIDEO_ID with your actual YouTube video ID */}
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Example: Replace with your actual video ID
                  title="NeoRecruiter Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        ---

        {/* How We Work - Step-wise animation */}
        <section ref={howItWorksRef} className="w-full max-w-5xl mt-8 mb-10 px-2">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-8 text-center animate-fade-in-up">
            How It Works
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            {howWeWork.map((step, idx) => (
              <div
                key={step.title}
                className={`bg-white rounded-xl shadow-md p-6 flex flex-col items-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl group ${
                  howItWorksVisible ? 'how-it-works-animate' : ''
                }`}
                style={{ animationDelay: howItWorksVisible ? `${idx * 0.15}s` : '0s' }}
              >
                <div className="mb-2 transform group-hover:scale-110 transition duration-300">{step.icon}</div>
                <div className="font-semibold text-blue-900 mb-1 text-center">{step.title}</div>
                <div className="text-gray-600 text-sm text-center">{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        ---

        {/* Key Features Section - Enhanced Design */}
        <section className="w-full max-w-6xl my-12 px-2 py-8 bg-blue-50 rounded-2xl shadow-inner border border-blue-200 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-10 text-center">
            Unlock the Power of NeoRecruiter
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {newFeatures.map((feature, idx) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center text-center transform hover:scale-105 transition duration-300 border-t-4 border-blue-700" // Added top border
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="mb-4 text-5xl transform group-hover:scale-110 transition duration-300">{feature.icon}</div> {/* Increased icon size */}
                <h3 className="font-bold text-blue-900 text-xl mb-3">{feature.title}</h3> {/* Increased title size */}
                <p className="text-gray-700 text-base leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        ---

        {/* Pricing Plans Section */}
        <section className="w-full max-w-6xl mx-auto my-16 px-4 py-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-12 text-center">
            Flexible Pricing for Every Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan, idx) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl shadow-2xl p-8 flex flex-col border-4 ${
                  plan.highlight ? "border-blue-700 scale-105" : "border-blue-100"
                } transform hover:scale-105 transition-all duration-300 relative`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-700 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-3xl font-bold text-blue-900 mb-2 text-center">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-center mb-6">{plan.description}</p>
                <div className="text-center mb-8">
                  <span className="text-5xl font-extrabold text-blue-700">
                    {plan.price}
                  </span>
                  {plan.per && (
                    <span className="text-xl font-medium text-gray-500">
                      {plan.per}
                    </span>
                  )}
                </div>
                <ul className="flex-grow space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center text-gray-800">
                      {feature.included ? (
                        <FaCheckCircle className="text-green-500 mr-3 text-xl" />
                      ) : (
                        <FaTimesCircle className="text-gray-400 mr-3 text-xl" />
                      )}
                      <span className={`${!feature.included ? "line-through text-gray-500" : ""}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                {plan.buttonLink.startsWith('/') ? (
                  <Link
                    to={plan.buttonLink}
                    className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transition duration-300 text-center ${plan.buttonClass}`}
                  >
                    {plan.buttonText}
                  </Link>
                ) : (
                  <button
                    onClick={() => { if (plan.buttonLink === '#contact') setShowBookDemo(true); }} // Open book demo modal for Enterprise
                    className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transition duration-300 ${plan.buttonClass}`}
                  >
                    {plan.buttonText}
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-10">
            Need a custom solution or have more questions? <a href="#" onClick={() => setShowBookDemo(true)} className="text-blue-700 font-semibold hover:underline">Contact our sales team</a>.
          </p>
        </section>

        ---

        {/* Testimonials Carousel - with Horizontal Scrolling */}
        <section className="w-full my-12 px-2">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-8 text-center">What Our Users Say</h2>
          <div className="overflow-x-auto whitespace-nowrap py-4 scrollbar-hide">
            <div className="inline-flex space-x-8 px-4 animate-scroll-left">
              {testimonials.map((t, i) => (
                <div key={t.name} className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-blue-500 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
                  <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full mb-4 border-3 border-blue-700 ring-4 ring-blue-100 object-cover shadow-md" />
                  <div className="font-bold text-blue-900 text-lg">{t.name}</div>
                  <div className="text-sm text-blue-700 mb-3">{t.role}</div>
                  <div className="text-gray-700 italic text-base">"{t.text}"</div>
                </div>
              ))}
              {/* Duplicate testimonials for continuous scroll effect */}
              {testimonials.map((t, i) => (
                <div key={`${t.name}-duplicate-${i}`} className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-blue-500 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1" aria-hidden="true">
                  <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full mb-4 border-3 border-blue-700 ring-4 ring-blue-100 object-cover shadow-md" />
                  <div className="font-bold text-blue-900 text-lg">{t.name}</div>
                  <div className="text-sm text-blue-700 mb-3">{t.role}</div>
                  <div className="text-gray-700 italic text-base">"{t.text}"</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        ---

        {/* Social Proof / Logos */}
        <div className="flex flex-wrap justify-center gap-8 mt-10 mb-10">
          {logos.map((logo, i) => (
            <img key={i} src={logo} alt="logo" className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100" />
          ))}
        </div>

        ---

        {/* Newsletter Signup */}
        <section className="w-full max-w-2xl mx-auto my-14 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-6 border border-blue-200">
            <div className="flex-1 text-left">
              <div className="text-blue-700 font-bold text-lg mb-1">Subscribe to our Newsletter</div>
              <div className="text-gray-600 text-sm">Get updates on AI hiring trends, new features, and more.</div>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={handleNewsletter}>
              <input
                type="email"
                required
                placeholder="Your email"
                className="px-4 py-2 rounded-l-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white text-gray-800 w-full md:w-56"
                value={newsletter}
                onChange={e => setNewsletter(e.target.value)}
              />
              <button
                type="submit"
                className="px-5 py-2 font-bold rounded-r-lg bg-blue-700 text-white hover:bg-blue-900 transition duration-300 shadow-md"
              >
                Subscribe
              </button>
            </form>
            {newsletterMsg && <div className="text-blue-700 font-semibold ml-2">{newsletterMsg}</div>}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 text-gray-800 pt-20 mt-20 text-base rounded-t-3xl shadow-2xl border-t border-blue-200 overflow-hidden">
        <div className="flex flex-wrap justify-between max-w-[1200px] mx-auto px-6 gap-6 pt-16">
          <div className="flex-1 min-w-[180px] mb-6 bg-white/80 rounded-xl shadow-lg p-6 border border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition duration-300">
            <h4 className="text-blue-700 mb-2 text-base font-bold tracking-wide">Quick Links</h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-2 hover:text-blue-900 cursor-pointer transition duration-300"><Link to="/">Home</Link></li>
              <li className="mb-2 hover:text-blue-900 cursor-pointer transition duration-300"><a href="#features">Features</a></li>
              <li className="mb-2 hover:text-blue-900 cursor-pointer transition duration-300"><a href="#pricing">Pricing</a></li>
              <li className="mb-2 hover:text-blue-900 cursor-pointer transition duration-300"><Link to="/docs">Docs</Link></li>
              <li className="mb-2 hover:text-blue-900 cursor-pointer transition duration-300"><a href="#about">About</a></li>
            </ul>
          </div>
          <div className="flex-1 min-w-[180px] mb-6 bg-white/80 rounded-xl shadow-lg p-6 border border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition duration-300">
            <h4 className="text-blue-700 mb-2 text-base font-bold tracking-wide">Legal</h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-2 hover:text-blue-900 cursor-pointer transition duration-300"><Link to="/terms">Terms & Conditions</Link></li>
              <li className="mb-2 hover:text-blue-900 cursor-pointer transition duration-300"><Link to="/privacy">Privacy Policy</Link></li>
              <li className="mb-2 hover:text-blue-900 cursor-pointer transition duration-300"><Link to="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>
          <div className="flex-1 min-w-[180px] mb-6 bg-white/80 rounded-xl shadow-lg p-6 border border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition duration-300">
            <h4 className="text-blue-700 mb-2 text-base font-bold tracking-wide">Contact</h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-2 flex items-center gap-2 text-blue-900"><FaEnvelope /> <span className="text-gray-800">support@neorecruiter.ai</span></li>
              <li className="mb-2 flex items-center gap-2 text-blue-900"><FaPhone /> <span className="text-gray-800">+91-9000000000</span></li>
              <li className="mb-2 flex items-center gap-2 text-blue-900"><FaMapMarkerAlt /> <span className="text-gray-800">Remote, India</span></li>
              <li className="mb-2 flex items-center gap-2 text-blue-900"><FaGlobe /> <span className="text-gray-800">www.neorecruiter.ai</span></li>
            </ul>
          </div>
          <div className="flex-1 min-w-[180px] mb-6 bg-white/80 rounded-xl shadow-lg p-6 border border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition duration-300">
            <h4 className="text-blue-700 mb-2 text-base font-bold tracking-wide">Follow Us</h4>
            <ul className="list-none p-0 m-0 flex gap-4 mt-2">
              <li>
                <a href="#" className="text-blue-900 hover:text-blue-700 text-2xl transition duration-300" aria-label="Instagram"><FaInstagram /></a>
              </li>
              <li>
                <a href="#" className="text-blue-900 hover:text-blue-700 text-2xl transition duration-300" aria-label="LinkedIn"><FaLinkedin /></a>
              </li>
              <li>
                <a href="#" className="text-blue-900 hover:text-blue-700 text-2xl transition duration-300" aria-label="Twitter"><FaTwitter /></a>
              </li>
              <li>
                <a href="#" className="text-blue-900 hover:text-blue-700 text-2xl transition duration-300" aria-label="Facebook"><FaFacebook /></a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-200 max-w-[1200px] mx-auto px-6 pt-6 pb-3 text-sm">
          <h3 className="text-lg font-semibold mb-2 text-blue-700">About NeoRecruiter</h3>
          <p className="mb-2">
            NeoRecruiter is a next-gen AI-powered recruitment platform. Automate candidate screening, voice interviews, and instant ranking—empowering recruiters and candidates with the power of AI.
          </p>
          <div className="mt-4">
            <strong>Mission</strong>
            <p>
              To make hiring faster, smarter, and bias-free using the latest in conversational AI and analytics.
            </p>
          </div>
          <div className="mt-4 text-gray-600 text-center text-xs">
            © {new Date().getFullYear()} NeoRecruiter. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating Book a Demo Button */}
      <button
        className="fixed bottom-24 right-6 z-50 px-6 py-3 bg-blue-900 text-white font-bold rounded-full shadow-xl hover:bg-blue-700 transition duration-300 flex items-center gap-2 transform hover:scale-105"
        onClick={() => setShowBookDemo(true)}
      >
        <FaUserTie className="text-xl" /> Book a Demo
      </button>

      {/* Back to Top Button */}
      {showTop && (
        <button
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-700 text-white rounded-full shadow-xl hover:bg-blue-900 transition duration-300 transform hover:scale-110"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to Top"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}

      {/* AI Question Generator Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fade-in border border-blue-200">
            <button className="absolute top-3 right-3 text-2xl text-blue-700 hover:text-blue-900 transition duration-300" onClick={() => setShowDemo(false)}>×</button>
            <h3 className="text-xl font-bold mb-3 text-blue-900">AI Question Generator Demo</h3>
            <p className="mb-4 text-gray-600">Paste a job description below and see sample AI-generated interview questions:</p>
            <textarea
              className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700 bg-blue-50 text-gray-800"
              rows={4}
              placeholder="e.g., 'Seeking a Senior Frontend Developer with expertise in React, Redux, and modern JavaScript frameworks. Must have experience with RESTful APIs and UI/UX best practices.'"
              value={demoJobDescription}
              onChange={(e) => setDemoJobDescription(e.target.value)}
            />
            <button
              className={`px-5 py-2 font-bold rounded-lg ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-900'} transition duration-300 w-full mb-3 shadow-md`}
              onClick={generateQuestions}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Questions'}
            </button>
            {generatedQuestions.length > 0 && (
              <div className="bg-blue-100 p-4 rounded-lg text-sm text-blue-900 border border-blue-200 animate-fade-in mt-4">
                <b>Generated Questions:</b>
                <ul className="list-disc ml-5 mt-2">
                  {generatedQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
            {generatedQuestions.length === 0 && !isGenerating && (
                 <div className="bg-blue-100 p-4 rounded-lg text-sm text-blue-900 border border-blue-200">
                 <b>Sample Questions will appear here:</b>
                 <ul className="list-disc ml-5 mt-2">
                   <li>Describe your experience with React.js and scalable frontend apps.</li>
                   <li>How would you handle a high-traffic Node.js backend?</li>
                   <li>Give an example of using AI APIs for text analysis.</li>
                 </ul>
               </div>
            )}
          </div>
        </div>
      )}

      {/* Book a Demo Modal */}
      {showBookDemo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in border border-blue-200">
            <button className="absolute top-3 right-3 text-2xl text-blue-700 hover:text-blue-900 transition duration-300" onClick={() => setShowBookDemo(false)}>×</button>
            <h3 className="text-xl font-bold mb-3 text-blue-900">Book a Demo</h3>
            <p className="mb-4 text-gray-600">Fill out the form below and we'll get in touch to schedule your personalized demo.</p>
            <form onSubmit={handleBookDemoSubmit} className="space-y-4">
              <div>
                <label htmlFor="demoName" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="demoName"
                  className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-700 bg-blue-50 text-gray-800"
                  value={bookDemoForm.name}
                  onChange={(e) => setBookDemoForm({ ...bookDemoForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="demoEmail" className="block text-sm font-medium text-gray-700">Work Email</label>
                <input
                  type="email"
                  id="demoEmail"
                  className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-700 bg-blue-50 text-gray-800"
                  value={bookDemoForm.email}
                  onChange={(e) => setBookDemoForm({ ...bookDemoForm, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="demoMessage" className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                <textarea
                  id="demoMessage"
                  rows={3}
                  className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-700 bg-blue-50 text-gray-800"
                  value={bookDemoForm.message}
                  onChange={(e) => setBookDemoForm({ ...bookDemoForm, message: e.target.value })}
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-5 py-2 font-bold rounded-lg bg-blue-700 text-white hover:bg-blue-900 transition duration-300 w-full shadow-md"
              >
                Submit Request
              </button>
              {bookDemoMsg && <p className="text-center text-green-600 mt-3">{bookDemoMsg}</p>}
            </form>
          </div>
        </div>
      )}


      {/* Animations */}
      <style>
        {`
        .animate-fade-in {
          animation: fadeIn 1.1s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1.1s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity:0 }
          to { opacity:1 }
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(40px);}
          to { opacity:1; transform:translateY(0);}
        }

        /* Step-wise animation for howWeWork section */
        .how-it-works-animate {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUpDelayed 1s ease-out forwards;
        }
        @keyframes fadeInUpDelayed {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Testimonials horizontal scroll animation */
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } /* Scrolls 50% of content, then loops */
        }
        .animate-scroll-left {
          animation: scrollLeft 60s linear infinite; /* Adjust duration for speed */
          display: flex; /* Ensures items are in a row */
          flex-wrap: nowrap; /* Prevents wrapping */
        }
        /* Hide scrollbar */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera*/
        }
        `}
      </style>
    </div>
  );
}