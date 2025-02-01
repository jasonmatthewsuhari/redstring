import React, { useState } from "react";
import Header from "../components/Header";
import ButtonBar from "../components/ButtonBar";
import NetworkGraph from "../components/NetworkGraph";
import DotBackground from "../components/DotBackground";

const App: React.FC = () => {
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

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <DotBackground />
      </div>

      <div className="relative z-10">
        <Header />
      </div>

      {/* 
        2) Pass read-only props to NetworkGraph so it can react 
           (e.g., filter or highlight certain nodes) 
      */}
      <div className="relative z-10">
        <NetworkGraph
          searchQuery={searchQuery}
          filters={filters}
          relationNodes={relationNodes}
        />
      </div>

      {/* 
        3) Pass both read & write props to ButtonBar 
           so the user can update these states 
      */}
      <div className="relative z-10">
        <ButtonBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilters={setFilters}
          relationNodes={relationNodes}
          setRelationNodes={setRelationNodes}
        />
      </div>
    </div>
  );
};

export default App;
