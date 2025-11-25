import React, { useState } from 'react';
import { Mail, Lock, BookOpen } from 'lucide-react';
import login from '../api/auth/login.js'
import { useAppContext } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router';


const Login = () => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user, setUser } = useAppContext()

  const navigate = useNavigate()
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');


    try {

      const userData = await login(email, password);
      setUser(userData.data.user)
      setLoading(false)
      navigate("/app", { replace: true })

    } catch (error) {
      setMessage('Invalid credentials. Please check your email and password.');
      setLoading(false);
      setPassword("");

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)', // Light blue gradient background
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all hover:shadow-3xl">

        {/* Header Section */}
        <div className="p-8 bg-blue-700 text-white rounded-t-xl">
          <div className="flex items-center justify-center">
            <BookOpen size={48} className="mr-3 text-blue-200" />
            <h1 className="text-3xl font-extrabold tracking-tight">
              SchoolHub
            </h1>
          </div>
          <p className="text-center text-blue-300 mt-2 text-sm">
            School Management System Access
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@school.edu"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition duration-150 ease-in-out"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition duration-150 ease-in-out"
                disabled={loading}
              />
            </div>
          </div>

          {/* Message/Feedback Area */}
          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer/Links Section */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out">
            Forgot your password?
          </a>
          <p className="mt-4 text-gray-500">
            Need Support? Contact IT Help Desk.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
