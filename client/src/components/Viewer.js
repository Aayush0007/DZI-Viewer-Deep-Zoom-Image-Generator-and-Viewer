import React, { useEffect } from 'react';
import OpenSeadragon from 'openseadragon';
import { useLocation } from 'react-router-dom';
import "../styles/Viewer.css";

const Viewer = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dziUrl = queryParams.get('dzi');

  useEffect(() => {
    if (dziUrl) {
      const viewer = OpenSeadragon({
        id: 'osd-viewer',
        prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.0.0/images/',
        tileSources: `${process.env.REACT_APP_API_URL}${dziUrl}`,
        showNavigator: true,
        zoomPerClick: 2,
        defaultZoomLevel: 1,
        gestureSettingsMouse: {
          scrollToZoom: true,
          clickToZoom: true,
        },
        crossOriginPolicy: 'Anonymous',
      });

      return () => {
        viewer.destroy();
      };
    }
  }, [dziUrl]);

  return <div id="osd-viewer" className="viewer-container"></div>;
};

export default Viewer;