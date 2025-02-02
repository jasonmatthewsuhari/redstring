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

  // 🆕 Function to focus on a node by name
  const focusOnNode = (nodeName: string) => {
    if (!fgRef.current) return;

    // ✅ Correctly access graph data
    const graph = fgRef.current;
    const { nodes } = graph.graphData(); // ✅ Ensure correct access

    if (!nodes || nodes.length === 0) return;
    
    const node = nodes.find((n: any) => n.name.toLowerCase() === nodeName.toLowerCase());

    if (node) {
      graph.cameraPosition(
        { x: node.x, y: node.y, z: node.z + 100 }, // Adjust distance
        { x: node.x, y: node.y, z: node.z },
        1000 // Smooth transition
      );
    }
  };

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
          focusOnNode={focusOnNode} // ✅ Pass function to focus on a node
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
          focusOnNode={focusOnNode} // ✅ Pass function to ButtonBar
        />
      </div>
    </div>
  );
};

export default Graph;
