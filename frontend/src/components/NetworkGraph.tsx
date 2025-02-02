import React, { useEffect, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import { generateEntityHash } from "../utils/generateEntityHash";

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

const API_BASE_URL = "https://redstring-45l8.onrender.com"; // TODO: change this back to https://redstring-45l8.onrender.com
const ENTITIES_ENDPOINT = `${API_BASE_URL}/entities/`;

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
  fgRef: React.MutableRefObject<any>; // 🆕 Add this so we can pass it from Graph.tsx
  searchQuery: string;
  filters: {
    clusterSize: number;
    selectedCategories: string[];
  };
  relationNodes: { node1: string; node2: string };
}


const NetworkGraph: React.FC<NetworkGraphProps> = ({
  fgRef,
  searchQuery,
  filters,
  relationNodes,
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

        data.forEach((entity: any) => {
          const { identifier, metadata } = entity;
          if (!metadata?.name) return;

          nodesArray.push({ identifier, name: metadata.name, metadata });
          nameToId[metadata.name.toLowerCase()] = identifier;
        });

        setNodes(nodesArray);

        setTimeout(() => {
          data.forEach((entity: any) => {
            const { metadata } = entity;
            if (!metadata?.affiliations) return;

            metadata.affiliations.forEach((aff: any) => {
              const targetName = aff.entity.toLowerCase();
              if (!(targetName in nameToId)) {
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
                category: aff.category,
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

  // React to searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim()) return;
    console.log("🔎 [NetworkGraph] Searching for:", searchQuery);
    // ... implement highlight or filter
  }, [searchQuery]);

  // React to filters
  useEffect(() => {
    console.log("📌 [NetworkGraph] Applying Filters:", filters);
    // ... implement logic to show/hide categories or limit cluster size
  }, [filters]);

  // React to relationNodes
  useEffect(() => {
    const { node1, node2 } = relationNodes;
    if (!node1.trim() || !node2.trim()) return;
    console.log("🔗 [NetworkGraph] Finding relation:", node1, "↔", node2);
    // ... implement BFS or path highlighting
  }, [relationNodes]);

  const handleNodeClick = async (node: any, event: MouseEvent) => {
    event.stopPropagation();

    if (!isDragging && fgRef.current) {
      fgRef.current.cameraPosition(
        { x: node.x, y: node.y, z: node.z + 100 },
        { x: node.x, y: node.y, z: node.z },
        1000
      );
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
        verb = "Friend of";
        break;
      case "hostile":
        verb = "Rival to";
        break;
      case "business":
        verb = "Partner with";
        break;
      case "geographical":
        verb = "Located in";
        break;
      default:
        verb = "Affiliation with";
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

  // Minimal node style
  const renderNode = (node: any) => {
    const group = new THREE.Group();
  
    // Extract frequency from metadata and apply scaling
    const baseSize = 5;
    const frequency = node.metadata?.frequency ?? 1; // Default to 1 if missing
    const scaleFactor = 12; // Increase this to amplify size differences
    const nodeSize = baseSize + Math.log10(frequency + 1) * scaleFactor; 
  
    console.log(`📌 Node: ${node.name}, Frequency: ${frequency}, Size: ${nodeSize}`);
  
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
          onNodeDragEnd={handleNodeDragEnd}
          enableNodeDrag={true}
          cooldownTicks={200}
          onEngineStop={() => fgRef.current.zoomToFit(400)}
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
          {/* 🆕 MOD: make the image clickable */}
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
          />

          <h2 className="font-bold text-lg mb-3 pr-16">{selectedNode.name}</h2>

          {selectedNode.metadata?.affiliations?.length > 0 && (
            <ul className="list-none space-y-1">
              {selectedNode.metadata.affiliations.map((aff: any, idx: number) => (
                <li key={idx}>{formatAffiliation(aff)}</li>
              ))}
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
    </div>
  );
};

export default NetworkGraph;
