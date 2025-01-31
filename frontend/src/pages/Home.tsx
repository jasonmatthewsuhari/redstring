// Import necessary modules and components
import React from "react";
import Header from "../components/Header"; // Header component
import HeroSection from "../components/HeroSection"; // Main content
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
        <HeroSection />
      </div>
    </div>
  );
};

export default App;
