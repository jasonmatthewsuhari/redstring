import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center text-center py-16">
      <h2 className="text-4xl md:text-6xl font-extrabold mb-4">
        Free Landing Page Template for Startups
      </h2>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">
        Nextly is a free landing page & marketing website template for startups and indie projects.
      </p>
      <div className="flex space-x-4">
        <button className="px-6 py-3 bg-primary text-white rounded-md shadow-md hover:bg-indigo-600">
          Download for Free
        </button>
        <a href="#" className="px-6 py-3 border border-primary text-primary rounded-md hover:bg-primary hover:text-white">
          View on GitHub
        </a>
      </div>
    </section>
  );
};

export default HeroSection;