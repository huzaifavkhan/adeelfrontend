// components/LoadingScreen.js
import React from "react";
import logo from "/uploads/logo.png"

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        className="h-28 w-28 mb-8 animate-bounce"
      />

      {/* Gradient progress bar */}
      <div className="w-56 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div className="h-full w-full bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 animate-slide" />
      </div>

      {/* Small text */}
      <p className="mt-4 text-gray-500 text-sm font-medium">
        Loading...
      </p>

      {/* Animation styles */}
      <style jsx="true">{`
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-slide {
          animation: slide 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
