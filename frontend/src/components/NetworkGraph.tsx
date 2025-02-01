import React, { useEffect, useState, useRef } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import { generateEntityHash } from "../utils/generateEntityHash"; // ✅ Import TypeScript hash function

const API_BASE_URL = "http://127.0.0.1:8000"; // Change if using deployed API
const ENTITIES_ENDPOINT = `${API_BASE_URL}/entities/`;

const NetworkGraph: React.FC = () => {
  const fgRef = useRef<any>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        console.log("📥 Fetching Entities from API...");
        const response = await fetch(ENTITIES_ENDPOINT);
        if (!response.ok) throw new Error("Failed to fetch entities");

        const data = await response.json();
        console.log("📌 RAW API Response:", data);

        const nodesArray: any[] = [];
        const linksArray: any[] = [];
        const nameToId: Record<string, string> = {};

        // ✅ Step 1: Populate nodes first
        data.forEach((entity: any) => {
          const { identifier, metadata } = entity;
          if (!metadata?.name) return;

          nodesArray.push({ identifier, name: metadata.name });
          nameToId[metadata.name.toLowerCase()] = identifier;
        });

        console.log("✅ Processed Nodes:", nodesArray);
        console.log("📌 Name-to-ID Mapping:", nameToId);

        // ✅ Step 2: Ensure nodes are fully set before processing links
        setNodes(nodesArray); // 🔥 Set nodes first

        setTimeout(() => {
          console.log("🔗 Processing Relationships after Nodes are Set...");

          data.forEach((entity: any) => {
            const { metadata } = entity;
            if (!metadata?.affiliations) return;

            metadata.affiliations.forEach((aff: any) => {
              const targetName = aff.entity.toLowerCase();
              console.log(`🔍 Checking relation: ${metadata.name} → ${aff.entity}`);

              if (!(targetName in nameToId)) {
                console.warn(`⚠️ Missing entity found: ${aff.entity}`);
                const generatedId = generateEntityHash(aff.entity);
                nodesArray.push({ identifier: generatedId, name: aff.entity });
                nameToId[targetName] = generatedId;
              } else {
                console.log(
                  `✅ Found existing entity for relation: ${metadata.name} → ${aff.entity} (ID: ${nameToId[targetName]})`
                );
              }

              linksArray.push({
                source: nameToId[metadata.name.toLowerCase()],
                target: nameToId[targetName],
                category: aff.category,
                score: aff.score,
              });
            });
          });

          console.log("🔗 Final Relationships:", linksArray);

          // ✅ Ensure nodes exist before setting links
          setLinks(linksArray);
          setLoading(false);
        }, 500); // 🔥 Small delay to ensure nodes are in state

      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchEntities();
  }, []);

  // Handle node click
  const handleNodeClick = (node: any, event: MouseEvent) => {
    event.stopPropagation();
    setSelectedNode(node);

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

  if (loading) return <div className="text-white text-center">Loading graph...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

  console.log("🚀 Rendering ForceGraph3D");
  console.log("📌 FINAL Nodes:", nodes);
  console.log("🔗 FINAL Links:", links);

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center relative">
      <div className="absolute inset-0" onClick={handleBackgroundClick}></div>

      {nodes.length > 0 && links.length > 0 && ( // ✅ Only render graph if data exists
        <ForceGraph3D
          ref={fgRef}
          graphData={{ nodes, links }}
          // 🔥 Configure the ID fields to match your node/link properties
          nodeId="identifier"
          linkSource="source"
          linkTarget="target"
          enableNodeDrag={true}
          cooldownTicks={Infinity}
          nodeRelSize={2}
          linkWidth={0.5}
          linkColor={(link: { category?: string }) =>
            ({
              friendly: "rgba(0, 255, 0, 0.8)",
              hostile: "rgba(255, 0, 0, 0.8)",
              business: "rgba(0, 0, 255, 0.8)",
            }[link.category || "business"]) || "gray"
          }
          linkMaterial={(link: { category?: string }) => {
            const color =
              ({
                friendly: "rgba(0, 255, 0, 0.8)",
                hostile: "rgba(255, 0, 0, 0.8)",
                business: "rgba(0, 0, 255, 0.8)",
              }[link.category || "business"]) || "gray";

            return new THREE.LineBasicMaterial({
              color,
              transparent: true,
              opacity: 0.8,
              depthWrite: false,
            });
          }}
          onNodeClick={handleNodeClick}
        />
      )}
    </div>
  );
};

export default NetworkGraph;
