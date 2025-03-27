
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MinecraftStructure } from '@/store/mapStore';
import { getCubiomesWasmModule, initCubiomesWasm } from '@/utils/minecraft/CubiomesWebAssembly';

interface StructureMarkersProps {
  seed: string;
  version: string;
  activeStructures: string[];
  position: { x: number, y: number };
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
  const [loading, setLoading] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<MinecraftStructure | null>(null);
  const [module, setModule] = useState<any>(null);

  // Load Cubiomes module
  useEffect(() => {
    if (!module) {
      const loadModule = async () => {
        try {
          await initCubiomesWasm();
          const loadedModule = getCubiomesWasmModule();
          setModule(loadedModule);
          console.log('Módulo Cubiomes cargado para estructuras');
        } catch (error) {
          console.error('Error al cargar el módulo Cubiomes:', error);
          toast.error('Error al cargar el generador de estructuras');
        }
      };
      
      loadModule();
    }
  }, [module]);

  // Find structures when parameters change
  useEffect(() => {
    if (!module || !seed || activeStructures.length === 0) return;
    
    const findStructures = async () => {
      setLoading(true);
      
      try {
        const newStructures: MinecraftStructure[] = [];
        
        // Calculate visible area in world coordinates
        const chunkSize = 16 * zoom;
        const centerX = canvasWidth / 2 + position.x;
        const centerZ = canvasHeight / 2 + position.y;
        
        const worldCenterX = Math.floor(((canvasWidth / 2 - centerX) / chunkSize) * 16);
        const worldCenterZ = Math.floor(((canvasHeight / 2 - centerZ) / chunkSize) * 16);
        
        // Calculate search radius based on visible area
        const visibleWidth = canvasWidth / zoom;
        const visibleHeight = canvasHeight / zoom;
        const searchRadius = Math.ceil(Math.max(visibleWidth, visibleHeight) / 16) * 16 * 2;
        
        // For each active structure type
        for (const structureType of activeStructures) {
          // Allocate memory for strings
          const seedPtr = module._malloc(seed.length + 1);
          const versionPtr = module._malloc(version.length + 1);
          const typePtr = module._malloc(structureType.length + 1);
          
          // Write strings to memory
          for (let i = 0; i < seed.length; i++) {
            module.HEAPU8[seedPtr + i] = seed.charCodeAt(i);
          }
          module.HEAPU8[seedPtr + seed.length] = 0;
          
          for (let i = 0; i < version.length; i++) {
            module.HEAPU8[versionPtr + i] = version.charCodeAt(i);
          }
          module.HEAPU8[versionPtr + version.length] = 0;
          
          for (let i = 0; i < structureType.length; i++) {
            module.HEAPU8[typePtr + i] = structureType.charCodeAt(i);
          }
          module.HEAPU8[typePtr + structureType.length] = 0;
          
          // Allocate memory for results
          const resultSize = 100; // Maximum 100 structures
          const resultPtr = module._malloc(resultSize * 20); // 5 ints * 4 bytes per structure
          
          // Call the function
          const count = module.ccall(
            'getStructuresNear',
            'number',
            ['number', 'number', 'number', 'number', 'number', 'number', 'number'],
            [seedPtr, worldCenterX, worldCenterZ, typePtr, searchRadius, versionPtr, resultPtr]
          );
          
          // Process results
          for (let i = 0; i < count; i++) {
            const offset = resultPtr + i * 20;
            const type = module.HEAP32[offset / 4];
            const x = module.HEAP32[(offset + 4) / 4];
            const z = module.HEAP32[(offset + 8) / 4];
            const biome = module.HEAP32[(offset + 12) / 4];
            const distance = module.HEAP32[(offset + 16) / 4];
            
            const typeNames = [
              'village', 'temple', 'stronghold', 'monument', 'mansion',
              'mineshaft', 'fortress', 'spawner', 'outpost', 'ruined_portal'
            ];
            
            newStructures.push({
              type: typeNames[type],
              x,
              z,
              biome,
              distanceFromSpawn: distance,
              version: version // Add version property to fix the type error
            });
          }
          
          // Free memory
          module._free(seedPtr);
          module._free(versionPtr);
          module._free(typePtr);
          module._free(resultPtr);
        }
        
        setStructures(newStructures);
        
        if (newStructures.length > 0) {
          toast.success(`${newStructures.length} estructuras encontradas`);
        } else {
          toast.info('No se encontraron estructuras en esta área');
        }
      } catch (error) {
        console.error('Error al buscar estructuras:', error);
        toast.error('Error al buscar estructuras');
      } finally {
        setLoading(false);
      }
    };
    
    findStructures();
  }, [module, seed, version, activeStructures, position, zoom, canvasWidth, canvasHeight]);

  // Handle structure click
  const handleStructureClick = (structure: MinecraftStructure) => {
    setSelectedStructure(structure);
    if (onSelectStructure) {
      onSelectStructure(structure);
    }
  };

  // Convert world coordinates to canvas coordinates
  const worldToCanvas = (x: number, z: number) => {
    const chunkSize = 16 * zoom;
    const centerX = canvasWidth / 2 + position.x;
    const centerZ = canvasHeight / 2 + position.y;
    
    const canvasX = centerX + (x / 16) * chunkSize;
    const canvasZ = centerZ + (z / 16) * chunkSize;
    
    return { x: canvasX, y: canvasZ };
  };

  // Check if a structure is currently visible on screen
  const isStructureVisible = (x: number, z: number) => {
    const { x: canvasX, y: canvasZ } = worldToCanvas(x, z);
    return (
      canvasX >= -20 && canvasX <= canvasWidth + 20 &&
      canvasZ >= -20 && canvasZ <= canvasHeight + 20
    );
  };

  // Render the structures
  return (
    <div className="absolute inset-0 pointer-events-none">
      {structures.map((structure, index) => {
        // Skip if structure is not visible
        if (!isStructureVisible(structure.x, structure.z)) {
          return null;
        }
        
        const { x: canvasX, y: canvasZ } = worldToCanvas(structure.x, structure.z);
        const isSelected = selectedStructure && selectedStructure.x === structure.x && selectedStructure.z === structure.z;
        
        return (
          <div
            key={`${structure.type}-${index}`}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto
                       ${isSelected ? 'z-20' : 'z-10'}`}
            style={{ 
              left: `${canvasX}px`, 
              top: `${canvasZ}px`,
              width: isSelected ? '32px' : '24px',
              height: isSelected ? '32px' : '24px'
            }}
            onClick={() => handleStructureClick(structure)}
          >
            <img 
              src={`/icons/${structure.type}.svg`} 
              alt={structure.type}
              className={`w-full h-full ${isSelected ? 'filter drop-shadow-lg' : ''}`}
            />
            {isSelected && (
              <div className="absolute -inset-1 border-2 border-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
        );
      })}
      
      {loading && (
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded">
          <p className="text-sm">Buscando estructuras...</p>
        </div>
      )}
    </div>
  );
};

export default StructureMarkers;
