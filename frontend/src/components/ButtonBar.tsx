import React from "react";
import styled from "styled-components";

const ButtonBar: React.FC = () => {
  return (
    <StyledWrapper>
      <div className="button-container">
        <button className="button">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 1024 1024">
            <path fill="white" d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
          </svg>
        </button>
        <button className="button">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24">
            <path fill="white" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button className="button">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24">
            <path fill="white" d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
          </svg>
        </button>
        <button className="button">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24">
            <circle fill="white" r={1} cy={21} cx={9} />
            <circle fill="white" r={1} cy={21} cx={20} />
            <path fill="white" d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%; /* Fullscreen width */
  display: flex;
  justify-content: center;
  padding: 10px 0;
  z-index: 50;

  .button-container {
    display: flex;
    width: 100%;
    background-color: rgba(120, 20, 20, 0.75); /* Mahogany red with transparency */
    height: 70px;
    align-items: center;
    justify-content: space-around;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 15px rgba(255, 107, 107, 0.3);
  }

  .button {
    outline: none;
    border: none;
    width: 65px; /* Larger button */
    height: 65px;
    border-radius: 50%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition: all ease-in-out 0.3s;
    cursor: pointer;
  }

  .button:hover {
    transform: translateY(-3px);
    filter: brightness(1.5);
  }

  .icon {
    width: 90%; /* Make icons larger */
    height: 90%;
    color: white; /* Ensure white icons */
    transition: all ease-in-out 0.3s;
  }

  .button:hover .icon {
    filter: drop-shadow(0 0 8px rgba(255, 107, 107, 0.9));
  }
`;

export default ButtonBar;
