/**
 * cubiomesStore.ts
 * Store para gestionar el estado del módulo Cubiomes utilizando Zustand
 * Implementado siguiendo los principios SOLID
 */

import { create } from 'zustand';
import { MinecraftStructure } from '@/utils/minecraft/StructureGenerator';
import { getBiomeAt, findStructures } from '@/utils/minecraft/CubiomesModule';
import { toast } from 'sonner';

// Interfaces para seguir el principio de segregación de interfaces (ISP)

/**
 * Estado básico del mapa
 */
interface MapBaseState {
  seed: string;
  version: string;
  isLoading: boolean;
}

/**
 * Estado de las estructuras
 */
interface StructuresState {
  structures: MinecraftStructure[];
  selectedStructure: MinecraftStructure | null;
  filters: string[];
}

/**
 * Estado de los biomas
 */
interface BiomesState {
  biomeData: Record<string, string>;
  showBiomes: boolean;
}

/**
 * Acciones del store
 */
interface CubiomesActions {
  // Acciones básicas
  setSeed: (seed: string) => void;
  setVersion: (version: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  
  // Acciones de estructuras
  setStructures: (structures: MinecraftStructure[]) => void;
  setSelectedStructure: (structure: MinecraftStructure | null) => void;
  toggleFilter: (filter: string) => void;
  clearFilters: () => void;
  
  // Acciones de biomas
  setBiomeData: (biomeData: Record<string, string>) => void;
  toggleBiomes: () => void;
  
  // Acciones compuestas
  generateMap: (options?: Partial<MapGenerationOptions>) => Promise<void>;
  findStructuresByType: (structureType: string, centerX?: number, centerZ?: number, radius?: number) => Promise<void>;
}

/**
 * Opciones para la generación del mapa
 */
export interface MapGenerationOptions {
  seed: string;
  version: string;
  centerX: number;
  centerZ: number;
  radius: number;
  structureTypes: string[];
  showBiomes: boolean;
}

// Tipo completo del store
type CubiomesStore = MapBaseState & StructuresState & BiomesState & CubiomesActions;

/**
 * Store para gestionar el estado del módulo Cubiomes
 */
export const useCubiomesStore = create<CubiomesStore>((set, get) => ({
  // Estado inicial
  seed: '0',
  version: '1.20',
  isLoading: false,
  structures: [],
  selectedStructure: null,
  filters: [],
  biomeData: {},
  showBiomes: false,
  
  // Acciones básicas
  setSeed: (seed) => set({ seed }),
  setVersion: (version) => set({ version }),
  setIsLoading: (isLoading) => set({ isLoading }),
  
  // Acciones de estructuras
  setStructures: (structures) => set({ structures }),
  setSelectedStructure: (selectedStructure) => set({ selectedStructure }),
  toggleFilter: (filter) => {
    const { filters } = get();
    if (filters.includes(filter)) {
      set({ filters: filters.filter(f => f !== filter) });
    } else {
      set({ filters: [...filters, filter] });
    }
  },
  clearFilters: () => set({ filters: [] }),
  
  // Acciones de biomas
  setBiomeData: (biomeData) => set({ biomeData }),
  toggleBiomes: () => set({ showBiomes: !get().showBiomes }),
  
  // Acciones compuestas
  generateMap: async (options) => {
    const { seed, version, filters, showBiomes } = get();
    
    // Configurar opciones por defecto
    const mapOptions: MapGenerationOptions = {
      seed: options?.seed ?? seed,
      version: options?.version ?? version,
      centerX: options?.centerX ?? 0,
      centerZ: options?.centerZ ?? 0,
      radius: options?.radius ?? 5000,
      structureTypes: options?.structureTypes ?? filters,
      showBiomes: options?.showBiomes ?? showBiomes
    };
    
    // Actualizar estado si cambia la semilla o versión
    if (mapOptions.seed !== seed || mapOptions.version !== version) {
      set({ seed: mapOptions.seed, version: mapOptions.version });
    }
    
    set({ isLoading: true });
    
    try {
      // Generar estructuras
      const structures: MinecraftStructure[] = [];
      const structureTypes = mapOptions.structureTypes.length > 0 
        ? mapOptions.structureTypes 
        : ['village', 'fortress', 'stronghold', 'monument', 'mansion', 'temple', 'mineshaft', 'ruined_portal', 'outpost', 'spawner'];
      
      // Buscar cada tipo de estructura
      for (const type of structureTypes) {
        try {
          const positions = await findStructures(
            mapOptions.seed,
            type,
            mapOptions.centerX,
            mapOptions.centerZ,
            mapOptions.radius,
            mapOptions.version
          );
          
          // Convertir posiciones a estructuras
          for (const pos of positions) {
            // Obtener el bioma en la posición
            const biome = await getBiomeAt(mapOptions.seed, pos.x, pos.z, mapOptions.version);
            
            // Calcular distancia desde el spawn
            const distanceFromSpawn = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
            
            // Crear estructura
            structures.push({
              type,
              x: pos.x,
              z: pos.z,
              biome,
              distanceFromSpawn,
              version: mapOptions.version
            });
          }
        } catch (error) {
          console.error(`Error al buscar estructuras de tipo ${type}:`, error);
        }
      }
      
      // Actualizar estructuras
      set({ structures });
      
      // Generar datos de biomas si se solicita
      if (mapOptions.showBiomes) {
        const biomeData: Record<string, string> = {};
        
        // Cargar biomas en una región alrededor del centro
        const chunkRadius = Math.min(mapOptions.radius / 16, 20);
        const centerChunkX = Math.floor(mapOptions.centerX / 16);
        const centerChunkZ = Math.floor(mapOptions.centerZ / 16);
        
        for (let offsetX = -chunkRadius; offsetX <= chunkRadius; offsetX++) {
          for (let offsetZ = -chunkRadius; offsetZ <= chunkRadius; offsetZ++) {
            const chunkX = centerChunkX + offsetX;
            const chunkZ = centerChunkZ + offsetZ;
            const worldX = chunkX * 16 + 8; // Centro del chunk
            const worldZ = chunkZ * 16 + 8;
            const chunkKey = `${chunkX},${chunkZ}`;
            
            try {
              const biomeName = await getBiomeAt(mapOptions.seed, worldX, worldZ, mapOptions.version);
              biomeData[chunkKey] = biomeName;
            } catch (error) {
              console.error(`Error al obtener bioma en (${worldX}, ${worldZ}):`, error);
              biomeData[chunkKey] = 'unknown';
            }
          }
        }
        
        // Actualizar datos de biomas
        set({ biomeData });
      }
      
      toast.success('Mapa generado', {
        description: `Se han encontrado ${structures.length} estructuras para la semilla ${mapOptions.seed}`
      });
    } catch (error) {
      console.error('Error al generar el mapa:', error);
      toast.error('Error al generar el mapa', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  findStructuresByType: async (structureType, centerX = 0, centerZ = 0, radius = 2000) => {
    const { seed, version } = get();
    
    set({ isLoading: true });
    
    try {
      // Buscar estructuras
      const positions = await findStructures(seed, structureType, centerX, centerZ, radius, version);
      
      // Convertir posiciones a estructuras
      const structures: MinecraftStructure[] = [];
      
      for (const pos of positions) {
        // Obtener el bioma en la posición
        const biome = await getBiomeAt(seed, pos.x, pos.z, version);
        
        // Calcular distancia desde el spawn
        const distanceFromSpawn = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
        
        // Crear estructura
        structures.push({
          type: structureType,
          x: pos.x,
          z: pos.z,
          biome: String(biome), // Convert biome number to string
          distanceFromSpawn,
          version
        });
      }
      
      // Actualizar estructuras
      set({ structures });
      
      toast.success(`Estructuras encontradas`, {
        description: `Se han encontrado ${structures.length} estructuras de tipo ${structureType}`
      });
    } catch (error) {
      console.error(`Error al buscar estructuras de tipo ${structureType}:`, error);
      toast.error('Error al buscar estructuras', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      set({ isLoading: false });
    }
  }
}));
