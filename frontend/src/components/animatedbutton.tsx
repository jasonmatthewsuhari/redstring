import React from 'react';
import styled from 'styled-components';

interface AnimatedButtonProps {
  text: string;
  onClick?: () => void;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ text, onClick }) => {
  return (
    <StyledWrapper>
      <button onClick={onClick}>{text}</button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    --glow-color: rgb(192, 64, 43); /* Mahogany red glow */
    --glow-spread-color: rgba(192, 64, 43, 0.7); /* Softer mahogany glow */
    --enhanced-glow-color: rgb(216, 89, 69); /* Lighter mahogany red for highlights */
    --btn-color: rgb(101, 34, 29); /* Deep mahogany red for the button background */
    
    border: 0.3em solid var(--glow-color);
    padding: 1.2em 4.5em; /* ⬆️ Increased padding (longer and bigger) */
    color: white; /* Text color before hover */
    font-size: 18px; /* ⬆️ Slightly larger font */
    font-weight: bold;
    background-color: var(--btn-color);
    border-radius: 1.2em; /* ⬆️ Slightly larger border radius */
    outline: none;
    
    box-shadow: 0 0 1.2em 0.3em var(--glow-color),
      0 0 4.5em 1.5em var(--glow-spread-color),
      inset 0 0 0.8em 0.3em var(--glow-color);
    
    text-shadow: 0 0 0.6em var(--glow-color);
    position: relative;
    transition: all 0.3s;
  }

  button::after {
    pointer-events: none;
    content: '';
    position: absolute;
    top: 130%; /* ⬆️ Slightly increased shadow height */
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--glow-spread-color);
    filter: blur(2.2em); /* ⬆️ Slightly stronger blur */
    opacity: 0.75; /* ⬆️ Slightly higher transparency */
    transform: perspective(1.5em) rotateX(35deg) scale(1, 0.6);
  }

  button:hover {
    color: var(--btn-color); /* Change text color on hover */
    background-color: var(--glow-color);
    
    box-shadow: 0 0 1.5em 0.3em var(--glow-color),
      0 0 5em 2.5em var(--glow-spread-color),
      inset 0 0 1em 0.3em var(--glow-color);
  }

  button:active {
    box-shadow: 0 0 0.8em 0.3em var(--glow-color),
      0 0 3em 2em var(--glow-spread-color),
      inset 0 0 0.6em 0.3em var(--glow-color);
  }
`;

export default AnimatedButton;
