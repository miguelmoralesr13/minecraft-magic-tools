
/**
 * mapGenerationSlice.ts
 * Store slice for map generation and structure finding
 */

import { StateCreator } from 'zustand';
import { CubiomesStore, MapGenerationOptions, MinecraftStructure } from '@/types/cubiomes';
import { getBiomeAt, findStructures } from '@/utils/minecraft/CubiomesModule';
import { toast } from 'sonner';

type MapGenerationActions = Pick<CubiomesStore, 'generateMap' | 'findStructuresByType'>;

export const createMapGenerationSlice: StateCreator<
  CubiomesStore,
  [],
  [],
  MapGenerationActions
> = (set, get) => ({
  generateMap: async (options) => {
    const { seed, version, filters, showBiomes } = get();
    
    // Configure default options
    const mapOptions: MapGenerationOptions = {
      seed: options?.seed ?? seed,
      version: options?.version ?? version,
      centerX: options?.centerX ?? 0,
      centerZ: options?.centerZ ?? 0,
      radius: options?.radius ?? 5000,
      structureTypes: options?.structureTypes ?? filters,
      showBiomes: options?.showBiomes ?? showBiomes
    };
    
    // Update state if seed or version changes
    if (mapOptions.seed !== seed || mapOptions.version !== version) {
      set({ seed: mapOptions.seed, version: mapOptions.version });
    }
    
    set({ isLoading: true });
    
    try {
      // Generate structures
      const structures: MinecraftStructure[] = [];
      const structureTypes = mapOptions.structureTypes.length > 0 
        ? mapOptions.structureTypes 
        : ['village', 'fortress', 'stronghold', 'monument', 'mansion', 'temple', 'mineshaft', 'ruined_portal', 'outpost', 'spawner'];
      
      // Find each structure type
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
          
          // Convert positions to structures
          for (const pos of positions) {
            // Get biome at position
            const biome = await getBiomeAt(mapOptions.seed, pos.x, pos.z, mapOptions.version);
            
            // Calculate distance from spawn
            const distanceFromSpawn = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
            
            // Create structure, ensuring biome is a string
            structures.push({
              type,
              x: pos.x,
              z: pos.z,
              biome: biome !== null ? String(biome) : 'unknown',
              distanceFromSpawn,
              version: mapOptions.version
            });
          }
        } catch (error) {
          console.error(`Error finding structures of type ${type}:`, error);
        }
      }
      
      // Update structures
      set({ structures });
      
      // Generate biome data if requested
      if (mapOptions.showBiomes) {
        const biomeData: Record<string, string> = {};
        
        // Load biomes in a region around the center
        const chunkRadius = Math.min(mapOptions.radius / 16, 20);
        const centerChunkX = Math.floor(mapOptions.centerX / 16);
        const centerChunkZ = Math.floor(mapOptions.centerZ / 16);
        
        for (let offsetX = -chunkRadius; offsetX <= chunkRadius; offsetX++) {
          for (let offsetZ = -chunkRadius; offsetZ <= chunkRadius; offsetZ++) {
            const chunkX = centerChunkX + offsetX;
            const chunkZ = centerChunkZ + offsetZ;
            const worldX = chunkX * 16 + 8; // Center of the chunk
            const worldZ = chunkZ * 16 + 8;
            const chunkKey = `${chunkX},${chunkZ}`;
            
            try {
              const biomeName = await getBiomeAt(mapOptions.seed, worldX, worldZ, mapOptions.version);
              biomeData[chunkKey] = String(biomeName);
            } catch (error) {
              console.error(`Error getting biome at (${worldX}, ${worldZ}):`, error);
              biomeData[chunkKey] = 'unknown';
            }
          }
        }
        
        // Update biome data
        set({ biomeData });
      }
      
      toast.success('Map generated', {
        description: `Found ${structures.length} structures for seed ${mapOptions.seed}`
      });
    } catch (error) {
      console.error('Error generating map:', error);
      toast.error('Error generating map', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  findStructuresByType: async (structureType, centerX = 0, centerZ = 0, radius = 2000) => {
    const { seed, version } = get();
    
    set({ isLoading: true });
    
    try {
      // Find structures
      const positions = await findStructures(seed, structureType, centerX, centerZ, radius, version);
      
      // Convert positions to structures
      const structures: MinecraftStructure[] = [];
      
      for (const pos of positions) {
        // Get biome at position
        const biome = await getBiomeAt(seed, pos.x, pos.z, version);
        
        // Calculate distance from spawn
        const distanceFromSpawn = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
        
        // Create structure, ensuring biome is a string
        structures.push({
          type: structureType,
          x: pos.x,
          z: pos.z,
          biome: biome !== null ? String(biome) : 'unknown',
          distanceFromSpawn,
          version
        });
      }
      
      // Update structures
      set({ structures });
      
      toast.success(`Structures found`, {
        description: `Found ${structures.length} structures of type ${structureType}`
      });
    } catch (error) {
      console.error(`Error finding structures of type ${structureType}:`, error);
      toast.error('Error finding structures', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      set({ isLoading: false });
    }
  }
});
