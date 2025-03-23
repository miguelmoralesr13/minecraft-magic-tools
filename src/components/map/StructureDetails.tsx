
import React from "react";
import { getIconForType } from "./StructureIcon";
import { useMapStore } from "@/store/mapStore";
import { Badge } from "@/components/ui/badge";

const StructureDetails: React.FC = () => {
  const { selectedStructure } = useMapStore();
  
  if (!selectedStructure) return null;

  // Función para formatear el nombre del tipo de estructura
  const formatStructureType = (type: string): string => {
    return type.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="absolute bottom-4 right-4 z-10 bg-background/90 p-3 rounded-md border border-border shadow-md max-w-[250px]">
      <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
        {getIconForType(selectedStructure.type)}
        {formatStructureType(selectedStructure.type)}
      </h4>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Coordenadas:</span>
          <span className="font-medium">X: {selectedStructure.x}, Z: {selectedStructure.z}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Bioma:</span>
          <Badge variant="outline" className="font-normal text-[10px] h-5">
            {selectedStructure.biome.split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </Badge>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Distancia al spawn:</span>
          <span className="font-medium">{Math.floor(selectedStructure.distanceFromSpawn)} bloques</span>
        </div>
      </div>
    </div>
  );
};

export default StructureDetails;
