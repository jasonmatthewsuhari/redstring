import React, { useState, useEffect } from "react";
import axios from "axios";
import { GraphCanvas, GraphNode, GraphEdge } from "reagraph";

const API_BASE_URL = "http://127.0.0.1:8000"; // Your FastAPI server URL

const NetworkGraph: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch nodes and edges from FastAPI
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        // Fetch entities (nodes)
        const entitiesResponse = await axios.get(`${API_BASE_URL}/entities/`);
        const entities = entitiesResponse.data.map((entity: any) => ({
          id: entity.identifier,
          label: entity.type, // Display entity type as label
        }));

        // Fetch relationships (edges)
        const relationshipsResponse = await axios.get(`${API_BASE_URL}/relationships/`);
        const relationships = relationshipsResponse.data.map((rel: any) => ({
          id: `${rel.source}-${rel.target}`,
          source: rel.source,
          target: rel.target,
          label: rel.relationship, // Relationship type as label
        }));

        setNodes(entities);
        setEdges(relationships);
      } catch (error) {
        console.error("Error fetching network data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  if (loading) return <div className="text-center text-lg font-semibold">Loading...</div>;

  return (
    <div className="w-full h-screen bg-gray-900 flex justify-center items-center">
      <GraphCanvas 
  nodes={nodes} 
  edges={edges} 
  layoutType="forceDirected2d"
  theme={{
    node: { 
      fill: "blue", 
      activeFill: "cyan",
      opacity: 1,
      selectedOpacity: 1,
      inactiveOpacity: 0.3, 
      label: { 
        color: "white", 
        activeColor: "yellow", 
        stroke: "black",
      }
    },
    edge: { 
      fill: "white", 
      activeFill: "lightgray",
      opacity: 0.7,
      selectedOpacity: 1,
      inactiveOpacity: 0.3,
      label: {
        color: "gray",
        activeColor: "white",
        stroke: "black",
        fontSize: 10
      }
    },
    ring: { // Required property
      fill: "orange",
      activeFill: "orange"
    },
    arrow: { // Required property
      fill: "white",
      activeFill: "white"
    },
    lasso: { // Required property
      border: "white",
      background: "rgba(255, 255, 255, 0.2)"
    }
  }}
/>



    </div>
  );
};

export default NetworkGraph;
