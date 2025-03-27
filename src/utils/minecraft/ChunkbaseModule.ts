/**
 * ChunkbaseModule.ts
 * Módulo para implementar la funcionalidad de Chunkbase con integración WebAssembly
 */

import { MinecraftStructure, generateStructures, STRUCTURE_TYPES } from './StructureGenerator';
import { getBiomeAt, findStructures } from './CubiomesModule';

// Interfaz para las opciones de búsqueda de Chunkbase
export interface ChunkbaseOptions {
  seed: string;
  version: string;
  centerX?: number;
  centerZ?: number;
  radius?: number;
  structureTypes?: string[];
  showBiomes?: boolean;
}

// Interfaz para los resultados de Chunkbase
export interface ChunkbaseResult {
  structures: MinecraftStructure[];
  biomeData?: Record<string, string>;
  seed: string;
  version: string;
}

/**
 * Clase principal para la funcionalidad de Chunkbase
 */
export class ChunkbaseModule {
  private seed: string;
  private version: string;
  private structures: MinecraftStructure[];
  private biomeCache: Record<string, string>;
  
  /**
   * Constructor
   * @param seed Semilla del mundo
   * @param version Versión de Minecraft
   */
  constructor(seed: string = '0', version: string = '1.20') {
    this.seed = seed;
    this.version = version;
    this.structures = [];
    this.biomeCache = {};
  }
  
  /**
   * Inicializa el módulo con una nueva semilla y versión
   * @param seed Nueva semilla
   * @param version Nueva versión
   */
  public initialize(seed: string, version: string): void {
    this.seed = seed;
    this.version = version;
    this.structures = [];
    this.biomeCache = {};
  }
  
  /**
   * Genera estructuras para la semilla actual
   * @param options Opciones de generación
   * @returns Promesa con las estructuras generadas
   */
  public async generateStructures(options: ChunkbaseOptions): Promise<ChunkbaseResult> {
    const {
      seed = this.seed,
      version = this.version,
      structureTypes = [],
      radius = 5000
    } = options;
    
    try {
      // En una implementación real, aquí se llamaría a Cubiomes a través de WebAssembly
      // Por ahora, usamos el generador de estructuras simulado
      this.structures = await generateChunkbaseStructures(seed, version, structureTypes, radius);
      
      return {
        structures: this.structures,
        seed,
        version
      };
    } catch (error) {
      console.error('Error al generar estructuras:', error);
      throw new Error(`No se pudieron generar estructuras para la semilla ${seed}`);
    }
  }
  
  /**
   * Obtiene el bioma en una posición específica
   * @param x Coordenada X
   * @param z Coordenada Z
   * @returns Promesa con el nombre del bioma
   */
  public async getBiomeAt(x: number, z: number): Promise<string> {
    const chunkKey = `${Math.floor(x/16)},${Math.floor(z/16)}`;
    
    // Verificar si el bioma ya está en caché
    if (this.biomeCache[chunkKey]) {
      return this.biomeCache[chunkKey];
    }
    
    try {
      // Obtener el bioma usando el módulo Cubiomes
      const biomeName = await getBiomeAt(this.seed, x, z, this.version);
      
      // Guardar en caché
      this.biomeCache[chunkKey] = biomeName;
      
      return biomeName;
    } catch (error) {
      console.error(`Error al obtener el bioma en (${x}, ${z}):`, error);
      return 'unknown';
    }
  }
  
  /**
   * Carga los biomas para una región del mapa
   * @param centerX Centro X de la región
   * @param centerZ Centro Z de la región
   * @param radius Radio en chunks
   * @returns Promesa con los datos de biomas
   */
  public async loadBiomesInRegion(
    centerX: number,
    centerZ: number,
    radius: number = 10
  ): Promise<Record<string, string>> {
    const centerChunkX = Math.floor(centerX / 16);
    const centerChunkZ = Math.floor(centerZ / 16);
    const promises: Promise<void>[] = [];
    
    // Cargar biomas en un área cuadrada alrededor del centro
    for (let offsetX = -radius; offsetX <= radius; offsetX++) {
      for (let offsetZ = -radius; offsetZ <= radius; offsetZ++) {
        const chunkX = centerChunkX + offsetX;
        const chunkZ = centerChunkZ + offsetZ;
        const worldX = chunkX * 16 + 8; // Centro del chunk
        const worldZ = chunkZ * 16 + 8;
        const chunkKey = `${chunkX},${chunkZ}`;
        
        // Si el bioma no está en caché, cargarlo
        if (!this.biomeCache[chunkKey]) {
          promises.push(
            this.getBiomeAt(worldX, worldZ)
              .then(biomeName => {
                this.biomeCache[chunkKey] = biomeName;
              })
              .catch(error => {
                console.error(`Error al cargar bioma en chunk (${chunkX}, ${chunkZ}):`, error);
                this.biomeCache[chunkKey] = 'unknown';
              })
          );
        }
      }
    }
    
    // Esperar a que se carguen todos los biomas
    await Promise.all(promises);
    
    return this.biomeCache;
  }
  
  /**
   * Busca estructuras específicas en una región
   * @param structureType Tipo de estructura a buscar
   * @param centerX Centro X de la búsqueda
   * @param centerZ Centro Z de la búsqueda
   * @param radius Radio de búsqueda
   * @returns Promesa con las estructuras encontradas
   */
  public async findStructures(
    structureType: string,
    centerX: number = 0,
    centerZ: number = 0,
    radius: number = 2000
  ): Promise<MinecraftStructure[]> {
    try {
      // Buscar estructuras usando el módulo Cubiomes
      const structurePositions = await findStructures(
        this.seed,
        structureType,
        centerX,
        centerZ,
        radius,
        this.version
      );
      
      // Convertir las posiciones a estructuras completas
      const structures: MinecraftStructure[] = [];
      
      for (const pos of structurePositions) {
        // Obtener el bioma en la posición de la estructura
        const biome = await this.getBiomeAt(pos.x, pos.z);
        
        // Calcular la distancia desde el spawn (0,0)
        const distanceFromSpawn = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
        
        // Crear la estructura
        structures.push({
          type: structureType,
          x: pos.x,
          z: pos.z,
          biome: String(biome), // Convert number to string
          distanceFromSpawn,
          version: this.version
        });
      }
      
      return structures;
    } catch (error) {
      console.error(`Error al buscar estructuras de tipo ${structureType}:`, error);
      return [];
    }
  }
}

/**
 * Genera estructuras para Chunkbase
 * @param seed Semilla del mundo
 * @param version Versión de Minecraft
 * @param structureTypes Tipos de estructuras a generar
 * @param radius Radio de búsqueda
 * @returns Promesa con las estructuras generadas
 */
async function generateChunkbaseStructures(
  seed: string,
  version: string,
  structureTypes: string[] = [],
  radius: number = 5000
): Promise<MinecraftStructure[]> {
  // Si no se especifican tipos de estructuras, generar todas
  if (structureTypes.length === 0) {
    // Fix the type issue: convert radius (number) to a string version parameter
    return generateStructures(seed, version, STRUCTURE_TYPES);
  }
  
  // Generar estructuras para cada tipo especificado
  const chunkbase = new ChunkbaseModule(seed, version);
  const allStructures: MinecraftStructure[] = [];
  
  for (const type of structureTypes) {
    const structures = await chunkbase.findStructures(type, 0, 0, radius);
    allStructures.push(...structures);
  }
  
  // Ordenar por distancia al spawn
  return allStructures.sort((a, b) => a.distanceFromSpawn - b.distanceFromSpawn);
}
