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
      </div>
  );
};

export default About;
