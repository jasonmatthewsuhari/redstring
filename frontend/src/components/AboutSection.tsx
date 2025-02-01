import React from "react";

const AboutSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center py-16">
      <h2 className="text-4xl md:text-6xl bottom-50 font-extrabold mb-4 text-left">
        About <span className="text-[#C0402B]">RedString</span>
      </h2>

      <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg shadow-lg">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="RedString Overview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
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

export default AboutSection;