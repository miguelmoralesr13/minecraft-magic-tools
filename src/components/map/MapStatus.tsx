
import React from "react";
import { useMapStore } from "@/store/mapStore";
import { Compass } from "lucide-react";

const MapStatus: React.FC = () => {
  const { zoom, position } = useMapStore();
  
  // Calcular coordenadas del centro del mapa
  const centerX = Math.floor(-position.x / zoom * 16);
  const centerZ = Math.floor(-position.y / zoom * 16);
  
  // Calcular coordenadas en chunks
  const chunkX = Math.floor(centerX / 16);
  const chunkZ = Math.floor(centerZ / 16);
  
  // Calcular región
  const regionX = Math.floor(chunkX / 32);
  const regionZ = Math.floor(chunkZ / 32);
  
  // Calcular distancia desde el spawn (0,0)
  const distanceFromSpawn = Math.floor(Math.sqrt(centerX * centerX + centerZ * centerZ));
  
  return (
    <div className="absolute bottom-4 left-4 z-10 bg-background/80 p-3 rounded-md border border-border shadow-md">
      <div className="text-xs space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Compass className="h-4 w-4 text-primary" />
          <span className="font-bold text-sm">Coordenadas Actuales</span>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex items-center gap-1">
            <span className="text-primary font-medium">X:</span>
            <span className="font-mono">{centerX}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-primary font-medium">Z:</span>
            <span className="font-mono">{centerZ}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Chunk:</span>
            <span className="font-mono">{chunkX}, {chunkZ}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Región:</span>
            <span className="font-mono">r.{regionX}.{regionZ}</span>
          </div>
        </div>
        
        <div className="pt-1 border-t border-border mt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Distancia al spawn:</span>
              <span className="font-medium">{distanceFromSpawn} bloques</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapStatus;
