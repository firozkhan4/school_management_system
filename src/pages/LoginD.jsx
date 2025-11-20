import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X, CheckCircle, ArrowRight } from 'lucide-react';

// --- Components ---

// 1. SVG Icons for Logos (Inline for reliability)
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.23 3.61-1.06 1.61.26 3.15 1.15 4.19 2.65-3.72 2-3.1 6.91.6 8.3-.79 1.74-1.92 3.2-3.48 4.84zM12.9 6.24C12.96 4.14 14.86 2 17 2c.16 2.12-1.86 4.29-4.1 4.24z" />
  </svg>
);

// Main Logo Component (The Calligraphy)
const JamaaLogo = ({ className = "", textClass = "" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative">
      {/* Artistic representation of Arabic Lettering style */}
      <svg viewBox="0 0 100 100" className="w-10 h-10 fill-current text-sky-500">
        <path d="M80,20 C70,10 60,10 50,20 C40,30 30,30 20,20 L20,40 C30,50 40,50 50,40 C60,30 70,30 80,40 Z" opacity="0.5" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" />
        <circle cx="50" cy="50" r="15" fill="currentColor" />
      </svg>
    </div>
    <span className={`font-bold text-3xl tracking-tight ${textClass}`}>جمع</span>
  </div>
);

// 2. Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-full shadow-lg z-50 transition-all duration-300 animate-slide-down ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
      }`}>
      {type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

// --- Main Application ---

export default function LoginD() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [toast, setToast] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (formData.identifier && formData.password.length >= 6) {
        setToast({ type: 'success', message: `Welcome back to Jama'a!` });
      } else {
        setToast({ type: 'error', message: 'Please check your credentials.' });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white text-slate-900 font-sans">

      {/* Toast Notification Area */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* LEFT SIDE: Brand/Hero (Hidden on mobile, visible on lg screens) */}
      <div className="hidden lg:flex w-1/2 bg-sky-500 relative overflow-hidden items-center justify-center text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <svg viewBox="0 0 100 100" className="w-80 h-80 fill-white">
            {/* Large decorative version of logo */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="50" cy="50" r="10" fill="currentColor" />
            <path d="M50 10 L50 30 M50 70 L50 90 M10 50 L30 50 M70 50 L90 50" stroke="currentColor" strokeWidth="4" />
          </svg>
          <h1 className="text-9xl font-bold mt-4 tracking-tighter" style={{ fontFamily: 'serif' }}>جمع</h1>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 relative">

        {/* Mobile Header Logo */}
        <div className="lg:hidden mb-8 text-sky-500">
          <JamaaLogo />
        </div>

        {/* Content Container */}
        <div className="max-w-[600px] w-full mx-auto">

          <div className="hidden lg:block text-sky-500 mb-12">
            <JamaaLogo />
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Happening now
          </h1>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
            Join <span className="text-sky-500">جمع</span> today.
          </h2>

          {/* Social Login Buttons */}
          <div className="flex flex-col gap-4 mb-6">
            <button className="flex items-center justify-center gap-3 w-full px-6 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors duration-200 font-medium text-slate-700 bg-white">
              <GoogleIcon />
              Sign in with Google
            </button>
            <button className="flex items-center justify-center gap-3 w-full px-6 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors duration-200 font-bold text-slate-900 bg-white">
              <AppleIcon />
              Sign in with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-[1px] flex-1 bg-slate-200"></div>
            <span className="text-slate-500 text-sm">or</span>
            <div className="h-[1px] flex-1 bg-slate-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Identifier Input */}
            <div className="relative group">
              <input
                type="text"
                name="identifier"
                required
                className="peer w-full px-4 py-3.5 rounded-md border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all bg-transparent pt-5 pb-2 placeholder-transparent"
                placeholder="Phone, email, or username"
                value={formData.identifier}
                onChange={handleInputChange}
              />
              <label className="absolute left-4 top-3.5 text-slate-500 text-base transition-all 
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500
                peer-focus:top-1 peer-focus:text-xs peer-focus:text-sky-500
                peer-valid:top-1 peer-valid:text-xs peer-valid:text-sky-500 pointer-events-none">
                Phone, email, or username
              </label>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="peer w-full px-4 py-3.5 rounded-md border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all bg-transparent pt-5 pb-2 placeholder-transparent"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <label className="absolute left-4 top-3.5 text-slate-500 text-base transition-all 
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500
                peer-focus:top-1 peer-focus:text-xs peer-focus:text-sky-500
                peer-valid:top-1 peer-valid:text-xs peer-valid:text-sky-500 pointer-events-none">
                Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-sky-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 w-full py-3 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2
                ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'}
              `}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Next'
              )}
            </button>

            <button
              type="button"
              className="w-full py-3 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-900 font-bold transition-all duration-200"
            >
              Forgot password?
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-sm text-slate-500">
            <p>Don't have an account? <a href="#" className="text-sky-500 hover:underline">Sign up</a></p>
          </div>

        </div>
      </div>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes slide-down {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
