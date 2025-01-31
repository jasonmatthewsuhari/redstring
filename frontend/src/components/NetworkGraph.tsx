"use client";

import React, { useEffect, useState } from "react";
import { GraphCanvas } from "@reaviz/reagraph";

interface Node {
  id: string;
  label: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

const NetworkGraph: React.FC = () => {
  const [data, setData] = useState<{ nodes: Node[]; edges: Edge[] }>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/network-data"); // Replace with your API
        const result = await response.json();

        // Transform API data into nodes and edges
        const nodes = result.nodes.map((node: any) => ({
          id: node.id,
          label: node.label,
        }));

        const edges = result.links.map((link: any) => ({
          id: link.id,
          source: link.source,
          target: link.target,
        }));

        setData({ nodes, edges });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-[90vh] bg-gray-100 flex justify-center items-center">
      <GraphCanvas
        nodes={data.nodes}
        edges={data.edges}
        layoutType="forceDirected"
        theme={{
          node: {
            fill: (node) => (node.id === "special" ? "#FF5733" : "#3498db"),
            radius: 10,
          },
          edge: {
            stroke: "#000",
          },
        }}
      />
    </div>
  );
};

export default NetworkGraph;
