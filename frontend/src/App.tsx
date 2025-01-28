// Import necessary modules and components
import React from 'react';
import Header from "./components/Header"; // Header component for the app
import HeroSection from "./components/HeroSection"; // Main content section
// import Footer from "./components/Footer"; // Footer is commented out for now

// Define the main App component
const App: React.FC = () => {
  return (
    <div 
      className="bg-gradient-to-b from-black to-red-900 min-h-screen w-screen"
    >
      {/* Header component */}
      <Header />

      {/* Hero Section: Main landing content */}
      <HeroSection />

      {/* Footer is commented out but can be added back if needed */}
      {/* <Footer /> */}
    </div>
  );
};

export default App;

