import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Filter, Home, Search, User, ShoppingCart } from "lucide-react";

interface ButtonBarProps {
  filters: {
    minAffiliations: number;
    maxAffiliations: number;
    minFrequency: number;
    maxFrequency: number;
    name: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      minAffiliations: number;
      maxAffiliations: number;
      minFrequency: number;
      maxFrequency: number;
      name: string;
    }>
  >;
}

const ButtonBar: React.FC<ButtonBarProps> = ({ filters, setFilters }) => {
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Keep tempFilters in sync if filters change externally
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const toggleFilter = () => {
    setShowFilterOptions((prev) => !prev);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]: typeof value === "number" ? value : value.toString(),
    }));
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        showFilterOptions &&
        filterRef.current &&
        !filterRef.current.contains(target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(target)
      ) {
        setShowFilterOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterOptions]);

  return (
    <StyledWrapper>
      <div className="button-container">
        <button className="button">
          <Home className="icon" />
        </button>
        <button className="button">
          <Search className="icon" />
        </button>
        <button className="button" ref={filterButtonRef} onClick={toggleFilter}>
          <Filter className="icon" />
        </button>
        <button className="button">
          <User className="icon" />
        </button>
        <button className="button">
          <ShoppingCart className="icon" />
        </button>
      </div>

      {showFilterOptions && (
        <div ref={filterRef} className="dropup-menu filter-dropup-menu">
          <label className="dropup-label">Entity Name (Fuzzy Search)</label>
          <input
            type="text"
            placeholder="Search by name..."
            className="dropup-input"
            value={tempFilters.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />

          <label className="dropup-label">Min Affiliations</label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={tempFilters.minAffiliations}
            onChange={(e) => handleInputChange("minAffiliations", +e.target.value)}
          />

          <label className="dropup-label">Max Affiliations</label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={tempFilters.maxAffiliations}
            onChange={(e) => handleInputChange("maxAffiliations", +e.target.value)}
          />

          <label className="dropup-label">Min Frequency</label>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={tempFilters.minFrequency}
            onChange={(e) => handleInputChange("minFrequency", +e.target.value)}
          />

          <label className="dropup-label">Max Frequency</label>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={tempFilters.maxFrequency}
            onChange={(e) => handleInputChange("maxFrequency", +e.target.value)}
          />

          <button
            className="dropup-button"
            onClick={() => {
              setShowFilterOptions(false);
              console.log("✅ Filters Applied:", tempFilters);
              setFilters(tempFilters);
            }}
          >
            Apply Filters
          </button>
        </div>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button-container {
    display: flex;
    background-color: black;
    width: 250px;
    height: 40px;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
  }

  .button {
    outline: 0 !important;
    border: 0 !important;
    width: 40px;
    height: 40px;
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
  }

  .icon {
    font-size: 20px;
  }
`;

export default ButtonBar;
