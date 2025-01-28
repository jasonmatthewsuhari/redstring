import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
      <p>Trusted by 2000+ customers worldwide</p>
      <div className="flex justify-center space-x-6 mt-2">
        <span>Amazon</span>
        <span>Verizon</span>
        <span>Microsoft</span>
      </div>
    </footer>
  );
};

export default Footer;
