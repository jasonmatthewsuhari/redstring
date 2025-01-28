import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 shadow-md">
      <h1 className="text-lg font-semibold text-primary">RedString</h1>
      <nav className="space-x-4">
        <a href="#" className="hover:text-primary">Product</a>
        <a href="#" className="hover:text-primary">Features</a>
        <a href="#" className="hover:text-primary">Pricing</a>
        <a href="#" className="hover:text-primary">Company</a>
        <a href="#" className="hover:text-primary">Blog</a>
      </nav>
      <button className="px-4 py-2 bg-primary text-white rounded-md shadow-md hover:bg-indigo-600">
        Get Started
      </button>
    </header>
  );
};

export default Header;