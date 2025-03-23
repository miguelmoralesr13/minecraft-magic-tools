
import React from "react";

interface MapStatusProps {
  zoom: number;
}

const MapStatus: React.FC<MapStatusProps> = ({ zoom }) => {
  return (
    <div className="absolute bottom-4 left-4 z-10">
      <div className="text-xs text-muted-foreground">
        Zoom: {(zoom * 100).toFixed(0)}% | Escala: 1 chunk = {zoom < 1 ? `${(1/zoom).toFixed(1)} píxeles` : `${zoom.toFixed(1)} píxeles`}
      </div>
    </div>
  );
};

export default MapStatus;
