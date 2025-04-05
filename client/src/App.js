import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import FolderList from "./components/FolderList";
import FileList from "./components/FileList";
import Login from "./components/Login";
import "./styles/App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [folderContent, setFolderContent] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchFolderContent = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/folder-content`, {
            cache: 'no-store',
            headers: {
              "Content-Type": "application/json"
            }
          });
          const text = await response.text();
          console.log("Raw response:", text); // See what’s actually returned
      
          // Only parse if it's valid JSON
          const data = JSON.parse(text);
          setFolderContent(data.Images);
        } catch (error) {
          console.error("Error fetching folder content:", error);
        }
      };
      
      fetchFolderContent();
    }
  }, [isLoggedIn]);

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        onLoginClick={() => setShowLogin(true)}
      />

      {/* Login Popup */}
      {showLogin && (
        <Login
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setShowLogin(false);
          }}
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* Main Content */}
      {isLoggedIn ? (
        <div className="viewer-container">
          <h1 className="login-message-container">Deep Zoom Viewer</h1>
          {selectedFolder ? (
            <FileList
              folderContent={folderContent}
              onBack={() => setSelectedFolder(null)}
              onThumbnailClick={(dziFile) => {
                window.open(
                  `${
                    process.env.REACT_APP_CLIENT_URL
                  }/viewer?dzi=${encodeURIComponent(dziFile.dzi)}`,
                  "_blank"
                );
              }}
            />
          ) : (
            <FolderList onFolderClick={setSelectedFolder} />
          )}
        </div>
      ) : (
        <div className="login-message-container">
          <h2>Please login to access the image viewer</h2>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default App;
