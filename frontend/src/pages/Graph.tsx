import React from "react";
import Header from "../components/Header"; // Header component
import ButtonBar from "../components/ButtonBar";
import NetworkGraph from "../components/NetworkGraph";
import DotBackground from "../components/DotBackground";

const App: React.FC = () => {
  return (  
    <div className="relative min-h-screen w-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <DotBackground />
      </div>
      <div className="relative z-10">
        <Header />
      </div>
      <div className="relative z-10">
        <NetworkGraph />
      </div>
      <div className="relative z-10">
        <ButtonBar />
      </div>
    </div>
  );
};

export default App;
