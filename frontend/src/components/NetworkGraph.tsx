import React, { useRef, useEffect } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";

const NetworkGraph: React.FC = () => {
  const fgRef = useRef<any>(null);

  // Define mappings
  const NODE_SIZES: Record<string, number> = {
    small: 3,
    medium: 5,
    large: 8
  };

//   const NODE_COLORS: Record<string, string> = {
//     small: "blue",
//     medium: "green",
//     large: "purple"
//   };

  const EDGE_COLORS: Record<string, string> = {
    small: "gray",
    medium: "black",
    large: "white"
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
      { source: "1", target: "2", category: "small" },
      { source: "3", target: "4", category: "large" },
      { source: "4", target: "5", category: "medium" }
    ]
  };

  // Spread out the graph more
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force("charge").strength(-200); // Pushes nodes apart
    }
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        enableNodeDrag={true}
        cooldownTicks={0} // Stops auto-movement
        onEngineStop={() => fgRef.current?.zoomToFit(400)} // Fit view on load
        nodeRelSize={2} // Node base size
        linkWidth={2} // Thicker links
        linkColor={(link: { category?: string }) =>
          EDGE_COLORS[link.category || "small"] || "red"
        }
        linkMaterial={(link: { category?: string }) => {
          return new THREE.LineDashedMaterial({
            color: EDGE_COLORS[link.category || "small"] || "red",
            dashSize: 3,
            gapSize: 2
          });
        }}
        nodeThreeObjectExtend={true}
        nodeThreeObject={(node: { category?: string }) => {
          const size = NODE_SIZES[node.category || "small"];
          const color = "#010010"; // Fill color

          // Create dark blue sphere (inner node)
          const geometry = new THREE.SphereGeometry(size, 16, 16);
          const material = new THREE.MeshBasicMaterial({ color: color });
          const sphere = new THREE.Mesh(geometry, material);

          // Create white outline
          const outlineGeometry = new THREE.SphereGeometry(size * 1.2, 16, 16);
          const outlineMaterial = new THREE.MeshBasicMaterial({
            color: "white",
            side: THREE.BackSide // Makes sure outline is visible outside
          });
          const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);

          sphere.add(outline); // Attach outline to sphere

          return sphere;
        }}
      />
    </div>
  );
};

export default NetworkGraph;
