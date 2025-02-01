import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Header: React.FC = () => {
  return (
    <StyledHeader>
      <div className="branding">
        <img className="logo" src="/logo_alt.png" alt="Logo" />
        <h1 className="brand">Redstring</h1>
      </div>

      <nav className="nav-container">
        <Link to="/" className="nav-button">
          Home
        </Link>
        <Link to="/about" className="nav-button">
          About
        </Link>
        <Link to="/contact" className="nav-button">
          Contact
        </Link>
      </nav>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  height: 72px;
  background-color: rgba(120, 20, 20, 0.75);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
  z-index: 50;

  /* Branding container */
  .branding {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo {
    width: 40px;
    height: 40px;
    object-fit: cover;
  }

  .brand {
    font-size: 24px;
    font-weight: bold;
    color: #fff;
  }

  .nav-container {
    display: flex;
    gap: 24px;
  }

  .nav-button {
    color: #fff;
    font-size: 19px;
    text-decoration: none;
    transition: all 0.3s ease;
    padding: 10px 14px;
    border-radius: 5px;
  }

  .nav-button:hover {
    background-color: rgba(255, 107, 107, 0.3);
    transform: scale(1.1);
  }
`;

export default Header;
