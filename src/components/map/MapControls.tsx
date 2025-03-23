
import React from "react";
import { Button } from "@/components/ui/button";
import { Map, Trees } from "lucide-react";
import { toast } from "sonner";

interface MapControlsProps {
  onCenter: () => void;
  onToggleBiomes: () => void;
  showBiomes: boolean;
  disabled: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  onCenter, 
  onToggleBiomes, 
  showBiomes, 
  disabled 
}) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onToggleBiomes}
        disabled={disabled}
      >
        <Trees className="h-4 w-4 mr-2" />
        {showBiomes ? "Ocultar Biomas" : "Mostrar Biomas"}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onCenter}
        disabled={disabled}
      >
        <Map className="h-4 w-4 mr-2" />
        Centrar
      </Button>
    </div>
  );
};

export default MapControls;
