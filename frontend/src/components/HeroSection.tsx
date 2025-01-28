import React from "react";
import AnimatedButton from "./animatedbutton";
import Card from "./card";
import RollingCardGallery from "./RollingGallery";
  

const HeroSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center py-16">
      <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-left"> {/*mb is bottom margin*/}
        RedString Knows No Distance,
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
      <div className="flex space-x-4">
        <AnimatedButton onClick = {() => {}} text = "Try It Now" />
      </div><br></br><br></br>
      <div className = "flex space-x-4">
      {/* <Card title="Test" content="LoJKNFOIK-RO0VJIWOJI DFNBOAJSRG0JIODBNIWK-O0FRVIBODNIK0W-QVDBIONEMWGK-BE0IONGMWFK-V0REBINOWFEKRV-EOFDOIOERJNWFOEPKFDEU" seeMoreText="dookie"/>
      <Card title="Test" content="Lorem ipsum" seeMoreText="dookie"/>
      <Card title="Test" content="Lorem ipsum" seeMoreText="dookie"/> */}
      <RollingCardGallery
        cards={[
          { title: "Card 1", content: "Content 1", seeMoreText: "See More" },
          { title: "Card 2", content: "Content 2", seeMoreText: "See More" },
          { title: "Card 3", content: "Content 3", seeMoreText: "See More" },
          { title: "Card 4", content: "Content 4", seeMoreText: "See More" },
          { title: "Card 5", content: "Content 5", seeMoreText: "See More" },
          { title: "Card 6", content: "Content 6", seeMoreText: "See More" },
        ]}
        autoplay={true}
        pauseOnHover={true}
      />
      </div>
      

      
    </section>
  );
};

export default HeroSection;