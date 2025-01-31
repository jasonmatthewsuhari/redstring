import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Graph from "./pages/Graph";
import Header from "./components/Header";

const App: React.FC = () => {
  return (
    <Router>
      <Header /> {/* Persistent navigation bar */}
      <div style={{ paddingTop: "70px" }}> {/* Offset for fixed header */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/graph" element={<Graph />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
