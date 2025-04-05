import React from "react";
import "../styles/FolderList.css";

const FolderList = ({ onFolderClick }) => {
  return (
    <div className="folder-list">
      <div className="folder-grid">
        <div className="folder-item" onClick={() => onFolderClick("Images")}>
          <p>Images</p>
        </div>
      </div>
    </div>
  );
};

export default FolderList;