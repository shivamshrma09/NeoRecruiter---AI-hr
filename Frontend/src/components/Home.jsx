import { useState, useEffect, useRef } from "react";
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaInstagram, FaLinkedin, FaTwitter, FaFacebook, FaArrowUp, FaRobot, FaUserTie, FaChartLine, FaLanguage, FaMicrophone, FaRegSmileBeam, FaShieldAlt,
  FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaFileAlt, FaLightbulb // New icons for added features
} from "react-icons/fa";

import "tailwindcss/tailwind.css"; 
import { Link } from 'react-router-dom';
import SEO from './SEO';

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
  { 
    icon: <FaFileAlt className="text-2xl text-blue-700" />,
    title: "Resume Parsing & Matching",
    desc: "Automatically extract key information from resumes and match candidates to job requirements.",
  },
  { 
    icon: <FaCalendarAlt className="text-2xl text-blue-900" />,
    title: "Interview Scheduling Automation",
    desc: "Seamlessly schedule interviews directly from your dashboard, minimizing manual coordination.",
  },
  { 
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
    buttonLink: "/signup", 
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
    buttonLink: "/signup", 
    buttonClass: "bg-blue-900 hover:bg-blue-700", 
    highlight: true, 
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
    buttonLink: "#contact", 
    buttonClass: "bg-blue-700 hover:bg-blue-800",
  },
];


export default function Home() {
  const [input, setInput] = useState("");
  const [newsletter, setNewsletter] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const [demoJobDescription, setDemoJobDescription] = useState(""); 
  const [generatedQuestions, setGeneratedQuestions] = useState([]); 
  const [isGenerating, setIsGenerating] = useState(false); 

  const [showBookDemo, setShowBookDemo] = useState(false); 
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHowItWorksVisible(true);
            observer.unobserve(entry.target); 
          }
        });
      },
      {
        threshold: 0.2, 
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
    setGeneratedQuestions([]);
    setDemoJobDescription("Generating questions based on your description..."); 

    await new Promise(resolve => setTimeout(resolve, 2000));

    
    const sample = [
      "Describe your experience with scalable cloud infrastructure and DevOps practices.",
      "How do you approach securing sensitive data in a web application?",
      "Can you give an example of a time you used AI/ML to solve a complex problem?",
      "What are your strengths in project management and team collaboration?",
    ];
    setGeneratedQuestions(sample);
    setDemoJobDescription("Generated questions:"); 
    setIsGenerating(false);
  };

  const handleBookDemoSubmit = async (e) => {
    e.preventDefault();
    console.log("Book Demo Form Submitted:", bookDemoForm);
    setBookDemoMsg("Thank you! We've received your request and will contact you shortly.");
    setBookDemoForm({ name: '', email: '', message: '' }); 
    await new Promise(resolve => setTimeout(resolve, 3000));
    setShowBookDemo(false);
    setBookDemoMsg(""); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50">
      <SEO 
        title="NeoRecruiter - AI-Powered Interview Platform | Smart Hiring Solution"
        description="Transform your hiring process with NeoRecruiter's AI-powered interview platform. Conduct smart interviews, get instant candidate analysis, and make data-driven hiring decisions. Try free with ₹1000 bonus!"
        keywords="AI interview, hiring platform, recruitment software, candidate screening, HR technology, interview automation, talent acquisition, smart hiring, AI recruiter, video interview, free trial"
        url="/"
      />
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
          <Link to="/student-interview" className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold shadow-lg hover:bg-green-700 transition duration-300">Student Interview</Link>
         
        </nav>
      </header>

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

        <form
          className="relative w-full max-w-3xl mt-6 animate-fade-in"
          onSubmit={e => {
            e.preventDefault();
            setDemoJobDescription(input); 
            setShowDemo(true);
            generateQuestions(); 
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

        <section className="w-full max-w-6xl mx-auto my-16 px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
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
            <div className="md:w-1/2 flex justify-center items-center animate-fade-in">
              <div className="relative w-full pb-[56.25%] h-0 rounded-xl overflow-hidden shadow-2xl border-4 border-blue-200">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://youtube.com/shorts/uEn8TWCBA9s?feature=shared" 
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

        <section className="w-full max-w-6xl my-12 px-2 py-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-inner border border-blue-200 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-10 text-center">
            Unlock the Power of NeoRecruiter
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {newFeatures.slice(0, 6).map((feature, idx) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition duration-300 border-t-4 border-blue-700"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="mb-4 text-4xl text-blue-700">{feature.icon}</div>
                <h3 className="font-bold text-blue-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/signup" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105">
              Get Started Now
            </Link>
          </div>
        </section>

        {/* Testimonials - Simplified */}
        <section className="w-full max-w-6xl mx-auto my-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-8 text-center">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Only show 3 testimonials */}
            {testimonials.slice(0, 3).map((t, i) => (
              <div key={t.name} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition duration-300">
                <img src={t.img} alt={t.name} className="w-16 h-16 rounded-full mb-3 border-2 border-blue-700 object-cover" />
                <div className="font-bold text-blue-900 text-lg">{t.name}</div>
                <div className="text-sm text-blue-700 mb-2">{t.role}</div>
                <div className="text-gray-700 italic text-sm">"{t.text}"</div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Partners - Simplified */}
        <section className="w-full max-w-4xl mx-auto my-12 px-4">
          <h2 className="text-xl font-bold text-gray-600 mb-6 text-center">Powered By</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {logos.map((logo, i) => (
              <img key={i} src={logo} alt="Technology Partner" className="h-10 w-auto grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100" />
            ))}
          </div>
        </section>

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

      {/* Footer - Simplified */}
      <footer className="bg-white border-t border-gray-200 py-10 mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-blue-700 font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-600 hover:text-blue-700">Home</Link></li>
                <li><Link to="/student-interview" className="text-gray-600 hover:text-blue-700">Student Interview</Link></li>
                <li><Link to="/login" className="text-gray-600 hover:text-blue-700">Login</Link></li>
                <li><Link to="/signup" className="text-gray-600 hover:text-blue-700">Sign Up</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-blue-700 font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-600 hover:text-blue-700">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="text-gray-600 hover:text-blue-700">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-blue-700 font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center"><FaEnvelope className="text-blue-700 mr-2" /> <span className="text-gray-600">support@neorecruiter.ai</span></li>
                <li className="flex items-center"><FaPhone className="text-blue-700 mr-2" /> <span className="text-gray-600">+91-9000000000</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-blue-700 font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-700 text-xl"><FaLinkedin /></a>
                <a href="#" className="text-gray-400 hover:text-blue-700 text-xl"><FaTwitter /></a>
                <a href="#" className="text-gray-400 hover:text-blue-700 text-xl"><FaFacebook /></a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-gray-600 mb-4">
              NeoRecruiter is a next-gen AI-powered recruitment platform that automates candidate screening, 
              voice interviews, and instant ranking—empowering recruiters and candidates with the power of AI.
            </p>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} NeoRecruiter. All rights reserved.
            </p>
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