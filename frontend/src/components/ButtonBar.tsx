import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Filter } from "lucide-react";

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
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const toggleFilter = () => {
    setShowFilterOptions((prev) => !prev);
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
      <div className="tooltip-container filter-container">
        <button
          ref={filterButtonRef}
          className={`button ${showFilterOptions ? "active" : ""}`}
          onClick={toggleFilter}
        >
          <Filter className="grabbyHands" />
        </button>
        <span className="tooltip">Filter</span>

        {showFilterOptions && (
          <div ref={filterRef} className="dropup-menu filter-dropup-menu">
            <label className="dropup-label">Entity Name (Fuzzy Search)</label>
            <input
              type="text"
              placeholder="Search by name..."
              className="dropup-input"
              value={filters.name}
              onChange={(e) =>
                setFilters({ ...filters, name: e.target.value })
              }
            />

            <label className="dropup-label">Min Affiliations</label>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={filters.minAffiliations}
              onChange={(e) =>
                setFilters({ ...filters, minAffiliations: Number(e.target.value) })
              }
            />

            <label className="dropup-label">Max Affiliations</label>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={filters.maxAffiliations}
              onChange={(e) =>
                setFilters({ ...filters, maxAffiliations: Number(e.target.value) })
              }
            />

            <label className="dropup-label">Min Frequency</label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={filters.minFrequency}
              onChange={(e) =>
                setFilters({ ...filters, minFrequency: Number(e.target.value) })
              }
            />

            <label className="dropup-label">Max Frequency</label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={filters.maxFrequency}
              onChange={(e) =>
                setFilters({ ...filters, maxFrequency: Number(e.target.value) })
              }
            />

          <button
            className="dropup-button"
            onClick={() => {
              // 1) Close the filter dropup
              setShowFilterOptions(false);

              // 2) The key step: ensure the parent’s `filters` is updated
              //    so that `NetworkGraph` sees the new values in its `filters` prop
              console.log("✅ Filters Applied:", filters);
            }}
          >
            Apply Filters
          </button>


          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .filter-container {
    position: relative;
  }
  .dropup-menu {
    position: absolute;
    bottom: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 9999;
    backdrop-filter: blur(10px);
    width: 220px;
  }
  .dropup-input {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: white;
    padding: 8px;
    border-radius: 5px;
    width: 100%;
    outline: none;
    margin-bottom: 6px;
  }
  .dropup-button {
    background: none;
    border: none;
    color: white;
    padding: 8px 10px;
    cursor: pointer;
    transition: 0.2s ease;
    text-align: center;
    width: 100%;
    border-radius: 5px;
  }
  .dropup-button:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  .dropup-label {
    color: #fff;
    font-size: 0.9rem;
  }
`;

export default ButtonBar;
