import React, { useState, useRef } from "react";
import Header from "../components/Header";
import ButtonBar from "../components/ButtonBar";
import NetworkGraph from "../components/NetworkGraph";
import DotBackground from "../components/DotBackground";
import { ForceGraphMethods } from "react-force-graph-3d"; // ✅ Import for proper typing

const Graph: React.FC = () => {
  //
  // ────────────────────────────────────────────────────────────
  //   1) LIFT SHARED STATE HERE (search, filters, relationNodes)
  // ────────────────────────────────────────────────────────────
  //
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    clusterSize: 5,
    selectedCategories: [] as string[],
  });
  const [relationNodes, setRelationNodes] = useState({ node1: "", node2: "" });

  // 🆕 Create a reference to ForceGraph3D
  const fgRef = useRef<ForceGraphMethods | null>(null);

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <DotBackground />
      </div>

      <div className="relative z-10">
        <Header />
      </div>

      {/* 
        2) Pass ref to NetworkGraph so it can manage focus
      */}
      <div className="relative z-10">
        <NetworkGraph
          fgRef={fgRef} // ✅ Pass graph ref to NetworkGraph
          searchQuery={searchQuery}
          filters={filters}
          relationNodes={relationNodes}
        />
      </div>

      {/* 
        3) Pass focusOnNode to ButtonBar so user searches can trigger node focus
      */}
      <div className="relative z-10">
        <ButtonBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilters={setFilters}
          relationNodes={relationNodes}
          setRelationNodes={setRelationNodes}
        />
      </div>
    </div>
  );
};

export default Graph;
