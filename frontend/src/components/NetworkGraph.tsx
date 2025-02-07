import React, { useEffect, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import { ConvexHull } from 'three/addons/math/ConvexHull.js';
import * as THREE from "three";
import { generateEntityHash } from "../utils/generateEntityHash";
import ButtonBar from "./ButtonBar";
import { X } from "lucide-react";

/* ------------------------------------------
   1) Reintroduce LLM-related constants & functions
------------------------------------------ */
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY || "";

// The generateNarrative function from before
async function generateNarrative(affiliations: string[], entityName: string): Promise<string> {
  if (!entityName) entityName = "this entity"; // fallback

  const prompt = `
  The following affiliations belong to ${entityName}. Summarize them into a meaningful narrative with context:

  ${affiliations.join("\n")}

  Provide an insightful analysis. Do NOT include generic examples or made-up affiliations.
  `;

  console.log("📝 Sending Prompt to LLM:", prompt); // Debugging log

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-alpha`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

    const data = await response.json();
    console.log("🧠 LLM Response:", data); // Debugging log

    return data[0]?.generated_text?.trim() || "Unable to generate a meaningful narrative.";
  } catch (error) {
    console.error("LLM Error:", error);
    return "Failed to generate a narrative.";
  }
}
/* ------------------------------------------
   End of LLM section
------------------------------------------ */

const API_BASE_URL = "http://127.0.0.1:8000"; // TODO: change this back to https://redstring-45l8.onrender.com

type ImageCache = Record<string, string>;
let imageCache: ImageCache = {};

function isValidHttpUrl(link: string) {
  return link.startsWith("http://") || link.startsWith("https://");
}

async function fetchImage(query: string): Promise<string> {
  if (imageCache[query]) {
    return imageCache[query];
  }

  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const GOOGLE_CSE_ID = import.meta.env.VITE_GOOGLE_CSE_ID;
  const SEARCH_ENGINE_URL = `https://www.googleapis.com/customsearch/v1`;

  try {
    console.log(`🔍 Fetching image for: ${query}`);

    const response = await fetch(
      `${SEARCH_ENGINE_URL}?q=${encodeURIComponent(query)}&cx=${GOOGLE_CSE_ID}&key=${GOOGLE_API_KEY}&searchType=image&num=1`
    );

    if (!response.ok) {
      throw new Error(`❌ API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📸 Google Image Search Response:", data);

    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        const link = item.link || "";
        if (isValidHttpUrl(link)) {
          imageCache[query] = link;
          return link;
        }
      }
      console.warn(`⚠️ No valid HTTP/HTTPS image found for: ${query}`);
    } else {
      console.warn(`⚠️ No images found for: ${query}`);
    }
  } catch (error) {
    console.error("🛑 Google Image Search Failed:", error);
  }

  return "https://placekitten.com/100/100";
}

const categoryColorMap: Record<string, string> = {
  friendly: "text-green-500",
  hostile: "text-red-500",
  business: "text-blue-500",
  geographical: "text-yellow-500",
  neutral: "text-gray-500",
};

interface NetworkGraphProps {
  fgRef: React.MutableRefObject<any>;
  searchQuery: string;
  filters: {
    minAffiliations: number;
    maxAffiliations: number;
    minFrequency: number;
    maxFrequency: number;
    name: string;
    minYear: number;
    maxYear: number;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      minAffiliations: number;
      maxAffiliations: number;
      minFrequency: number;
      maxFrequency: number;
      name: string;
      minYear: number;
      maxYear: number;
    }>
  >;
  relationNodes: { node1: string; node2: string };
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({
  fgRef,
  searchQuery,
  filters,
  setFilters,
}) => {
  useEffect(() => {
    if (fgRef && fgRef.current) {
      console.log("🔄 [NetworkGraph] Graph Ref Updated!");
    }
  }, [fgRef]);

  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedNodes, setSelectedNodes] = useState<any[]>([]);

  const [isSelecting, setIsSelecting] = useState(false);

  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [selectedNodeImage, setSelectedNodeImage] = useState<string>("https://placekitten.com/100/100");

  // 🆕 ADDED: State for narrative & loading
  const [narrative, setNarrative] = useState<string>("");
  const [narrativeLoading, setNarrativeLoading] = useState<boolean>(false);

  // 🆕 ADDED: State for image modal
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    imageUrl: "",
  });

  const [convexHullMesh, setConvexHullMesh] = useState<THREE.LineSegments | null>(null);

  // const updateConvexHull = () => {
  //   console.log("Started");
  //   if (!fgRef.current) return;
  //   console.log("Updating cv hull");
  //   const graphScene = fgRef.current.scene();
  //   if (convexHullMesh) {
  //     graphScene.remove(convexHullMesh);
  //     console.log("Remove old hull");
  //    } // Remove old hull
  
  //   if (nodes.length < 4) {
  //     console.log("Not enough nodes to compute convex hull");
  //     return; // A convex hull requires at least 4 points in 3D
  //   }
  //   // Extract node positions
  //   const points = nodes.map((node) => new THREE.Vector3(node.x, node.y, node.z));
  
  //   // Compute convex hull
  //   const convexHull = new ConvexHull().setFromPoints(points);
  //   const hullEdges: THREE.Vector3[] = [];
  
  //   for (const face of convexHull.faces) {
  //     let edge = face.edge;
  //     do {
  //       hullEdges.push(edge.head().point.clone(), edge.tail().point.clone()); // Store edges
  //       edge = edge.next;
  //     } while (edge !== face.edge);
  //   }
  
  //   // Create line geometry
  //   const geometry = new THREE.BufferGeometry().setFromPoints(hullEdges);
  //   const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
  //   const hullMesh = new THREE.LineSegments(geometry, material);
  
  //   graphScene.add(hullMesh);
  //   setConvexHullMesh(hullMesh);
  //   console.log("Convex hull set");
  //   console.log("📍 Node positions after layout:", nodes);

  // };

  useEffect(() => {
    if (!searchQuery.trim()) return;
    console.log("🔎 [NetworkGraph] Searching for:", searchQuery);
    // ... implement highlight or filter
  }, [searchQuery]);

  useEffect(() => {
    if (fgRef.current) {
      // Cast to any to bypass TypeScript warnings if needed
      const fgInstance = fgRef.current as any;
      const chargeForce = fgInstance.d3Force('charge');
      if (chargeForce) {
        // Adjust the charge force strength; a value closer to zero means less repulsion
        chargeForce.strength(-20);
      }
    }
  }, [fgRef]);    

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const params = new URLSearchParams();
        if (filters.name) params.append("name", filters.name);
        params.append("min_affiliations", filters.minAffiliations.toString());
        params.append("max_affiliations", filters.maxAffiliations.toString());
        params.append("min_frequency", filters.minFrequency.toString());
        params.append("max_frequency", filters.maxFrequency.toString());
        params.append("min_year", filters.minYear.toString()); // ✅ Added min year filter
        params.append("max_year", filters.maxYear.toString()); // ✅ Added max year filter

        console.log("Fetching Entities with Filters:", params.toString());
  
        const response = await fetch(`${API_BASE_URL}/entities/filtered/?${params.toString()}`);
        const data = await response.json();
        console.log("API Response:", data);
  
        // Parse nodes
        const nodesArray: any[] = [];
        const linksArray: any[] = [];
        const nameToId: Record<string, string> = {};
  
        data.forEach((entity: any) => {
          const { identifier, metadata } = entity;
          if (!metadata?.name) return;
          nodesArray.push({ identifier, name: metadata.name, metadata });
          nameToId[metadata.name.toLowerCase()] = identifier;
        });
  
        // 🟢 Ensure links are only added for valid nodes
        setTimeout(() => {
          const validNodeIds = new Set(nodesArray.map(node => node.identifier));
  
          data.forEach((entity: any) => {
            const { metadata } = entity;
            if (!metadata?.affiliations) return;
  
            metadata.affiliations.forEach((aff: any) => {
              const targetName = aff.entity.toLowerCase();
              if (!(targetName in nameToId)) {
                const generatedId = generateEntityHash(aff.entity);
                if (!validNodeIds.has(generatedId)) {
                  nodesArray.push({
                    identifier: generatedId,
                    name: aff.entity,
                    metadata: { name: aff.entity, affiliations: [] },
                  });
                  validNodeIds.add(generatedId);
                }
                nameToId[targetName] = generatedId;
              }
  
              if (validNodeIds.has(nameToId[metadata.name.toLowerCase()]) && validNodeIds.has(nameToId[targetName])) {
                linksArray.push({
                  source: nameToId[metadata.name.toLowerCase()],
                  target: nameToId[targetName],
                  category: aff.category,
                  score: aff.score,
                });
              }
            });
          });
  
          setNodes(nodesArray); // Make sure nodes are updated first
          setLinks(linksArray); // Now safely update links
          setLoading(false);
        }, 500);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };
  
    fetchEntities();
  }, [filters]); // Only one effect
  
  
  

  const handleNodeClick = async (node: any, event: MouseEvent) => {
    event.stopPropagation();

    if (!isDragging && fgRef.current) {
      fgRef.current.cameraPosition(
        { x: node.x, y: node.y, z: node.z + 100 },
        { x: node.x, y: node.y, z: node.z },
        1000
      );
    }

    if(isSelecting) {
      setSelectedNodes((prev) => {
        const exists = prev.some((n) => n.identifier === node.identifier);
        if (exists) {
          return prev.filter((n) => n.identifier !== node.identifier); // Remove if already selected
        } else {
          return [...prev, node]; // Add to the list
        }
      });
    }
  

    setSelectedNode(node);
    setNarrative("");
    setNarrativeLoading(false);

    const name = node?.name || "unknown subject";
    const imageUrl = await fetchImage(name);
    setSelectedNodeImage(imageUrl);
  };

  const handleBackgroundClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedNode(null);
    setSelectedNodeImage("https://placekitten.com/100/100");
    setNarrative("");
    setNarrativeLoading(false);
  };

  const handleNodeDrag = () => setIsDragging(true);
  const handleNodeDragEnd = () => setTimeout(() => setIsDragging(false), 50);

  const handleSnapshot = () => {
    if (fgRef.current) {
      const renderer = fgRef.current.renderer();
      const canvas = renderer.domElement;
  
      // Ensure the scene is fully rendered before capturing
      requestAnimationFrame(() => {
        const image = canvas.toDataURL("image/png");
  
        // Create a download link
        const link = document.createElement("a");
        link.href = image;
        link.download = "network_graph_snapshot.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        console.log("📸 Snapshot taken!");
      });
    }
  };
  
  
  

  const handleGenerateNarrative = async () => {
    if (!selectedNode || !selectedNode.metadata?.affiliations) return;

    const entityName = selectedNode.name || "this entity";
    const formattedAffiliations = selectedNode.metadata.affiliations.map((aff: any) => {
      const relation = aff.relation || `Affiliation with ${aff.entity}`;
      return `${relation} (${aff.score} ${aff.category})`;
    });

    if (formattedAffiliations.length === 0) {
      setNarrative("No strong affiliations found.");
      return;
    }

    setNarrativeLoading(true);
    setNarrative("Generating narrative...");

    const generatedText = await generateNarrative(formattedAffiliations, entityName);
    setNarrative(generatedText);
    setNarrativeLoading(false);
  };

  // Format an affiliation line
  const formatAffiliation = (aff: any): JSX.Element => {
    let verb;
    switch (aff.category) {
      case "friendly":
        verb = "Friendly with";
        break;
      case "hostile":
        verb = "Rival to";
        break;
      case "business":
        verb = "Business relation with";
        break;
      case "geographical":
        verb = "Located in/near";
        break;
      default:
        verb = "Neutral affiliation with";
        break;
    }

    const categoryClass = categoryColorMap[aff.category] || "text-gray-500";

    return (
      <span>
        {verb} {aff.entity}{" "}
        <span className={`${categoryClass} font-semibold`}>
          ({aff.score?.toFixed(2)} {aff.category})
        </span>
      </span>
    );
  };

  const renderNode = (node: any) => {
    const group = new THREE.Group();
  
    // Extract frequency from metadata and apply scaling
    const baseSize = 5;
    const frequency = node.metadata?.frequency ?? 1; // Default to 1 if missing
    const scaleFactor = 12; // Increase this to amplify size differences
    const nodeSize = baseSize + Math.log10(frequency + 1) * scaleFactor; 
  
    const sphereGeom = new THREE.SphereGeometry(nodeSize, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.5,
      opacity: 0.9,
      transparent: true,
    });
    const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
    group.add(sphereMesh);

    if (selectedNodes.some((n) => n.identifier === node.identifier)) {
      const outlineGeom = new THREE.SphereGeometry(nodeSize + 3, 32, 32);
      const outlineMat = new THREE.MeshBasicMaterial({
        color: 0x00ff00, // Green outline
        transparent: true,
        opacity: 0.5,
        side: THREE.BackSide,
      });
      const outlineMesh = new THREE.Mesh(outlineGeom, outlineMat);
      group.add(outlineMesh);
    }
  
    if (selectedNode && selectedNode.identifier === node.identifier) {
      const outlineGeom = new THREE.SphereGeometry(nodeSize + 3, 32, 32);
      const outlineMat = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.5,
        side: THREE.BackSide,
      });
      const outlineMesh = new THREE.Mesh(outlineGeom, outlineMat);
      group.add(outlineMesh);
    }
  
    return group;
  };
  
  
  

  // Link color
  const getLinkColor = (link: any) => {
    switch (link.category) {
      case "friendly":
        return "#00FF00";
      case "hostile":
        return "#FF0000";
      case "business":
        return "#0000FF";
      case "geographical":
        return "#FFD700";
      case "neutral":
      default:
        return "#CCCCCC";
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading graph...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center relative">
      {/* Background overlay to close dropdown */}
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
        linkMaterial={(link: any) =>
          new THREE.LineBasicMaterial({
            color: getLinkColor(link),
            transparent: true,
            opacity: 0.35,
            depthWrite: false,
          })
        }
        onNodeDrag={handleNodeDrag}
        onNodeDragEnd={() => {
          handleNodeDragEnd();
        }}
        enableNodeDrag={true}
        cooldownTicks={200}
        onEngineStop={() => {
          // 1) Make sure all nodes have x,y,z
          setNodes(prevNodes =>
            prevNodes.map(node => {
              if (node.x == null || node.y == null || node.z == null) {
                node.x = (Math.random() - 0.5) * 1000;
                node.y = (Math.random() - 0.5) * 1000;
                node.z = (Math.random() - 0.5) * 1000;
              }
              return node;
            })
          );
      
          // 2) Zoom the camera
          // fgRef.current.zoomToFit(400);
        }}
      />      
      )}

      {/* Node dropdown if selected */}
      {selectedNode && (
        <div
          className="
            fixed top-20 right-4
            w-64 bg-white text-black rounded-lg p-4 shadow-lg pointer-events-auto
            z-10
            flex flex-col
          "
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          <img
            src={selectedNodeImage}
            alt="Profile"
            className="
              absolute top-2 right-2
              w-14 h-14 rounded-full border border-gray-200 object-cover
              cursor-pointer transition-opacity hover:opacity-75
            "
            onClick={(e) => {
              e.stopPropagation(); // prevent closing the dropdown
              setImageModal({ isOpen: true, imageUrl: selectedNodeImage });
            }}
          /><br></br>

          <h2 className="font-bold text-lg pr-16">{selectedNode.name}</h2>
          <h4 className="font-italic text-sm mb-3 pr-16 text-slate-400">mentioned {selectedNode.metadata?.frequency} times</h4>

          {selectedNode.metadata?.affiliations?.length > 0 && (
            <ul className="list-none space-y-2">
              {selectedNode.metadata.affiliations.map((aff: any, idx: number) => {
                const domain = aff.link ? new URL(aff.link).hostname.replace("www.", "") : null;
                return (
                  <li key={idx} className="bg-gray-100 p-2 rounded-md">
                    {formatAffiliation(aff)}
                    {aff.link ? (
                      <div className="text-sm text-slate-400">
                        Source:{" "}
                        <a
                          href={aff.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline hover:text-blue-600"
                        >
                          {domain}
                        </a>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">Source unavailable</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}


          <button
            onClick={handleGenerateNarrative}
            className="mt-3 bg-red-500 text-white font-semibold px-4 py-2 rounded-lg w-full hover:bg-red-600 transition duration-200"
          >
            Generate Narrative
          </button>

          {narrativeLoading ? (
            <div className="text-gray-500 text-sm mt-3 italic">
              Generating narrative...
            </div>
          ) : narrative ? (
            <div className="text-gray-600 text-sm mt-3">{narrative}</div>
          ) : null}
        </div>
      )}

      {/* 🆕 FULL-SCREEN MODAL FOR IMAGE */}
      {imageModal.isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setImageModal({ isOpen: false, imageUrl: "" })}
        >
          <div
            className="relative p-4"
            onClick={(e) => e.stopPropagation()} // Don't close if clicking the image container
          >
            {/* Close Button (✕) */}
            <button
              className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-lg font-bold hover:bg-red-700"
              onClick={() => setImageModal({ isOpen: false, imageUrl: "" })}
            >
              ✕
            </button>

            {/* Full-Screen Image */}
            <img
              src={imageModal.imageUrl}
              alt="Full View"
              className="max-w-full max-h-[80vh] rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
      <div className="absolute bottom-20 w-full p-4 flex justify-center">
      <ButtonBar filters={filters} setFilters={setFilters} isSelecting={isSelecting} setIsSelecting={setIsSelecting} handleSnapshot={handleSnapshot} />
      </div>

      {/* Sidebar for Selected Nodes */}
      <div className="fixed bottom-4 left-4 w-72 bg-[rgb(114,20,20)] rounded-lg p-2 shadow-lg z-10">
      <div className="bg-[rgb(114,20,20)] text-white rounded-md p-4">
        <h2 className="text-lg font-bold">📌 Selected Nodes</h2>
        <ul className="mt-2 space-y-2">
          {selectedNodes.map((node) => (
            <li key={node.identifier} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <button
                className="text-white underline hover:text-gray"
                onClick={() => {
                  if (fgRef.current) {
                    fgRef.current.cameraPosition(
                      { x: node.x, y: node.y, z: node.z + 100 },
                      { x: node.x, y: node.y, z: node.z },
                      1000
                    );
                  }
                }}
              >
                {node.name}
              </button>
              <button
                className="text-red-500 hover:text-red-700 ml-2"
                onClick={() => setSelectedNodes((prev) => prev.filter((n) => n.identifier !== node.identifier))}
              >
                <X className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
};

export default NetworkGraph;
