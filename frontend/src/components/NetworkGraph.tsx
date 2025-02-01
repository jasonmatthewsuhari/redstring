import React, { useRef, useEffect, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_CSE_ID = import.meta.env.VITE_GOOGLE_CSE_ID;

const SEARCH_ENGINE_URL = `https://www.googleapis.com/customsearch/v1`;
const placeholderImage = "https://via.placeholder.com/150"; // Default fallback image

const NetworkGraph: React.FC = () => {
  const fgRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [imageCache, setImageCache] = useState<Record<string, string>>({});

  useEffect(() => {
    if (fgRef.current) {
      const graph = fgRef.current;
      graph.d3Force("charge").strength(-12);
      graph.d3Force("link").distance(40);

      // Add Background Stars
      const scene = graph.scene();
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
      });

      const starVertices = [];
      for (let i = 0; i < 500; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
      }

      starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
      const starField = new THREE.Points(starGeometry, starMaterial);
      scene.add(starField);
    }
  }, []);

  // Fetch image from Google Custom Search API
  const fetchImage = async (query: string) => {
    if (imageCache[query]) return imageCache[query];

    try {
      const response = await fetch(
        `${SEARCH_ENGINE_URL}?q=${encodeURIComponent(query)}&cx=${GOOGLE_CSE_ID}&key=${GOOGLE_API_KEY}&searchType=image&num=1`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const imageUrl = data.items[0].link;
        setImageCache((prev) => ({ ...prev, [query]: imageUrl }));
        return imageUrl;
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
    return placeholderImage;
  };

  // Handle node click
  const handleNodeClick = async (node: any, event: MouseEvent) => {
    event.stopPropagation();

    setSelectedNode({
      ...node,
      image: await fetchImage(`${node.name} ${node.category}`),
    });

    fgRef.current.cameraPosition(
      { x: node.x, y: node.y, z: node.z + 100 },
      { x: node.x, y: node.y, z: node.z },
      1000
    );
  };

  // Close dropdown when clicking outside
  const handleBackgroundClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedNode(null);
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center relative">
      <div className="absolute inset-0" onClick={handleBackgroundClick}></div>

      <ForceGraph3D
        ref={fgRef}
        graphData={{
          nodes: [
            { id: "1", name: "Alice", category: "small", age: 25, occupation: "Engineer" },
            { id: "2", name: "Bob", category: "medium", age: 30, occupation: "Designer" },
            { id: "3", name: "Charlie", category: "large", age: 35, occupation: "Doctor" },
            { id: "4", name: "David", category: "medium", age: 28, occupation: "Teacher" },
            { id: "5", name: "Eve", category: "small", age: 22, occupation: "Student" }
          ],
          links: [
            { source: "1", target: "2", category: "friendly" },
            { source: "3", target: "4", category: "hostile" },
            { source: "4", target: "5", category: "friendly" }
          ]
        }}
        enableNodeDrag={true}
        cooldownTicks={Infinity}
        nodeRelSize={2}
        linkWidth={0.5}
        linkColor={(link: { category?: string }) =>
          ({ friendly: "rgba(0, 255, 0, 0.8)", hostile: "rgba(255, 0, 0, 0.8)" }[link.category || "small"]) || "red"
        }
        linkMaterial={(link: { category?: string }) => {
          const color = ({ friendly: "rgba(0, 255, 0, 0.8)", hostile: "rgba(255, 0, 0, 0.8)" }[link.category || "small"]) || "red";

          return new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.8,
            depthWrite: false
          });
        }}
        nodeThreeObjectExtend={true}
        nodeThreeObject={(node: { id: string; category?: string }) => {
          const baseGeometry = new THREE.SphereGeometry({ small: 3, medium: 5, large: 8 }[node.category || "small"], 16, 16);

          // Inner white node
          const baseMaterial = new THREE.MeshStandardMaterial({
            color: "white",
            emissive: "white",
            emissiveIntensity: 0.4
          });

          const sphere = new THREE.Mesh(baseGeometry, baseMaterial);

          if (selectedNode?.id === node.id) {
            // Outer blue glow outline
            const outlineGeometry = new THREE.SphereGeometry(
              { small: 3.5, medium: 5.5, large: 8.5 }[node.category || "small"], 
              16, 
              16
            );
            const outlineMaterial = new THREE.MeshBasicMaterial({
              color: "lightblue",
              transparent: true,
              opacity: 0.6,
              side: THREE.BackSide,
            });

            const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
            sphere.add(outline); // Add outline to the node
          }

          return sphere;
        }}
        onNodeClick={handleNodeClick}
      />

      {/* Dropdown Menu - Fixed at Top Right with Margin */}
      {selectedNode && (
        <div
          className="absolute top-20 right-10 bg-white shadow-md rounded-md p-4 text-gray-900 w-64"
          onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking inside
        >
          {/* Dynamic Image */}
          <div className="w-full h-24 bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">
            <img src={selectedNode.image} alt={selectedNode.name} className="w-full h-full object-cover" />
          </div>

          {/* Node Details */}
          <h3 className="font-bold text-lg mt-3">{selectedNode.name}</h3>
          <ul className="text-sm text-gray-600 mt-2">
            <li>
              <span className="font-semibold">Identifier:</span> {selectedNode.id}
            </li>
            <li>
              <span className="font-semibold">Category:</span> {selectedNode.category}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NetworkGraph;
