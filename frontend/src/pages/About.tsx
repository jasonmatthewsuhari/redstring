// Import necessary modules and components
import React from "react";
import Header from "../components/Header"; // Header component
import AboutSection from "../components/AboutSection"; // Main content
import Squares from "../components/squares"; // Background animation

// Define the main App component
const App: React.FC = () => {
  return (  
    <div className="relative min-h-screen w-screen overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <Squares 
          direction="diagonal" 
          speed={0.3} 
          borderColor="rgba(255, 80, 80, 0.3)" 
          squareSize={40} 
          hoverFillColor="rgba(255, 0, 0, 0.5)" 
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        <AboutSection />
      </div>

      {/* About Section */}
      <div className="max-w-3xl text-center mt-10 p-6 bg-white bg-opacity-80 shadow-lg rounded-lg relative z-10">
        <h2 className="text-4xl font-bold mb-4 animate-pulse">What is Redstring?</h2>
        <p className="text-lg text-gray-600 animate-fade-in">
        Redstring, is an automated news processing system that leverages natural language processing, knowledge graphs, and real-time article ingestion to transform unstructured news articles into structured insights. Redstring scrapes, fact-checks, extracts entities, maps relationships, and visualizes intelligence in an interactive network graph. By integrating LLM-driven credibility assessment, Named Entity Recognition (NER), and Relation Extraction (RE), our system identifies affiliations, geopolitical influences, and covert relationship patterns with minimal human intervention, displaying the extracted intelligence in an interactive Tableau dashboard for hands-free, continuously available analysis.

        </p>
      </div>

      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .animate-fade-in {
            animation: fade-in 2s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default App;
