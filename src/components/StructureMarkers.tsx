/**
 * StructureMarkers.tsx
 * Componente para mostrar marcadores de estructuras en el mapa
 */

import React, { useEffect, useState } from 'react';
import { generateStructures } from '@/utils/minecraft/StructureGenerator';
import { MinecraftStructure } from '@/store/mapStore';
import { structureColors } from '@/utils/minecraft/structureColors';

interface StructureMarkersProps {
  seed: string;
  version: string;
  activeStructures: string[];
  position: { x: number, y: number, startX?: number, startY?: number };
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  onSelectStructure?: (structure: MinecraftStructure) => void;
}

const StructureMarkers: React.FC<StructureMarkersProps> = ({
  seed,
  version,
  activeStructures,
  position,
  zoom,
  canvasWidth,
  canvasHeight,
  onSelectStructure
}) => {
  const [structures, setStructures] = useState<MinecraftStructure[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Generar estructuras cuando cambia la semilla o la versión
  useEffect(() => {
    const loadStructures = async () => {
      try {
        setLoading(true);
        const generatedStructures = await generateStructures(seed, version, activeStructures);
        setStructures(generatedStructures);
      } catch (error) {
        console.error('Error al cargar estructuras:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStructures();
  }, [seed, version, activeStructures]);

  // Calcular posiciones de los marcadores en el canvas
  const calculateMarkerPosition = (structure: MinecraftStructure) => {
    const chunkSize = 16 * zoom;
    const centerX = canvasWidth / 2 + position.x;
    const centerZ = canvasHeight / 2 + position.y;
    
    const x = centerX + (structure.x / 16) * chunkSize;
    const z = centerZ + (structure.z / 16) * chunkSize;
    
    return { x, z };
  };

  // Manejar clic en una estructura
  const handleClick = (structure: MinecraftStructure) => {
    if (onSelectStructure) {
      onSelectStructure(structure);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {structures.map((structure, index) => {
        // Filtrar estructuras por tipo activo
        if (!activeStructures.includes(structure.type)) return null;
        
        // Calcular posición
        const { x, z } = calculateMarkerPosition(structure);
        
        // No renderizar estructuras fuera del canvas (con un margen)
        if (x < -20 || x > canvasWidth + 20 || z < -20 || z > canvasHeight + 20) {
          return null;
        }
        
        // Color según el tipo de estructura
        const color = structureColors[structure.type] || '#FFFFFF';
        
        return (
          <div
            key={`${structure.type}-${index}`}
            className="absolute cursor-pointer pointer-events-auto"
            style={{
              left: `${x - 10}px`,
              top: `${z - 10}px`,
              width: '20px',
              height: '20px',
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
            onClick={() => handleClick(structure)}
          >
            {/* Usar un SVG o un div estilizado como marcador */}
            <div
              className="rounded-full w-full h-full flex items-center justify-center"
              style={{
                backgroundColor: `${color}40`,
                border: `2px solid ${color}`
              }}
            />
          </div>
        );
      })}
      
      {/* Indicador de carga */}
      {loading && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          Cargando estructuras...
        </div>
      )}
    </div>
  );
};

export default StructureMarkers;
