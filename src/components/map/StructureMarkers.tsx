/**
 * StructureMarkers.tsx
 * Componente para mostrar marcadores de estructuras de Minecraft en el mapa
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useMapStore } from '@/store/mapStore';
import { MinecraftStructure, STRUCTURE_TYPES } from '@/utils/minecraft/StructureGenerator';
import { calculateStructurePosition, calculateViewBounds, filterVisibleStructures } from '@/utils/minecraft/mapUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StructureMarkersProps {
  structures: MinecraftStructure[];
  filters: string[];
  onStructureClick: (structure: MinecraftStructure) => void;
}

const StructureMarkers: React.FC<StructureMarkersProps> = ({ 
  structures, 
  filters,
  onStructureClick
}) => {
  const { position, zoom, selectedStructure } = useMapStore();
  const [visibleStructures, setVisibleStructures] = useState<MinecraftStructure[]>([]);

  // Calcular los límites del área visible y filtrar estructuras
  const viewBounds = useMemo(() => {
    return calculateViewBounds(position, zoom, window.innerWidth, window.innerHeight);
  }, [position, zoom]);

  // Filtrar estructuras visibles basadas en los filtros activos y el área visible
  useEffect(() => {
    const filtered = structures.filter(structure => filters.includes(structure.type));
    const visible = filterVisibleStructures(filtered, viewBounds);
    setVisibleStructures(visible);
  }, [structures, filters, viewBounds]);

  // Centrar el mapa en una estructura
  const centerOnStructure = (structure: MinecraftStructure) => {
    const newPosition = {
      x: -(structure.x * zoom) / 16,
      y: -(structure.z * zoom) / 16
    };
    useMapStore.setState({ position: newPosition });
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {visibleStructures.map((structure, index) => {
        const { x, y } = calculateStructurePosition(structure, zoom, position);
        
        const isSelected = selectedStructure && 
          selectedStructure.x === structure.x && 
          selectedStructure.z === structure.z;
        
        return (
          <TooltipProvider key={`${structure.type}-${structure.x}-${structure.z}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`absolute pointer-events-auto cursor-pointer transition-all duration-200 ${isSelected ? 'z-10 scale-125' : 'z-0 hover:scale-110'}`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => {
                    onStructureClick(structure);
                    centerOnStructure(structure);
                  }}
                >
                  <img 
                    src={`/icons/${structure.type}.svg`} 
                    alt={structure.type}
                    className={`w-6 h-6 ${isSelected ? 'filter drop-shadow-glow' : ''}`}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-semibold">{structure.type.charAt(0).toUpperCase() + structure.type.slice(1)}</p>
                  <p>X: {structure.x}, Z: {structure.z}</p>
                  <p>Bioma: {structure.biome}</p>
                  <p>Distancia: {Math.round(structure.distanceFromSpawn)} bloques</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

export default StructureMarkers;