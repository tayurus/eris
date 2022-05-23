import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { HomePage, HistoryPage } from "src/pages";

export function App() {
  return (
    <div className="App">
      <Router>
        <Link to={""}>домашняя</Link>
        <br />
        <Link to={"history"}>история</Link>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Router>
    </div>
  );
}
