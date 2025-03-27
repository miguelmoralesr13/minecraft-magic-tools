/**
 * ChunkbaseCubiomesAdapter.ts
 * Adaptador para integrar la funcionalidad de Chunkbase con Cubiomes
 */

import { MinecraftStructure } from './StructureGenerator';
import { getBiomeAt, findStructures } from './CubiomesModule';
import { initCubiomesWasm } from './CubiomesWebAssembly';

// Interfaz para las opciones de búsqueda
export interface MapGenerationOptions {
  seed: string;
  version: string;
  centerX?: number;
  centerZ?: number;
  radius?: number;
  structureTypes?: string[];
  showBiomes?: boolean;
}

// Interfaz para los resultados del mapa
export interface MapGenerationResult {
  structures: MinecraftStructure[];
  biomeData?: Record<string, string>;
  seed: string;
  version: string;
}

/**
 * Clase adaptadora que conecta la funcionalidad de Chunkbase con Cubiomes
 */
export class ChunkbaseCubiomesAdapter {
  seed: string;
  version: string;
  private biomeCache: Record<string, string>;
  
  /**
   * Constructor
   * @param seed Semilla del mundo
   * @param version Versión de Minecraft
   */
  constructor(seed: string = '0', version: string = '1.20') {
    this.seed = seed;
    this.version = version;
    this.biomeCache = {};
  }
  
  /**
   * Inicializa el adaptador
   * @returns Promesa que se resuelve cuando el módulo está cargado
   */
  public async initialize(): Promise<void> {
    // Cargar el módulo Cubiomes
    await initCubiomesWasm();
    console.log('Adaptador ChunkbaseCubiomes inicializado con semilla:', this.seed);
  }
  
  /**
   * Cambia la semilla y versión actuales
   * @param seed Nueva semilla
   * @param version Nueva versión
   */
  public setSeedAndVersion(seed: string, version: string): void {
    this.seed = seed;
    this.version = version;
    this.biomeCache = {}; // Limpiar caché al cambiar la semilla
  }
  
  /**
   * Genera un mapa con estructuras y biomas
   * @param options Opciones de generación
   * @returns Promesa con el resultado del mapa
   */
  public async generateMap(options: MapGenerationOptions): Promise<MapGenerationResult> {
    const {
      seed = this.seed,
      version = this.version,
      centerX = 0,
      centerZ = 0,
      radius = 5000,
      structureTypes = [],
      showBiomes = false
    } = options;
    
    // Actualizar semilla y versión si son diferentes
    if (seed !== this.seed || version !== this.version) {
      this.setSeedAndVersion(seed, version);
    }
    
    try {
      // Generar estructuras
      const structures = await this.generateStructures(structureTypes, centerX, centerZ, radius);
      
      // Generar datos de biomas si se solicita
      let biomeData: Record<string, string> | undefined;
      if (showBiomes) {
        biomeData = await this.loadBiomesInRegion(centerX, centerZ, Math.min(radius / 16, 20));
      }
      console.log('Biomas generados:', biomeData);
      
      return {
        structures,
        biomeData,
        seed,
        version
      };
    } catch (error) {
      console.error('Error al generar el mapa:', error);
      throw new Error(`No se pudo generar el mapa para la semilla ${seed}`);
    }
  }
  
  /**
   * Genera estructuras para los tipos especificados
   * @param structureTypes Tipos de estructuras a generar
   * @param centerX Centro X de la búsqueda
   * @param centerZ Centro Z de la búsqueda
   * @param radius Radio de búsqueda
   * @returns Promesa con las estructuras generadas
   */
  private async generateStructures(
    structureTypes: string[],
    centerX: number,
    centerZ: number,
    radius: number
  ): Promise<MinecraftStructure[]> {
    // Si no se especifican tipos, usar todos los disponibles
    const typesToGenerate = structureTypes.length > 0 
      ? structureTypes 
      : ['village', 'fortress', 'stronghold', 'monument', 'mansion', 'temple', 'mineshaft', 'ruined_portal', 'outpost', 'spawner'];
    
    const allStructures: MinecraftStructure[] = [];
    
    // Generar estructuras para cada tipo
    for (const type of typesToGenerate) {
      try {
        // Usar Cubiomes para encontrar estructuras
        const structurePositions = await findStructures(
          this.seed,
          type,
          centerX,
          centerZ,
          radius,
          this.version
        );
        
        // Convertir las posiciones a estructuras completas
        for (const pos of structurePositions) {
          // Obtener el bioma en la posición de la estructura
          const biome = await this.getBiomeAt(pos.x, pos.z);
          
          // Calcular la distancia desde el spawn (0,0)
          const distanceFromSpawn = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
          
          // Crear la estructura
          allStructures.push({
            type,
            x: pos.x,
            z: pos.z,
            biome: String(biome), // Convert number to string
            distanceFromSpawn,
            version: this.version
          });
        }
      } catch (error) {
        console.error(`Error al generar estructuras de tipo ${type}:`, error);
      }
    }
    
    // Ordenar por distancia al spawn
    return allStructures.sort((a, b) => a.distanceFromSpawn - b.distanceFromSpawn);
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
}

/**
 * Crea una instancia del adaptador ChunkbaseCubiomes
 * @param seed Semilla del mundo
 * @param version Versión de Minecraft
 * @returns Instancia del adaptador
 */
export const createChunkbaseCubiomesAdapter = async (
  seed: string = '0',
  version: string = '1.20'
): Promise<ChunkbaseCubiomesAdapter> => {
  const adapter = new ChunkbaseCubiomesAdapter(seed, version);
  console.log('Adaptador ChunkbaseCubiomes creado con semilla:', seed,adapter);
  
  await adapter.initialize();
  return adapter;
};
