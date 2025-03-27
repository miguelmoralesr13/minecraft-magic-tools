
/**
 * ChunkbaseCubiomesMap.tsx
 * Componente principal para renderizar el mapa de Minecraft al estilo Chunkbase
 */

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useMapStore, MinecraftStructure } from '@/store/mapStore';
import { getBiomeAt, findStructures } from '@/utils/minecraft/CubiomesModule';
import { initCubiomes } from '@/utils/minecraft/initCubiomes';
import { toast } from 'sonner';
import MapCanvas from './MapCanvas';

// Definir la interfaz para la referencia del mapa
export interface ChunkbaseCubiomesMapRef {
  downloadMap: () => void;
}

interface ChunkbaseCubiomesMapProps {
  seed: string;
  version: string;
  filters: string[];
  isLoading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

const ChunkbaseCubiomesMap = forwardRef<ChunkbaseCubiomesMapRef, ChunkbaseCubiomesMapProps>(
  ({ seed, version, filters, isLoading = false, onLoadingChange = () => {} }, ref) => {
    const [structures, setStructures] = useState<MinecraftStructure[]>([]);
    const [loading, setLoading] = useState<boolean>(isLoading);
    const mapCanvasRef = useRef<{ downloadMap: () => void }>(null);

    // Inicializar Cubiomes
    useEffect(() => {
      const initialize = async () => {
        try {
          await initCubiomes();
        } catch (error) {
          console.error('Error al inicializar Cubiomes:', error);
          toast.error('No se pudo inicializar el generador de mapas');
        }
      };
      
      initialize();
    }, []);

    // Exponer las funciones a través de la referencia
    useImperativeHandle(ref, () => ({
      downloadMap: () => {
        if (mapCanvasRef.current) {
          mapCanvasRef.current.downloadMap();
        }
      }
    }));

    // Generar estructuras cuando cambia la semilla o versión
    useEffect(() => {
      const generateStructures = async () => {
        if (!seed) return;
        
        setLoading(true);
        onLoadingChange(true);
        
        try {
          const allStructures: MinecraftStructure[] = [];
          
          // Si hay filtros, usarlos; de lo contrario, generar todos los tipos de estructuras
          const structureTypes = filters.length > 0 
            ? filters 
            : ['village', 'temple', 'stronghold', 'monument', 'mansion', 'mineshaft', 'fortress', 'spawner', 'outpost', 'ruined_portal'];
          
          // Generar cada tipo de estructura
          for (const type of structureTypes) {
            try {
              console.log(`Generando estructuras de tipo: ${type}`);
              const typeStructures = await findStructures(seed, type, 0, 0, 3000, version);
              allStructures.push(...typeStructures);
            } catch (error) {
              console.error(`Error al generar estructuras de tipo ${type}:`, error);
            }
          }
          
          // Añadir información de bioma a cada estructura
          for (let i = 0; i < allStructures.length; i++) {
            const structure = allStructures[i];
            if (typeof structure.biome === 'number') {
              // Ya tiene el ID del bioma, no necesitamos hacer nada
            } else {
              // Obtener el bioma en la posición de la estructura
              try {
                const biomeId = await getBiomeAt(seed, structure.x, structure.z, version);
                structure.biome = biomeId;
              } catch (error) {
                console.error(`Error al obtener bioma para estructura en (${structure.x}, ${structure.z}):`, error);
                structure.biome = 0; // Bioma desconocido
              }
            }
          }
          
          setStructures(allStructures);
          console.log(`Generadas ${allStructures.length} estructuras`);
          
          if (allStructures.length > 0) {
            toast.success(`Se han encontrado ${allStructures.length} estructuras`);
          } else {
            toast.info('No se encontraron estructuras en la región cercana al spawn');
          }
        } catch (error) {
          console.error('Error al generar estructuras:', error);
          toast.error('Error al generar estructuras');
        } finally {
          setLoading(false);
          onLoadingChange(false);
        }
      };
      
      generateStructures();
    }, [seed, version, filters]);

    return (
      <MapCanvas
        ref={mapCanvasRef}
        structures={structures}
        filters={filters}
        isLoading={loading}
        seed={seed}
        version={version}
      />
    );
  }
);

ChunkbaseCubiomesMap.displayName = 'ChunkbaseCubiomesMap';

export default ChunkbaseCubiomesMap;
