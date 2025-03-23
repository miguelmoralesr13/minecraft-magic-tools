
import React from "react";
import { Card } from "@/components/ui/card";
import { MinecraftStructure } from "@/utils/minecraft/StructureGenerator";
import MapCanvas from "@/components/map/MapCanvas";
import MapControls from "@/components/map/MapControls";
import MapStatus from "@/components/map/MapStatus";
import StructureDetails from "@/components/map/StructureDetails";
import StructureList from "@/components/map/StructureList";
import NoDataOverlay from "@/components/map/NoDataOverlay";
import { useMapStore } from "@/store/mapStore";
import { toast } from "sonner";

interface MapComponentProps {
  seed: string;
  filters: string[];
  version: "bedrock" | "java";
  structures: MinecraftStructure[];
  onSeedChange?: (seed: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  seed, 
  filters, 
  version, 
  structures,
  onSeedChange 
}) => {
  // Usar el estado global del mapa desde Zustand
  const { selectedStructure } = useMapStore();
  
  // Función para generar una semilla aleatoria
  const handleRandomSeed = () => {
    if (!onSeedChange) return;
    
    // Generar una semilla aleatoria
    const randomSeed = Math.floor(Math.random() * 1000000000).toString();
    onSeedChange(randomSeed);
    
    toast.success("Semilla aleatoria generada", {
      description: `Nueva semilla: ${randomSeed}`
    });
  };
  
  return (
    <Card className="p-4 h-[600px] relative overflow-hidden border border-border rounded-md">
      {/* Contenedor principal del mapa con grid para dividir mapa y lista */}
      <div className="relative w-full h-full grid grid-cols-4 gap-4">
        {/* Lista de estructuras (ocupa 1/4 del espacio) */}
        <div className="col-span-1 border-r overflow-hidden">
          {seed && structures.length > 0 ? (
            <StructureList 
              structures={structures} 
              filters={filters} 
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground text-sm text-center px-4">
                {!seed ? "Ingresa una semilla para ver estructuras" : "No se encontraron estructuras"}
              </p>
            </div>
          )}
        </div>
        
        {/* Contenedor del mapa (ocupa 3/4 del espacio) */}
        <div className="col-span-3 relative">
          {/* Mostrar overlay cuando no hay semilla o estructuras */}
          <NoDataOverlay 
            noSeed={!seed} 
            noStructures={seed !== "" && structures.length === 0} 
            onRandomSeed={onSeedChange ? handleRandomSeed : undefined}
          />
          
          {/* Canvas del mapa */}
          {seed && (
            <MapCanvas 
              structures={structures}
              filters={filters}
              seed={seed}
            />
          )}
          
          {/* Controles del mapa */}
          <MapControls disabled={!seed} />
          
          {/* Información de estado */}
          <MapStatus />
          
          {/* Detalles de la estructura seleccionada */}
          <StructureDetails />
        </div>
      </div>
    </Card>
  );
};

export default MapComponent;
