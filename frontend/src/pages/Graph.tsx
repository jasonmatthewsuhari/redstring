import React from "react";
import Header from "../components/Header"; // Header component
import ButtonBar from "../components/ButtonBar";

const App: React.FC = () => {
  return (  
    <div className="relative min-h-screen w-screen overflow-hidden">
      <div className="relative z-10">
        <Header />
        <ButtonBar />
      </div>
    </div>
  );
};

export default App;
