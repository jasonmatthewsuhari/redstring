import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Header: React.FC = () => {
  return (
    <StyledHeader>
      {/* Branding */}
      <h1 className="brand">Redstring</h1>

      {/* Navigation Links */}
      <nav className="nav-container">
        <Link to="/" className="nav-button">Home</Link>
        <Link to="/about" className="nav-button">About</Link>
        <Link to="/contact" className="nav-button">Contact</Link>
      </nav>

      {/* Log In Button */}
      <button className="login-button">
        Log In
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      </button>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  height: 72px; /* Increased height by 20% */
  background-color: rgba(120, 20, 20, 0.75); /* Slightly redder, more transparent */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px; /* Slightly more padding */
  backdrop-filter: blur(10px);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
  z-index: 50;

  .brand {
    font-size: 24px; /* Increased by 20% */
    font-weight: bold;
    color: #fff; /* White text */
  }

  .nav-container {
    display: flex;
    gap: 24px; /* Increased spacing */
  }

  .nav-button {
    color: #fff;
    font-size: 19px; /* Slightly bigger text */
    text-decoration: none;
    transition: all 0.3s ease;
    padding: 10px 14px; /* Bigger button area */
    border-radius: 5px;
  }

  .nav-button:hover {
    background-color: rgba(255, 107, 107, 0.3);
    transform: scale(1.1);
  }

  .login-button {
    display: flex;
    align-items: center;
    background-color: #c0392b; /* Deep red */
    color: white;
    border: none;
    padding: 10px 20px; /* Bigger button */
    border-radius: 6px;
    font-size: 18px; /* Bigger font */
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .login-button:hover {
    background-color: #a93226;
  }

  .icon {
    margin-left: 10px;
    width: 24px; /* Bigger icon */
    height: 24px;
  }
`;

export default Header;
