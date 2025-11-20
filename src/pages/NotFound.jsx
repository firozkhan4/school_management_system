import React from 'react';
import { Frown, Home, ZapOff } from 'lucide-react';

const NotFound = () => {
  // Styling inspired by classic Indian school aesthetics: uniforms, notice boards, and vibrant colors.
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-4 sm:p-8 font-inter antialiased">
      <div className="max-w-xl w-full bg-white border-4 border-blue-700 rounded-2xl p-8 sm:p-12 text-center shadow-2xl transition duration-500 hover:shadow-blue-300/50">

        {/* School-Themed Icon and Error Code */}
        <div className="mb-8">
          <ZapOff className="w-24 h-24 mx-auto text-red-600 mb-4 animate-pulse" />
          <span className="text-8xl font-black text-blue-700 tracking-tighter block leading-none">404</span>
        </div>

        {/* Themed Message */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Teacher is Absent! (Page Not Found)
        </h1>

        <p className="text-xl text-gray-600 mb-8 font-medium">
          <span className="text-red-600 font-bold">Oh ho!</span> Seems like the **Padhai** (study material) you are looking for has been misplaced.
          <br className="hidden sm:inline" /> This URL is not on the school's timetable.
        </p>

        {/* Call to Action (Single Button) */}
        <div className="flex justify-center">
          <a
            href="/"
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-800 transition transform hover:scale-[1.03] duration-200"
            title="Go back to the application homepage"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Homepage
          </a>
        </div>

        {/* Footer Note */}
        <p className="mt-10 text-sm text-gray-400 italic">
          <Frown className="w-4 h-4 inline mr-1 -mt-0.5" /> Please check the URL again or report this error to the Headmaster!
        </p>

      </div>
    </div>
  );
};

export default NotFound;
