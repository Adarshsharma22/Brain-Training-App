import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SequenceMemory from "./component/SequenceMemory";
import ReactionTime from "./component/ReactionTime";
import ClickSpeed from "./component/ClickSpeed";

function App() {
  return (
    <BrowserRouter basename="/Brain-Training-App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sequence-memory" element={<SequenceMemory />} />
        <Route path="/reaction-time" element={<ReactionTime />} />
        <Route path="/click-speed" element={<ClickSpeed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;