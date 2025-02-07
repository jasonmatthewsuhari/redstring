import React, { useState, useRef } from "react";
import Header from "../components/Header";
import NetworkGraph from "../components/NetworkGraph";
import DotBackground from "../components/DotBackground";
import { ForceGraphMethods } from "react-force-graph-3d"; // ✅ Import for proper typing

const Graph: React.FC = () => {
  // 🆕 Create a reference to ForceGraph3D
  const fgRef = useRef<ForceGraphMethods | null>(null);

  const searchQuery = "";
  const relationNodes = {
    node1: "",
    node2: ""
  }

  // ✅ Corrected filters state to match `NetworkGraphProps`
  const [filters, setFilters] = useState({
    minAffiliations: 0,
    maxAffiliations: 10,
    minFrequency: 0,
    maxFrequency: 100,
    name: "",
    minYear: 2000,
    maxYear: 2025
  });

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <DotBackground />
      </div>

      <div className="relative z-10">
        <Header />
      </div>

      <NetworkGraph
        fgRef={fgRef}
        searchQuery={searchQuery}
        filters={filters}
        setFilters={setFilters}
        relationNodes={relationNodes}
      />
    </div>
  );
};

export default Graph;
