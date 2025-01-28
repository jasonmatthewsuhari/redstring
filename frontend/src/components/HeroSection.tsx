import React from "react";
import AnimatedButton from "./animatedbutton";
import Card from "./card";
  

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
      An advanced analytics tool crafted to unveil relationships between entities, visualized 
      </p>
      <p className="text-xs md:text-lg/0.5 text-gray-600 dark:text-gray-300 mb-6">
      through a dynamic network graph — like a 'detective string board' interface
      </p>
      <p className="text-xs md:text-lg text-gray-600 dark:text-gray-300 mb-6">
      where connections unfold, patterns emerge, and insights come to life.
      </p><br></br>
      <div className="flex space-x-4">
        <AnimatedButton onClick = {() => {}} text = "Try It Now" />
      </div><br></br><br></br>
      <div className = "flex space-x-4">
      <Card title="Test" content="LoJKNFOIK-RO0VJIWOJI DFNBOAJSRG0JIODBNIWK-O0FRVIBODNIK0W-QVDBIONEMWGK-BE0IONGMWFK-V0REBINOWFEKRV-EOFDOIOERJNWFOEPKFDEU" seeMoreText="dookie"/>
      <Card title="Test" content="Lorem ipsum" seeMoreText="dookie"/>
      <Card title="Test" content="Lorem ipsum" seeMoreText="dookie"/>
      </div>
      

      
    </section>
  );
};

export default HeroSection;