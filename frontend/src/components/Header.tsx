import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-black shadow-md">
      <h1 className="text-lg font-semibold text-primary">RedString</h1>
      {/*<nav className="space-x-4">
        <a href="#" className="hover:text-primary">Product</a>
        <a href="#" className="hover:text-primary">Features</a>
        <a href="#" className="hover:text-primary">Pricing</a>
        <a href="#" className="hover:text-primary">Company</a>
        <a href="#" className="hover:text-primary">Blog</a>
      </nav>*/}
      <button className="px-4 py-2 bg-primary text-white rounded-md shadow-md hover:bg-red-800 flex items-center">
  Log In
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="ml-2 size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
</button>
    </header>
  );
};

export default Header;