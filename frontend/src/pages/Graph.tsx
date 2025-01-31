import React from "react";
import Header from "../components/Header"; // Header component
import ButtonBar from "../components/ButtonBar";
import NetworkGraph from "../components/NetworkGraph";

const App: React.FC = () => {
  return (  
    <div className="relative min-h-screen w-screen overflow-hidden">
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
