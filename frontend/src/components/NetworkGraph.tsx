import React, { useRef, useEffect } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import SpriteText from "three-spritetext";

const NetworkGraph: React.FC = () => {
  const fgRef = useRef<any>(null);

  // Define mappings
  const NODE_SIZES: Record<string, number> = {
    small: 3,
    medium: 5,
    large: 8
  };
  const EDGE_COLORS: Record<string, string> = {
    friendly: "green",
    hostile: "red"
  };

  const data = {
    nodes: [
      { id: "1", name: "Alice", category: "small" },
      { id: "2", name: "Bob", category: "medium" },
      { id: "3", name: "Charlie", category: "large" },
      { id: "4", name: "David", category: "medium" },
      { id: "5", name: "Eve", category: "small" }
    ],
    links: [
      { source: "1", target: "2", category: "friendly" },
      { source: "3", target: "4", category: "friendly" },
      { source: "4", target: "5", category: "hostile" }
    ]
  };

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force("charge").strength(-200); // Spread out nodes
    }
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        enableNodeDrag={true}
        cooldownTicks={0} // No auto-movement
        onEngineStop={() => fgRef.current?.zoomToFit(400)} // Fit view on load
        nodeRelSize={2} // Smaller node size
        linkWidth={2} // Solid links
        linkColor={(link) => EDGE_COLORS[link.category] || "red"} // Color based on category
        linkMaterial={(link) => {
          const material = new THREE.LineDashedMaterial({
            color: EDGE_COLORS[link.category] || "red",
            dashSize: 3,
            gapSize: 2
          });
          return material;
        }}
        nodeThreeObjectExtend={true}
        nodeThreeObject={(node) => {
          const size = NODE_SIZES[node.category] || 3;
          const color = "white";

          const geometry = new THREE.SphereGeometry(size, 16, 16);
          const material = new THREE.MeshBasicMaterial({ color: color });
          return new THREE.Mesh(geometry, material);
        }}
      />
    </div>
  );
};

export default NetworkGraph;
