import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  MessageSquare,
  IndianRupee,
  ShieldCheck,
  LayoutDashboard,
  ArrowRight,
  CheckCircle,
  Lightbulb, // Icon for AI assistant
  Send, // Icon for Send button
  Mail, // New Icons for Contact
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Link } from 'react-router'

// Feature Data Array for easy mapping
const coreFeatures = [
  {
    icon: Users,
    title: "Student & Staff Management",
    description: "Centralized profiles for all students, teachers, and administrative staff. Effortlessly track demographics, contact information, and roles.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: BookOpen,
    title: "Academic Gradebook",
    description: "Modern digital gradebook for seamless assignment tracking, test scoring, and result analysis. Facilitates quick report card generation.",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: IndianRupee,
    title: "Fee & Finance Tracking",
    description: "Manage fee structures, track outstanding balances, and generate detailed revenue reports in real-time. Integrate payments easily.",
    color: "text-yellow-600 bg-yellow-50",
  },
  {
    icon: MessageSquare,
    title: "Integrated Communication",
    description: "Direct messaging channels for parents, teachers, and administration. Send school-wide announcements, alerts, and calendar updates instantly.",
    color: "text-indigo-600 bg-indigo-50",
  },
];

// SVG Component for the School Icon
const SchoolSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full text-blue-600"
  >
    <path d="M10 20v-6h4v6" />
    <path d="M12 2l8 5V20H4V7z" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
    <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);


const HomePage = () => {
  // --- LLM Feature State ---
  const [featureQuery, setFeatureQuery] = useState('');
  const [featureResponse, setFeatureResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Utility Functions for Gemini API (Exponential Backoff) ---

  const retryFetch = async (url, options, maxRetries = 5) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.status === 429 && i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
          // Wait for the calculated delay before retrying
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`API call failed with status ${response.status}: ${errorBody}`);
        }
        return response;
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error;
        }
      }
    }
  };

  // --- GEMINI API CALL HANDLER (AI Feature Explainer) ---

  const handleFeatureQuery = async (e) => {
    e.preventDefault();
    if (!featureQuery.trim()) return;

    setIsLoading(true);
    setFeatureResponse(null);

    // Removed Firebase dependencies (auth token)
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    // Construct the prompt with context from the core features array
    const featuresContext = coreFeatures.map(f => `${f.title}: ${f.description}`).join('\n');

    const systemPrompt = `You are a concise, helpful marketing assistant for a School Management System named "School Hub." Your goal is to answer a user's question about the system's features based on the provided context.
        
        Contextual Features:
        ${featuresContext}
        
        If the feature is not explicitly mentioned, provide a helpful but generalized answer consistent with a modern school management system. Keep the response to 2-3 sentences.`;

    const userQuery = featureQuery;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
    };

    try {
      const response = await retryFetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that query. Please try again.";

      setFeatureResponse({ text, success: true });

    } catch (error) {
      console.error("Gemini API call failed:", error);
      setFeatureResponse({ text: "An error occurred while connecting to the AI assistant.", success: false });
    } finally {
      setIsLoading(false);
      setFeatureQuery('');
    }
  };

  // --- RENDER BLOCK ---

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header / Hero Section */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            <Link to="/" className="text-2xl font-extrabold text-gray-900 tracking-tight">
              School Hub
            </Link>
          </div>
          <nav className="hidden md:flex space-x-6 text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition duration-150">Features</a>
            <a href="#demo" className="hover:text-blue-600 transition duration-150">AI Assistant</a>
            <a href="#contact" className="hover:text-blue-600 transition duration-150">Contact</a>
          </nav>
          <div className='grid grid-cols-2 space-x-2'>
            <Link to={"/login"} className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-200">
              Login
            </Link>
            <Link to={"/signup"} className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-200">
              Signup
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-16 pb-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-blue-200 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                The Future of Education
              </span>
              <h2 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                Unified Management for Modern Schools
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                School Hub simplifies administrative complexity, enhances communication, and drives educational outcomes through one intuitive platform.
              </p>
              <div className="flex space-x-4">
                <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105">
                  Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button className="text-lg font-semibold py-3 px-6 rounded-xl text-blue-600 hover:text-blue-800 transition duration-300">
                  See Features
                </button>
              </div>
            </div>

            {/* Image/Mockup placeholder section - Now with the School SVG */}
            <div className="p-8 bg-white rounded-3xl shadow-2xl shadow-blue-200 flex justify-center items-center h-96 w-full">
              <div className="w-48 h-48">
                <SchoolSVG />
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-extrabold text-gray-900 mb-4">
                Everything You Need in One Place
              </h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From admissions to graduation, School Hub provides specialized tools for every task.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreFeatures.map((feature) => (
                <div key={feature.title} className="p-6 bg-gray-50 rounded-2xl shadow-lg transition duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <feature.icon className={`w-8 h-8 p-1.5 rounded-full mb-4 ${feature.color}`} />
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Assistant Section (Demo) */}
        <section id="demo" className="py-20 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-extrabold text-gray-900 mb-4">
                Ask Our AI Product Assistant
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See School Hub's intelligent features in action. Ask a question about our system (e.g., "How do I communicate with parents?" or "Does it track fees?")
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-2xl border border-blue-200">
              {/* Assistant Output */}
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg min-h-24 flex flex-col justify-center">
                {isLoading ? (
                  <div className="flex items-center space-x-3 text-blue-600">
                    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>AI Assistant is thinking...</span>
                  </div>
                ) : featureResponse ? (
                  <div className={`flex items-start space-x-3 ${featureResponse.success ? 'text-gray-800' : 'text-red-600'}`}>
                    <Lightbulb className="w-5 h-5 flex-shrink-0 mt-1 text-yellow-500" />
                    <p className="font-medium">{featureResponse.text}</p>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">
                    Ask me anything about School Hub's features!
                  </div>
                )}
              </div>

              {/* User Input */}
              <form onSubmit={handleFeatureQuery} className="flex space-x-3">
                <input
                  type="text"
                  value={featureQuery}
                  onChange={(e) => setFeatureQuery(e.target.value)}
                  placeholder={"Type your question here..."}
                  className="flex-grow p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm disabled:bg-gray-100"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-md transition duration-200 disabled:bg-blue-300"
                  disabled={isLoading}
                  aria-label="Send Query"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-extrabold text-gray-900 mb-4">
                Why Choose School Hub?
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform is designed to transform daily operations and foster a connected educational ecosystem.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6 rounded-2xl shadow-xl border border-gray-100">
                <ShieldCheck className="w-10 h-10 text-pink-500 mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Maximum Security</h4>
                <p className="text-gray-600">Ensure data privacy with industry-leading encryption and secure access controls for all users.</p>
              </div>
              <div className="p-6 rounded-2xl shadow-xl border border-gray-100">
                <CheckCircle className="w-10 h-10 text-teal-500 mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Simplicity & Adoption</h4>
                <p className="text-gray-600">An intuitive interface ensures quick staff and parent adoption, minimizing training time.</p>
              </div>
              <div className="p-6 rounded-2xl shadow-xl border border-gray-100">
                <IndianRupee className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Cost-Effective</h4>
                <p className="text-gray-600">A single platform replaces multiple tools, offering superior functionality at a fraction of the cost.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer / Contact Section */}
      <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-gray-700">

            {/* Column 1: Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <LayoutDashboard className="w-7 h-7 text-blue-400" />
                <h5 className="text-xl font-bold">School Hub</h5>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Empowering schools through intelligent, unified administrative tools.
              </p>
              <div className="flex space-x-4">
                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-500 transition duration-150">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition duration-150">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-600 transition duration-150">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h6 className="text-lg font-semibold mb-4 text-white">Platform</h6>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="text-gray-400 hover:text-blue-400 transition duration-150">Core Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition duration-150">Pricing Plans</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition duration-150">Security & Compliance</a></li>
                <li><a href="#demo" className="text-gray-400 hover:text-blue-400 transition duration-150">AI Assistant Demo</a></li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h6 className="text-lg font-semibold mb-4 text-white">Support</h6>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition duration-150">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition duration-150">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition duration-150">Request Training</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition duration-150">System Status</a></li>
              </ul>
            </div>

            {/* Column 4: Contact Details */}
            <div>
              <h6 className="text-lg font-semibold mb-4 text-white">Get in Touch</h6>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <a href="mailto:info@schoolhub.com" className="text-gray-400 hover:text-blue-400 transition duration-150">info@schoolhub.com</a>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <a href="tel:+918005550100" className="text-gray-400 hover:text-blue-400 transition duration-150">+91 800 555 0100</a>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-400">101 Education Ave, Digital City</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright and Legal Links */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p className="order-2 sm:order-1 mt-4 sm:mt-0">
              &copy; {new Date().getFullYear()} School Hub. All rights reserved.
            </p>
            <div className="order-1 sm:order-2 flex space-x-6">
              <a href="#" className="hover:text-blue-400 transition duration-150">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition duration-150">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition duration-150">Cookies Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
