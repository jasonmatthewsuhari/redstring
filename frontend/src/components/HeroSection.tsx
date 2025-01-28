import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center py-16">
      <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-left"> {/*mb is bottom margin*/}
        RedString Knows No Distance,
      </h2>
      <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-left">
        Only Connections
      </h2>
      <p className="text-xs mt-5 md:text-lg text-gray-600 dark:text-gray-300 mb-6">
      An advanced analytics tool crafted to unveil relationships between entities, visualized 
      </p>
      <p className="text-xs md:text-lg/0.5 text-gray-600 dark:text-gray-300 mb-6">
      through a dynamic network graph — like a 'detective string board' interface
      </p>
      <p className="text-xs md:text-lg text-gray-600 dark:text-gray-300 mb-6">
      where connections unfold, patterns emerge, and insights come to life.
      </p>
      <div className="flex space-x-4">
        <button className="px-6 py-3 bg-primary text-white rounded-md shadow-md hover:bg-red-900">
          View More
        </button>
      </div>
    </section>
  );
};

export default HeroSection;