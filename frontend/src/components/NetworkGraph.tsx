import React, { useEffect, useState, useRef } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import { generateEntityHash } from "../utils/generateEntityHash"; // Example utility

const API_BASE_URL = "http://127.0.0.1:8000";
const ENTITIES_ENDPOINT = `${API_BASE_URL}/entities/`;

const NetworkGraph: React.FC = () => {
  const fgRef = useRef<any>(null);

  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep track of selected node
  const [selectedNode, setSelectedNode] = useState<any>(null);
  // Track whether the user is dragging a node
  const [isDragging, setIsDragging] = useState(false);

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

        // 1️⃣ Build node list first
        data.forEach((entity: any) => {
          const { identifier, metadata } = entity;
          if (!metadata?.name) return;

          // Store entire metadata for dropdown usage
          nodesArray.push({ identifier, name: metadata.name, metadata });
          nameToId[metadata.name.toLowerCase()] = identifier;
        });

        setNodes(nodesArray);

        // 2️⃣ Build links after nodes
        setTimeout(() => {
          data.forEach((entity: any) => {
            const { metadata } = entity;
            if (!metadata?.affiliations) return;

            metadata.affiliations.forEach((aff: any) => {
              const targetName = aff.entity.toLowerCase();
              if (!(targetName in nameToId)) {
                // Create node if it doesn't exist
                const generatedId = generateEntityHash(aff.entity);
                nodesArray.push({
                  identifier: generatedId,
                  name: aff.entity,
                  metadata: { name: aff.entity, affiliations: [] },
                });
                nameToId[targetName] = generatedId;
              }

              linksArray.push({
                source: nameToId[metadata.name.toLowerCase()],
                target: nameToId[targetName],
                category: aff.category, // e.g. 'friendly', 'hostile', 'business', etc.
                score: aff.score,
              });
            });
          });

          setLinks(linksArray);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchEntities();
  }, []);

  // Handle node click: highlight node + show dropdown
  const handleNodeClick = (node: any, event: MouseEvent) => {
    event.stopPropagation();

    // Only center camera if NOT dragging
    if (!isDragging) {
      // Smooth camera transition
      fgRef.current.cameraPosition(
        { x: node.x, y: node.y, z: node.z + 100 }, // new position
        { x: node.x, y: node.y, z: node.z },      // lookAt ({ x, y, z })
        1000                                      // ms transition duration
      );
    }

    setSelectedNode(node);
  };

  // Handle background click: close dropdown
  const handleBackgroundClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedNode(null);
  };

  // Custom node object to achieve white sphere + glowing outline on selected node
  const renderNode = (node: any) => {
    const group = new THREE.Group();

    // Base white sphere
    const sphereGeom = new THREE.SphereGeometry(7, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0, // more matte
      roughness: 0.5,
    });
    const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
    group.add(sphereMesh);

    // If node is selected, add a soft "glow" outline
    if (selectedNode && selectedNode.identifier === node.identifier) {
      // Slightly larger sphere with translucent blue
      const outlineGeom = new THREE.SphereGeometry(8.5, 16, 16);
      const outlineMat = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.35,
        side: THREE.BackSide, // flip normals for inside-out effect
      });
      const outlineMesh = new THREE.Mesh(outlineGeom, outlineMat);
      group.add(outlineMesh);
    }

    return group;
  };

  // Link color map
  // Adjust the hex codes and default if needed
  const getLinkColor = (link: any) => {
    switch (link.category) {
      case "friendly":      return "#00FF00"; // green
      case "hostile":       return "#FF0000"; // red
      case "business":      return "#0000FF"; // blue
      case "geographical":  return "#FFD700"; // gold/yellow
      case "neutral":
      default:
        return "#CCCCCC"; // default gray
    }
  };

  // Format affiliations: e.g. "Friend of Jason (+0.7 friendly)"
  const formatAffiliation = (aff: any): string => {
    let verb;
    switch (aff.category) {
      case "friendly":
        verb = "Friend of";
        break;
      case "hostile":
        verb = "Rival to";
        break;
      case "business":
        verb = "Partner with";
        break;
      case "geographical":
        verb = "Location linking to";
        break;
      default:
        verb = "Affiliation with";
        break;
    }
    return `${verb} ${aff.entity} (${aff.score} ${aff.category})`;
  };

  // Listen for drag events to avoid camera recentering
  const handleNodeDrag = () => setIsDragging(true);
  const handleNodeDragEnd = () => setTimeout(() => setIsDragging(false), 50);

  if (loading) {
    return <div className="text-white text-center">Loading graph...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center relative">
      {/* Background overlay to capture clicks that close the dropdown */}
      <div className="absolute inset-0" onClick={handleBackgroundClick}></div>

      {nodes.length > 0 && links.length > 0 && (
        <ForceGraph3D
          ref={fgRef}
          graphData={{ nodes, links }}
          nodeId="identifier"
          linkSource="source"
          linkTarget="target"
          nodeThreeObject={renderNode}
          nodeThreeObjectExtend={true}
          onNodeClick={handleNodeClick}
          // Closer distance between nodes
          linkDistance={30}
          // Color-coded links with partial transparency
          linkMaterial={(link: any) =>
            new THREE.LineBasicMaterial({
              color: getLinkColor(link),
              transparent: true,
              opacity: 0.35,
              depthWrite: false,
            })
          }
          // Drag events to manage camera skip
          onNodeDrag={handleNodeDrag}
          onNodeDragEnd={handleNodeDragEnd}
          enableNodeDrag={true}
          cooldownTicks={200}
          onEngineStop={() => fgRef.current.zoomToFit(400)}
        />
      )}

      {/* Dropdown in top-right corner */}
      {selectedNode && (
        <div className="absolute top-4 right-4 w-64 bg-white text-black rounded-lg p-4 shadow-lg pointer-events-auto">
          <h2 className="font-bold text-lg mb-2">{selectedNode.name}</h2>
          {selectedNode.metadata?.affiliations?.length > 0 && (
            <ul className="list-none space-y-1">
              {selectedNode.metadata.affiliations.map((aff: any, idx: number) => (
                <li key={idx}>{formatAffiliation(aff)}</li>
              ))}
            </ul>
          )}
          {/* Example: display other metadata */}
          {selectedNode.metadata && (
            <div className="mt-2 text-sm">
              <strong>Other info:</strong>{" "}
              {JSON.stringify(selectedNode.metadata, null, 2)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NetworkGraph;
