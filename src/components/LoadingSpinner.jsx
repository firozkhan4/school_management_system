import React from 'react';
import { Clock, Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/70 backdrop-blur-sm rounded-xl shadow-2xl transition duration-500">
      {/* Themed Loader Container */}
      <div className="relative w-40 h-40 mb-6">

        {/* Visualizing the "Running Late" Student (Pure CSS/Tailwind Art) */}
        <div className="absolute inset-0 flex items-center justify-center">

          {/* The Running Student Animation */}
          <div className="relative animate-bounce-horizontal duration-1000 ease-in-out">

            {/* School Bag (Brown/Leather look) */}
            <div className="absolute -left-4 -top-6 w-10 h-12 bg-yellow-800 border-2 border-yellow-900 rounded-md shadow-lg transform rotate-6 animate-swing-bag origin-bottom-right">
              <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-900 rounded-full"></div>
            </div>

            {/* Body (Uniform - White Shirt, Blue Shorts/Skirt) */}
            <div className="relative w-6 h-10 bg-white border border-gray-300 rounded-t-lg mx-auto">
              {/* Head/Hair */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-900 rounded-full border-2 border-white">
                {/* Small face detail */}
                <div className="w-2 h-2 bg-pink-300 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2"></div>
              </div>

              {/* Legs/Movement Effect */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                <div className="w-2 h-4 bg-blue-700 rounded-full animate-kick-1"></div>
                <div className="w-2 h-4 bg-blue-700 rounded-full animate-kick-2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* The "Loading" Ring - A Clock/Wheel */}
        <Loader2 className="w-full h-full text-blue-500 opacity-20 animate-spin-slow" />
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-2">
        <Clock className="w-5 h-5 inline mr-2 text-yellow-600" />
        Hold On, Please...
      </h2>
      <p className="text-gray-500 text-center text-sm">
        The student is running to deliver the papers.
      </p>
      <p className="text-gray-500 text-center text-xs mt-1 italic">
        (Like reaching school just before the assembly bell.)
      </p>

      {/* Custom CSS for the animations */}
      <style>{`
                @keyframes bounce-horizontal {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(10px); }
                }
                @keyframes kick-1 {
                    0%, 100% { transform: rotate(10deg); }
                    50% { transform: rotate(-10deg); }
                }
                @keyframes kick-2 {
                    0%, 100% { transform: rotate(-10deg); }
                    50% { transform: rotate(10deg); }
                }
                @keyframes swing-bag {
                    0%, 100% { transform: rotate(6deg) translateY(0); }
                    50% { transform: rotate(-6deg) translateY(-5px); }
                }
                
                .animate-bounce-horizontal {
                    animation: bounce-horizontal 0.5s infinite alternate;
                }
                .animate-kick-1 {
                    animation: kick-1 0.5s infinite alternate;
                }
                .animate-kick-2 {
                    animation: kick-2 0.5s infinite alternate reverse;
                }
                .animate-swing-bag {
                    animation: swing-bag 0.5s infinite alternate;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite; /* Slower spin for the background */
                }
            `}</style>
    </div>
  );
};

export default LoadingSpinner;
