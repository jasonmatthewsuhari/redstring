import React, { useState } from "react";
import styled from "styled-components";
import { Square, Settings, Filter, Clock, ZoomIn } from "lucide-react";
import TextInput from "./TextInput";
import Slider from "@mui/material/Slider";

const ButtonBar: React.FC = () => {
  const [showTools, setShowTools] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  return (
    <StyledWrapper>
      <div className="button-container">
        {/* Select Button */}
        <div className="tooltip-container">
          <button
            className={`button ${activeButton === "select" ? "active" : ""}`}
            onClick={() => setActiveButton(activeButton === "select" ? null : "select")}
          >
            <Square size={32} color="white" />
          </button>
          <span className="tooltip">Select</span>
        </div>

        {/* Tools Button with Clickable Drop-up */}
        <div className="tooltip-container tools-container">
          <button
            className={`button ${showTools ? "active" : ""}`}
            onClick={() => setShowTools(!showTools)}
          >
            <Settings size={32} color="white" />
          </button>
          <span className="tooltip">Tools</span>
          {showTools && (
            <div className="dropup-menu">
              <button className="dropup-button">Find Relation</button>
              <button className="dropup-button">Download</button>
            </div>
          )}
        </div>

        {/* Filter Button */}
        <div className="tooltip-container">
          <button
            className={`button ${activeButton === "filter" ? "active" : ""}`}
            onClick={() => setActiveButton(activeButton === "filter" ? null : "filter")}
          >
            <Filter size={32} color="white" />
          </button>
          <span className="tooltip">Filter</span>
        </div>

        {/* Timeline Button */}
        <div className="tooltip-container">
          <button
            className={`button ${activeButton === "timeline" ? "active" : ""}`}
            onClick={() => setActiveButton(activeButton === "timeline" ? null : "timeline")}
          >
            <Clock size={32} color="white" />
          </button>
          <span className="tooltip">Timeline</span>
        </div>

        {/* Input Text */}
        <div className="tooltip-container">
          <TextInput />
          <span className="tooltip">Input Text</span>
        </div>

        {/* Zoom Slider */}
        <div className="tooltip-container slider-container">
          <ZoomIn size={32} color="white" />
          <Slider
            className="zoom-slider"
            defaultValue={100}
            step={10}
            marks
            min={50}
            max={150}
            aria-label="Zoom"
          />
          <span className="tooltip">Zoom</span>
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
  width: 90%;
  max-width: 800px;
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
    width: 70px;
    height: 70px;
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
    z-index: 9999; /* Ensures it appears above everything */
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
    width: 120px;
  }
`;

export default ButtonBar;
