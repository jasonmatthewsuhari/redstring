import React from "react";
import AnimatedButton from "./animatedbutton";
import RollingCardGallery from "./RollingGallery";
{/*import CircularGallery from "./CircularGallery";*/}
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center py-16 text-center mt-8">
      <h2 className="text-4xl md:text-7xl font-extrabold mb-4">
        <span className="text-[#C0402B]">Redstring</span> Knows No Distance,
      </h2>
      <h2 className="text-4xl md:text-7xl font-extrabold mb-6">Only Connections
      </h2>
      
      <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mt-5">
        The advanced analytics tool crafted to unveil relationships between entities, visualized
        through a dynamic network graph — a <b>'detective string-board'</b> interface,
        where connections unfold, patterns emerge, and insights come to life.
      </p>

      <Link to="/graph">
        <AnimatedButton onClick={() => {}} text="Try It Now" />
      </Link>

      <div className = "flex space-x-4 justify-center text-center w-full mt-12">
      {/* <Card title="Test" content="LoJKNFOIK-RO0VJIWOJI DFNBOAJSRG0JIODBNIWK-O0FRVIBODNIK0W-QVDBIONEMWGK-BE0IONGMWFK-V0REBINOWFEKRV-EOFDOIOERJNWFOEPKFDEU" seeMoreText="dookie"/>
      <Card title="Test" content="Lorem ipsum" seeMoreText="dookie"/>
      <Card title="Test" content="Lorem ipsum" seeMoreText="dookie"/> */}
      <RollingCardGallery
        cards={[
          { title: "Filter", content: "Filter by Cluster Size, Relationship Categories and Time" },
          { title: "NewsAPI", content: "Automatic fetching of the latest news via a Python scheduler" },
          { title: "Entity Search", content: "Allows entity search to explore specific relationships and significance" },
          { title: "Screenshot Page", content: "Allows instant screenshot of network graph page for future analysis" },
          { title: "Cloud DB", content: "Highly-scalable cloud database run on Neo4J Aura"},
          { title: "3D Renders", content: "WebGL-Powered 3D rendering of nodes and entities"},
        ]}
        autoplay={true}
        pauseOnHover={false}
      />
      </div>
      <br></br><br></br>
      <footer className="bg-black/80 text-gray-500/70 text-xs md:text-sm py-4 mt-10  border-t border-gray-700/50">
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