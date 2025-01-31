import React from "react";
import AnimatedButton from "./animatedbutton";
import RollingCardGallery from "./RollingGallery";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center py-16">
      <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-left">
        <span className="text-[#C0402B]">RedString</span> Knows No Distance,
      </h2>
      <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-left">
        Only Connections
      </h2><br></br>
      <p className="text-xs mt-5 md:text-lg text-gray-600 dark:text-gray-300 mb-6">
      The advanced analytics tool crafted to unveil relationships between entities, visualized 
      </p>
      <p className="text-xs md:text-lg/0.5 text-gray-600 dark:text-gray-300 mb-6">
      through a dynamic network graph — a <b>'detective string-board'</b> interface
      </p>
      <p className="text-xs md:text-lg text-gray-600 dark:text-gray-300 mb-6">
      where connections unfold, patterns emerge, and insights come to life.
      </p><br></br>
      <Link to="/graph" className="flex space-x-4">
        <AnimatedButton onClick={() => {}} text="Try It Now" />
      </Link><br></br><br></br>

      <div className = "flex space-x-4">
      {/* <Card title="Test" content="LoJKNFOIK-RO0VJIWOJI DFNBOAJSRG0JIODBNIWK-O0FRVIBODNIK0W-QVDBIONEMWGK-BE0IONGMWFK-V0REBINOWFEKRV-EOFDOIOERJNWFOEPKFDEU" seeMoreText="dookie"/>
      <Card title="Test" content="Lorem ipsum" seeMoreText="dookie"/>
      <Card title="Test" content="Lorem ipsum" seeMoreText="dookie"/> */}
      <RollingCardGallery
        cards={[
          { title: "Red Strings", content: "Content 1", seeMoreText: "See More" },
          { title: "ER-Extraction", content: "Content 2", seeMoreText: "See More" },
          { title: "Data Ingestion", content: "Content 3", seeMoreText: "See More" },
          { title: "Feature 4", content: "Content 4", seeMoreText: "See More" },
          { title: "Feature 5", content: "Content 5", seeMoreText: "See More" },
          { title: "Feature 6", content: "Content 6", seeMoreText: "See More" },
        ]}
        autoplay={true}
        pauseOnHover={false}
      />
      </div>
      <br></br><br></br>
      <footer className="bg-black/80 text-gray-500/70 text-xs md:text-sm py-4 mt-12 border-t border-gray-700/50">
  <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
    <p className="mb-2 md:mb-0 text-gray-400/60">
      &copy; {new Date().getFullYear()} Team Chiomunks for the SMU BIA Datathon. All rights reserved. Made with 💘 and ☕, always.
    </p>
  </div>
</footer>




      
      

      
    </section>
  );
};

export default HeroSection;