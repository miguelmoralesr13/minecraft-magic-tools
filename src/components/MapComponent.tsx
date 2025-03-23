
import React from "react";
import { Card } from "@/components/ui/card";
import { MinecraftStructure } from "@/utils/minecraft/StructureGenerator";
import MapCanvas from "./map/MapCanvas";
import MapControls from "./map/MapControls";
import MapStatus from "./map/MapStatus";
import StructureDetails from "./map/StructureDetails";
import NoDataOverlay from "./map/NoDataOverlay";
import { useMapInteraction } from "./map/useMapInteraction";

interface MapComponentProps {
  seed: string;
  filters: string[];
  version: "bedrock" | "java";
  structures: MinecraftStructure[];
}

const MapComponent: React.FC<MapComponentProps> = ({ seed, filters, version, structures }) => {
  const {
    position,
    zoom,
    selectedStructure,
    showBiomes,
    handleCanvasClick,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCenter,
    toggleBiomes
  } = useMapInteraction(structures, filters);

  return (
    <Card className="p-4 h-[600px] relative overflow-hidden border border-border rounded-md">
      {/* Overlays for no seed or no structures */}
      <NoDataOverlay 
        noSeed={!seed} 
        noStructures={seed && structures.length === 0} 
      />
      
      {/* Map controls */}
      <MapControls 
        onCenter={handleCenter}
        onToggleBiomes={toggleBiomes}
        showBiomes={showBiomes}
        disabled={!seed}
      />
      
      {/* Map status */}
      <MapStatus zoom={zoom} />
      
      {/* Selected structure details */}
      <StructureDetails structure={selectedStructure} />
      
      {/* Map canvas */}
      <MapCanvas
        structures={structures}
        filters={filters}
        position={position}
        zoom={zoom}
        showBiomes={showBiomes}
        selectedStructure={selectedStructure}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        seed={seed}
      />
    </Card>
  );
};

export default MapComponent;
