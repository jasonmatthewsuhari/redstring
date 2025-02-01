import React from "react";
import Header from "../components/Header"; // Header component
import Squares from "../components/squares";

const About: React.FC = () => {
  return (  
    <div className="relative min-h-screen w-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Background effect */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <Squares 
          direction="diagonal" 
          speed={0.3} 
          borderColor="rgba(255, 80, 80, 0.3)" 
          squareSize={40} 
          hoverFillColor="rgba(255, 0, 0, 0.5)" 
        />
      </div>

      {/* Header */}
      <div className="w-full relative z-10">
        <Header />
      </div>

      {/* About Section with Cool Effects */}
      <div className="max-w-3xl text-center mt-10 p-6 bg-white bg-opacity-80 shadow-lg rounded-lg relative z-10 animate-spin-slow">
        <h2 className="text-4xl font-bold mb-4 animate-pulse">Welcome to Our World</h2>
        <p className="text-lg text-gray-600 animate-fade-in">Discover the story behind our team and vision. We are a group of passionate innovators, dedicated to crafting unique digital experiences. Our mission is to blend creativity and technology to build solutions that make an impact. Join us on this exciting journey!</p>
      </div>

      <style>
        {`
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .animate-spin-slow {
            animation: spin-slow 10s linear infinite;
          }

          .animate-fade-in {
            animation: fade-in 2s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default About;
