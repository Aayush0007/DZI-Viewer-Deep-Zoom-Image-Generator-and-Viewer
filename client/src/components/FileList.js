import React from "react";
import "../styles/FileList.css";

const FileList = ({ folderContent, onBack, onThumbnailClick }) => {
  return (
    <div className="file-list">
      <h2>Images</h2>
      <button className="button" onClick={onBack}>
        Back to Folders
      </button>
      <div className="file-grid">
        {folderContent.map((file, index) => (
          <div
            key={index}
            className="file-item"
            onClick={() => onThumbnailClick(file)}
          >
            <img
              src={`${process.env.REACT_APP_API_URL}${file.thumbnail}`}
              alt={`Thumbnail for ${file.dzi}`}
            />

            <p>{file.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
