import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Download, ChartNetwork, Filter, Plus } from "lucide-react";
import { generateEntityHash } from "../public/generateEntityHash";

interface ButtonBarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filters: {
    clusterSize: number;
    selectedCategories: string[];
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      clusterSize: number;
      selectedCategories: string[];
    }>
  >;
  relationNodes: { node1: string; node2: string };
  setRelationNodes: React.Dispatch<
    React.SetStateAction<{ node1: string; node2: string }>
  >;

  // Make sure your Graph or NetworkGraph passes this prop down
  focusOnNode: (nodeName: string) => void;
}

const API_BASE_URL = "https://redstring-45l8.onrender.com"; // Update if needed

const ButtonBar: React.FC<ButtonBarProps> = ({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  relationNodes,
  setRelationNodes,
  // Pull in focusOnNode
  focusOnNode,
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showRelationSearch, setShowRelationSearch] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const plusButtonRef = useRef<HTMLButtonElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const relationButtonRef = useRef<HTMLButtonElement>(null);
  const relationSearchRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const [newEntity, setNewEntity] = useState("");
  const [newRelation, setNewRelation] = useState({
    source: "",
    type: "",
    target: "",
  });

  // Capture Enter press in search bar
  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchQuery.trim()) {
      focusOnNode(searchQuery.trim());
    }
  };

  const [loading, setLoading] = useState(false);

  // ──────────────────────────────────────────────────────────
  // Toggle logic & outside-click detection
  // ──────────────────────────────────────────────────────────
  const toggleAddMenu = () => {
    setShowAddMenu((prev) => !prev);
    setShowRelationSearch(false);
    setShowFilterOptions(false);
  };
  const toggleRelationSearch = () => {
    setShowRelationSearch((prev) => !prev);
    setShowAddMenu(false);
    setShowFilterOptions(false);
  };
  const toggleFilter = () => {
    setShowFilterOptions((prev) => !prev);
    setShowAddMenu(false);
    setShowRelationSearch(false);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;

      if (
        showAddMenu &&
        addMenuRef.current &&
        !addMenuRef.current.contains(target) &&
        plusButtonRef.current &&
        !plusButtonRef.current.contains(target)
      ) {
        setShowAddMenu(false);
      }
      if (
        showRelationSearch &&
        relationSearchRef.current &&
        !relationSearchRef.current.contains(target) &&
        relationButtonRef.current &&
        !relationButtonRef.current.contains(target)
      ) {
        setShowRelationSearch(false);
      }
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
  }, [showAddMenu, showRelationSearch, showFilterOptions]);

  // ──────────────────────────────────────────────────────────
  // API Calls
  // ──────────────────────────────────────────────────────────
  const addEntity = async () => {
    if (!newEntity.trim() || loading) {
      if (!newEntity.trim()) alert("Enter an entity name.");
      return;
    }
    setLoading(true);

    try {
      const entityId = generateEntityHash(newEntity);
      const response = await fetch(
        `${API_BASE_URL}/entities/?identifier=${encodeURIComponent(entityId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ metadata: { name: newEntity } }),
        }
      );

      if (!response.ok) {
        console.error("❌ Failed to add entity:", await response.text());
        throw new Error("Failed to create entity.");
      }

      alert(`✅ Entity "${newEntity}" added successfully!`);
      setNewEntity("");
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addRelationship = async () => {
    const { source, type, target } = newRelation;
    if (!source.trim() || !type.trim() || !target.trim() || loading) {
      if (!source.trim() || !type.trim() || !target.trim()) {
        alert("Fill in all fields for the relationship.");
      }
      return;
    }

    setLoading(true);
    const relationshipData = {
      source_id: source,
      target_id: target,
      rel_type: type,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/relationships/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(relationshipData),
      });

      if (!response.ok) {
        throw new Error("Failed to create relationship.");
      }

      alert(`✅ Relationship added: ${source} → ${type} → ${target}`);
      setNewRelation({ source: "", type: "", target: "" });
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ──────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────
  return (
    <StyledWrapper>
      <div className="button-container">
        {/* PLUS BUTTON & DROP-UP (Add Entity / Relationship) */}
        <div className="tooltip-container plus-container">
          <button
            ref={plusButtonRef}
            className={`button ${showAddMenu ? "active" : ""}`}
            onClick={toggleAddMenu}
          >
            <Plus className="grabbyHands" />
          </button>
          <span className="tooltip">Add Entity / Relationship</span>

          {showAddMenu && (
            <div ref={addMenuRef} className="dropup-menu plus-dropup-menu">
              {/* Add Entity Section */}
              <div>
                <label className="dropup-label">Add New Entity</label>
                <input
                  type="text"
                  className="dropup-input"
                  placeholder="Entity Name"
                  value={newEntity}
                  onChange={(e) => setNewEntity(e.target.value)}
                />
                <button
                  className="dropup-button"
                  onClick={addEntity}
                  disabled={loading}
                >
                  Add Entity
                </button>
              </div>

              <hr style={{ opacity: 0.2 }} />

              {/* Add Relationship Section */}
              <div>
                <label className="dropup-label">Link Two Entities</label>
                <input
                  type="text"
                  className="dropup-input"
                  placeholder="Relationship Source"
                  value={newRelation.source}
                  onChange={(e) =>
                    setNewRelation({ ...newRelation, source: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="dropup-input"
                  placeholder="Relationship Type"
                  value={newRelation.type}
                  onChange={(e) =>
                    setNewRelation({ ...newRelation, type: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="dropup-input"
                  placeholder="Relationship Target"
                  value={newRelation.target}
                  onChange={(e) =>
                    setNewRelation({ ...newRelation, target: e.target.value })
                  }
                />
                <button
                  className="dropup-button"
                  onClick={addRelationship}
                  disabled={loading}
                >
                  Add Relationship
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SEARCH BAR + Enter Key to Focus on Node */}
        <div className="tooltip-container">
          <input
            type="text"
            placeholder="Search for an entity..."
            className="search-input"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                focusOnNode(searchQuery.trim());
              }
            }}
          />
          <span className="tooltip">Searching for Something?</span>
        </div>

        {/* "FIND CLOSEST RELATION" BUTTON + DROP-UP */}
        <div className="tooltip-container">
          <button
            ref={relationButtonRef}
            className={`button ${showRelationSearch ? "active" : ""}`}
            onClick={toggleRelationSearch}
          >
            <ChartNetwork className="grabbyHands" />
          </button>
          <span className="tooltip">Find Closest Relation</span>

          {showRelationSearch && (
            <div ref={relationSearchRef} className="dropup-menu">
              <input
                type="text"
                placeholder="Node 1"
                className="dropup-input"
                value={relationNodes.node1}
                onChange={(e) =>
                  setRelationNodes({ ...relationNodes, node1: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Node 2"
                className="dropup-input"
                value={relationNodes.node2}
                onChange={(e) =>
                  setRelationNodes({ ...relationNodes, node2: e.target.value })
                }
              />
              <button className="dropup-button">Search</button>
            </div>
          )}
        </div>

        {/* FILTER BUTTON + DROP-UP */}
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
              <label className="dropup-label">Cluster Size</label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={filters.clusterSize}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    clusterSize: Number(e.target.value),
                  })
                }
              />

              <label className="dropup-label">Show Only Categories:</label>
              <select
                multiple
                value={filters.selectedCategories}
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setFilters({ ...filters, selectedCategories: values });
                }}
                className="dropup-select"
              >
                <option value="friendly">Friendly</option>
                <option value="hostile">Hostile</option>
                <option value="business">Business</option>
                <option value="geographical">Geographical</option>
              </select>

              <button className="dropup-button">Apply Filters</button>
            </div>
          )}
        </div>

        {/* DOWNLOAD (Stub) */}
        <div className="tooltip-container">
          <Download className="grabbyHands" />
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
  width: 95%;
  max-width: 1000px;
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
    width: 75px;
    height: 75px;
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
    white-space: nowrap;
  }

  .tooltip-container:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }

  .search-input {
    width: 160px;
    padding: 8px;
    border-radius: 10px;
    border: none;
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    text-align: center;
  }

  .search-input::placeholder {
    color: #ccc;
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

  .dropup-select {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: white;
    padding: 8px;
    border-radius: 5px;
    width: 100%;
    outline: none;
    margin-bottom: 6px;
  }
`;

export default ButtonBar;
