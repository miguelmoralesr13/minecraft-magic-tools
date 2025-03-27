
/**
 * cubiomes.ts
 * Type definitions for the Cubiomes module
 */

/**
 * Structure object representing a Minecraft structure
 */
export interface MinecraftStructure {
  type: string;
  x: number;
  z: number;
  biome: string;
  distanceFromSpawn: number;
  version: string;
}

/**
 * Options for map generation
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

/**
 * Base state for map
 */
export interface MapBaseState {
  seed: string;
  version: string;
  isLoading: boolean;
}

/**
 * State for structures
 */
export interface StructuresState {
  structures: MinecraftStructure[];
  selectedStructure: MinecraftStructure | null;
  filters: string[];
}

/**
 * State for biomes
 */
export interface BiomesState {
  biomeData: Record<string, string>;
  showBiomes: boolean;
}

/**
 * Actions for the cubiomes store
 */
export interface CubiomesActions {
  // Basic actions
  setSeed: (seed: string) => void;
  setVersion: (version: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  
  // Structure actions
  setStructures: (structures: MinecraftStructure[]) => void;
  setSelectedStructure: (structure: MinecraftStructure | null) => void;
  toggleFilter: (filter: string) => void;
  clearFilters: () => void;
  
  // Biome actions
  setBiomeData: (biomeData: Record<string, string>) => void;
  toggleBiomes: () => void;
  
  // Complex actions
  generateMap: (options?: Partial<MapGenerationOptions>) => Promise<void>;
  findStructuresByType: (structureType: string, centerX?: number, centerZ?: number, radius?: number) => Promise<void>;
}

/**
 * Complete state type for the cubiomes store
 */
export type CubiomesStore = MapBaseState & StructuresState & BiomesState & CubiomesActions;
