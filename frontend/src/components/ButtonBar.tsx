import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { MousePointerClick, Plus, Filter, ImageDown } from "lucide-react";

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
  isSelecting: boolean;
  setIsSelecting: React.Dispatch<React.SetStateAction<boolean>>;
  handleSnapshot: () => void;
}

const ButtonBar: React.FC<ButtonBarProps> = ({ filters, setFilters, isSelecting, setIsSelecting, handleSnapshot }) => {
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);
  const [showAddOptions, setShowAddOptions] = useState(false);

  const [nodeName, setNodeName] = useState("");
  const [node1, setNode1] = useState("");
  const [node2, setNode2] = useState("");
  const [relationshipType, setRelationshipType] = useState("");


  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const addButtonRef = useRef<HTMLButtonElement>(null);
  const addRef = useRef<HTMLDivElement>(null);


  // Keep tempFilters in sync if filters change externally
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const toggleFilter = () => {
    setShowFilterOptions((prev) => !prev);
  };

  const toggleAddOptions = () => {
    setShowAddOptions((prev) => !prev);
  };
  
  const handleInputChange = (field: string, value: string | number) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]: typeof value === "number" ? value : value.toString(),
    }));
  };

  const handleAddNode = (nodeName: string) => {
    console.log(`➕ Node Added: ${nodeName}`);
  };
  
  const handleAddRelationship = (node1: string, node2: string, relationship: string) => {
    console.log(`🔗 Relationship Added: ${node1} -[${relationship}]-> ${node2}`);
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
      <button
        className={`relative button transition-all duration-300 ${
          isSelecting ? "shadow-[0_0_15px_5px_rgba(255,255,255,0.4)]" : "shadow-none"
        }`}
        onClick={() => setIsSelecting((prev) => !prev)}>
        <MousePointerClick className="icon relative z-10" />
      </button>



        <button className="button" ref={addButtonRef} onClick={toggleAddOptions}>
          <Plus className="icon" />
        </button>
        <button className="button" ref={filterButtonRef} onClick={toggleFilter}>
          <Filter className="icon" />
        </button>
        <button className="button" onClick = {handleSnapshot}>
          <ImageDown className="icon" />
        </button>
      </div>

      {showFilterOptions && (
        <div ref={filterRef} className="dropup-menu filter-dropup-menu">
          <h3 className="dropup-title">Filter Options</h3>

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
            onChange={(e) =>
              handleInputChange("minAffiliations", +e.target.value)
            }
          />

          <label className="dropup-label">Max Affiliations</label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={tempFilters.maxAffiliations}
            onChange={(e) =>
              handleInputChange("maxAffiliations", +e.target.value)
            }
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
      {showAddOptions && (
  <div ref={addRef} className="dropup-menu">
    <h3 className="dropup-title">Add Options</h3>

    {/* Add Node Section */}
    <input
      type="text"
      placeholder="Node Name"
      value={nodeName}
      onChange={(e) => setNodeName(e.target.value)}
    />
    <button className="dropup-button" onClick={() => handleAddNode(nodeName)}>
      Add Node
    </button>

    <hr />

    {/* Add Relationship Section */}
    <input
      type="text"
      placeholder="Node 1"
      value={node1}
      onChange={(e) => setNode1(e.target.value)}
    />
    <input
      type="text"
      placeholder="Node 2"
      value={node2}
      onChange={(e) => setNode2(e.target.value)}
    />
    <input
      type="text"
      placeholder="Relationship Type"
      value={relationshipType}
      onChange={(e) => setRelationshipType(e.target.value)}
    />
    <button className="dropup-button" onClick={() => handleAddRelationship(node1, node2, relationshipType)}>
      Add Relationship
    </button>
  </div>
)}


    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button-container {
    display: flex;
    background-color: rgba(120, 20, 20, 0.75);
    width: 600px; /* Increased width for a longer button bar */
    height: 80px;
    align-items: center;
    justify-content: space-around;
    border-radius: 20px;
    padding: 10px;
  }

  .button {
    outline: 0 !important;
    border: 0 !important;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all ease-in-out 0.3s;
    cursor: pointer;
  }

  .button:hover {
    transform: translateY(-3px);
  }

  .icon {
    font-size: 32px;
    color: white;
  }

  /* Dropup Menu */
  .dropup-menu {
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 9999;
    backdrop-filter: blur(10px);
    width: 260px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  }

  .dropup-title {
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 5px;
  }

  .dropup-label {
    color: white;
    font-size: 0.9rem;
    font-weight: 500;
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
    background: white;
    color: rgba(120, 20, 20, 1);
    font-weight: bold;
    border: none;
    padding: 10px;
    cursor: pointer;
    transition: 0.2s ease;
    text-align: center;
    width: 100%;
    border-radius: 5px;
  }

  .dropup-button:hover {
    background: rgba(255, 255, 255, 0.8);
  }
`;

export default ButtonBar;
