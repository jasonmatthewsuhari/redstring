import React, { useState } from "react";
import styled from "styled-components";
import { Download, ChartNetwork, Filter, Plus } from "lucide-react";
import SearchBox from "./SearchBox"

const ButtonBar: React.FC = () => {
  const [showTools, setShowTools] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const toggleTools = () => {
    setShowTools(!showTools);
    setShowFilterOptions(false); // Close filter options if Tools is opened
  };

  const toggleFilter = () => {
    setShowFilterOptions(!showFilterOptions);
    setShowTools(false); // Close Tools if Filter is opened
  };

  return (
    <StyledWrapper>
      <div className="button-container">
        {/* Input Text */}
        <div className="tooltip-container">
          <Plus className = "grabbyHands"/>
          <span className="tooltip">Add Entity / Relationship</span>
        </div>

        {/* Search */}
        <div className="tooltip-container">
          <SearchBox className = "grabbyHands"/>
          <span className="tooltip">Searching for Something?</span>
        </div>
        {/* Search */}
        <div className="tooltip-container">
          <ChartNetwork className = "grabbyHands"/>
          <span className="tooltip">Find Closest Relation</span>
        </div>

        {/* Filter Button with Drop-up */}
        <div className="tooltip-container filter-container">
          <button
            className={`button ${showFilterOptions ? "active" : ""}`}
            onClick={toggleFilter}
          >
            <Filter className = "grabbyHands"/>
          </button>
          <span className="tooltip">Filter</span>
          {showFilterOptions && (
            <div className="dropup-menu">
              <button className="dropup-button">By Date</button>
              <button className="dropup-button">By Category</button>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="tooltip-container">
          <Download className = "grabbyHands"/>
          <span className="tooltip">Download the Page</span>
        </div>

      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 95%; /* Increased width */
  max-width: 1000px; /* Increased max-width */
  border-radius: 20px;
  display: flex;
  justify-content: center;
  padding: 10px 0;
  z-index: 50;

  .button-container {
    display: flex;
    width: 100%;
    background-color: rgba(120, 20, 20, 0.85);
    height: 80px;
    align-items: center;
    justify-content: space-around;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 15px rgba(255, 107, 107, 0.3);
    border-radius: 20px;
    position: relative;
  }

  .button {
    outline: none;
    border: none;
    width: 75px; /* Slightly increased */
    height: 75px; /* Slightly increased */
    border-radius: 50%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }

  .button:hover {
    transform: translateY(-3px);
    filter: brightness(1.5);
  }

  .button.active {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  }

  .tooltip-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tooltip {
    visibility: hidden;
    background-color: black;
    color: white;
    text-align: center;
    padding: 5px;
    border-radius: 5px;
    position: absolute;
    bottom: 80px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .tooltip-container:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }

  .dropup-menu {
    position: absolute;
    bottom: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    z-index: 9999;
  }

  .dropup-button {
    background: none;
    border: none;
    color: white;
    padding: 5px 10px;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .dropup-button:hover {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
  }

  .slider-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .zoom-slider {
    width: 140px; /* Slightly increased */
  }
`;

export default ButtonBar;