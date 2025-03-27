
import React from "react";
import { Card } from "@/components/ui/card";
import { useMapStore } from "@/store/mapStore";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Compass, Layers } from "lucide-react";
import SeedMapCanvas from "./SeedMapCanvas";
import SeedControls from "./SeedControls";
import FilterPanel from "./FilterPanel";
import StructuresList from "./StructuresList";

const MapComponent: React.FC = () => {
  const { 
    seed, 
    version,
    activeStructures, 
    zoom, 
    showBiomes,
    selectedStructure,
    handleCenter, 
    toggleBiomes,
  } = useMapStore();

  const [showStructuresList, setShowStructuresList] = React.useState(false);

  // Function to handle zoom in
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 2);
    useMapStore.getState().setZoom(newZoom);
  };

  // Function to handle zoom out
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.5);
    useMapStore.getState().setZoom(newZoom);
  };

  const toggleStructuresList = () => {
    setShowStructuresList(!showStructuresList);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full h-[calc(100vh-200px)] min-h-[600px]">
      {/* Sidebar de filtros */}
      <Card className="p-4 md:w-64 flex-shrink-0 overflow-y-auto">
        <div className="space-y-6">
          <SeedControls />
          <FilterPanel />
          
          <div className="pt-4">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full"
              onClick={toggleStructuresList}
            >
              {showStructuresList ? 'Ocultar Lista' : 'Mostrar Estructuras'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Canvas del mapa */}
      <div className="flex-grow relative">
        <Card className="w-full h-full flex flex-col overflow-hidden">
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleCenter}
            >
              <Compass className="h-4 w-4" />
            </Button>
            <Button 
              variant={showBiomes ? "default" : "outline"} 
              size="icon"
              onClick={toggleBiomes}
            >
              <Layers className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative flex h-full">
            <div className={`relative ${showStructuresList ? 'w-2/3' : 'w-full'} h-full transition-all duration-300`}>
              <SeedMapCanvas 
                seed={seed} 
                version={version} 
                activeStructures={activeStructures} 
                showBiomes={showBiomes}
              />
            </div>
            
            {showStructuresList && (
              <div className="w-1/3 h-full border-l bg-background p-4 overflow-auto">
                <h3 className="font-medium mb-4">Estructuras Encontradas</h3>
                <StructuresList 
                  structures={[]}
                  selectedStructure={selectedStructure}
                  onStructureSelect={(structure) => useMapStore.getState().setSelectedStructure(structure)}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MapComponent;
