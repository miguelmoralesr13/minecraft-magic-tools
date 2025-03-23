
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Map, Trees, ZoomIn, ZoomOut, Layers, Maximize, Home } from "lucide-react";
import { useMapStore } from "@/store/mapStore";
import { toast } from "sonner";

interface MapControlsProps {
  disabled: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({ disabled }) => {
  const { handleCenter, toggleBiomes, showBiomes, zoom, setZoom } = useMapStore();
  
  const handleZoomIn = () => {
    setZoom(Math.min(2, zoom + 0.2));
    toast.info(`Zoom: ${Math.round(Math.min(2, zoom + 0.2) * 100)}%`);
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(0.5, zoom - 0.2));
    toast.info(`Zoom: ${Math.round(Math.max(0.5, zoom - 0.2) * 100)}%`);
  };
  
  // Calculate scale for display
  const getScaleText = () => {
    // 1 pixel represents X blocks at current zoom
    const blocksPerPixel = 16 / zoom;
    return `1px = ${blocksPerPixel.toFixed(1)} bloques`;
  };
  
  // Add keyboard shortcuts for map controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      
      // Prevent handling if user is typing in an input field
      if (document.activeElement instanceof HTMLInputElement || 
          document.activeElement instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key) {
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "0":
        case "Home":
          handleCenter();
          break;
        case "b":
          toggleBiomes();
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, zoom, handleCenter, toggleBiomes]);
  
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleBiomes}
          disabled={disabled}
          title={showBiomes ? "Ocultar Biomas (B)" : "Mostrar Biomas (B)"}
          className="bg-background/80 hover:bg-background/90 transition-colors"
        >
          {showBiomes ? <Layers className="h-4 w-4" /> : <Trees className="h-4 w-4" />}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCenter}
          disabled={disabled}
          title="Centrar Mapa (Home/0)"
          className="bg-background/80 hover:bg-background/90 transition-colors"
        >
          <Home className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-col gap-2 bg-background/80 p-2 rounded-md border border-border shadow-sm">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleZoomIn}
            disabled={disabled || zoom >= 2}
            title="Acercar (+)"
            className="hover:bg-background/90 transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleZoomOut}
            disabled={disabled || zoom <= 0.5}
            title="Alejar (-)"
            className="hover:bg-background/90 transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Zoom percentage and scale indicator */}
        <div className="text-xs text-center">
          <div className="font-medium">{(zoom * 100).toFixed(0)}%</div>
          <div className="text-muted-foreground">{getScaleText()}</div>
        </div>
      </div>
    </div>
  );
};

export default MapControls;
