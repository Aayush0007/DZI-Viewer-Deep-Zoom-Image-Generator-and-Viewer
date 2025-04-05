import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import Viewer from "./components/Viewer";

const root = ReactDOM.createRoot(document.getElementById("root"));

console.log("API URL:", process.env.REACT_APP_API_URL); // For Create React App

root.render(
  <React.StrictMode>
    <Router> {/* ✅ Keep Router only here */}
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/viewer" element={<Viewer />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
