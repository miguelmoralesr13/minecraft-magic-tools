import { BiomeGenerator } from '../BiomeGenerator';
import { MinecraftStructure, StructureType, MinecraftVersion } from '../StructureGenerator';
import { IStructureFactory } from './IStructureFactory';
import { SpawnerFactory } from './SpawnerFactory';
import { StrongholdFactory } from './StrongholdFactory';
import { TempleFactory } from './TempleFactory';
import { VillageFactory } from './VillageFactory';

/**
 * Gestor de fábricas de estructuras de Minecraft
 * Implementa el patrón Factory para la generación de estructuras
 */
export class StructureFactoryManager {
  private factories: Map<StructureType, IStructureFactory>;
  private seed: string | number;
  private biomeGenerator: BiomeGenerator;
  private version: MinecraftVersion;
  private structureCache: Map<string, MinecraftStructure[]> = new Map();
  
  /**
   * Constructor del gestor de fábricas
   * @param seed Semilla para la generación
   * @param biomeGenerator Generador de biomas
   * @param version Versión de Minecraft
   */
  constructor(seed: string | number, biomeGenerator: BiomeGenerator, version: MinecraftVersion = '1.20') {
    this.seed = seed;
    this.biomeGenerator = biomeGenerator;
    this.version = version;
    this.factories = new Map();
    
    // Registrar las fábricas disponibles
    this.registerFactories();
  }
  
  /**
   * Registra todas las fábricas de estructuras disponibles
   */
  private registerFactories(): void {
    // Registrar las fábricas básicas
    this.registerFactory(new VillageFactory());
    this.registerFactory(new TempleFactory());
    this.registerFactory(new StrongholdFactory());
    this.registerFactory(new SpawnerFactory());
    
    // Aquí se pueden registrar más fábricas en el futuro
  }
  
  /**
   * Registra una fábrica de estructuras
   * @param factory Fábrica a registrar
   */
  private registerFactory(factory: IStructureFactory): void {
    this.factories.set(factory.structureType, factory);
  }
  
  /**
   * Establece la versión de Minecraft
   * @param version Nueva versión
   */
  public setVersion(version: MinecraftVersion): void {
    this.version = version;
    // Limpiar caché al cambiar de versión
    this.structureCache.clear();
  }
  
  /**
   * Genera todas las estructuras para todos los tipos registrados
   * @param range Rango de generación en chunks
   * @returns Mapa con todas las estructuras generadas por tipo
   */
  public generateAllStructures(range: number = 48): Record<StructureType, MinecraftStructure[]> {
    const result: Partial<Record<StructureType, MinecraftStructure[]>> = {};
    
    // Generar estructuras para cada tipo de fábrica registrada
    for (const [type, factory] of this.factories.entries()) {
      result[type] = this.generateStructuresWithVersion(factory, range);
    }
    
    // Convertir el resultado parcial a un registro completo
    return result as Record<StructureType, MinecraftStructure[]>;
  }
  
  /**
   * Genera estructuras para un tipo específico
   * @param type Tipo de estructura a generar
   * @param range Rango de generación en chunks
   * @returns Array de estructuras generadas
   */
  public generateStructures(type: StructureType, range: number = 48): MinecraftStructure[] {
    const factory = this.factories.get(type);
    if (!factory) {
      return [];
    }
    
    return this.generateStructuresWithVersion(factory, range);
  }
  
  /**
   * Genera estructuras para un tipo específico considerando la versión de Minecraft
   * @param factory Fábrica de estructuras
   * @param range Rango de generación
   * @returns Array de estructuras generadas
   */
  private generateStructuresWithVersion(factory: IStructureFactory, range: number): MinecraftStructure[] {
    const cacheKey = `${this.seed}_${this.version}_${factory.structureType}_${range}`;
    
    // Verificar si ya tenemos este resultado en caché
    if (this.structureCache.has(cacheKey)) {
      return this.structureCache.get(cacheKey) || [];
    }
    
    // Ajustar parámetros según la versión de Minecraft
    let adjustedRange = range;
    let densityFactor = 1.0;
    
    if (this.version === '1.16') {
      // En 1.16 las estructuras están más espaciadas
      adjustedRange = Math.floor(range * 0.9);
      densityFactor = 0.85;
    } else if (this.version === '1.18') {
      // En 1.18 hay cambios en la generación del terreno y distribución
      adjustedRange = Math.floor(range * 1.0);
      densityFactor = 1.0;
    } else if (this.version === '1.20') {
      // En 1.20 hay más variedad y densidad
      adjustedRange = Math.floor(range * 1.1);
      densityFactor = 1.15;
    }
    
    // Generar estructuras con los parámetros ajustados
    const structures = factory.generateStructures(
      this.seed, 
      this.biomeGenerator, 
      adjustedRange, 
      { version: this.version, densityFactor }
    );
    
    // Guardar en caché
    this.structureCache.set(cacheKey, structures);
    
    return structures;
  }
  
  /**
   * Genera estructuras en un rango específico de chunks
   * @param type Tipo de estructura
   * @param startX Coordenada X inicial (en chunks)
   * @param startZ Coordenada Z inicial (en chunks)
   * @param endX Coordenada X final (en chunks)
   * @param endZ Coordenada Z final (en chunks)
   * @returns Array de estructuras generadas en el rango
   */
  public generateStructuresInRange(
    type: StructureType, 
    startX: number, 
    startZ: number, 
    endX: number, 
    endZ: number
  ): MinecraftStructure[] {
    const factory = this.factories.get(type);
    if (!factory) {
      return [];
    }
    
    const cacheKey = `${this.seed}_${this.version}_${type}_range_${startX}_${startZ}_${endX}_${endZ}`;
    
    // Verificar si ya tenemos este resultado en caché
    if (this.structureCache.has(cacheKey)) {
      return this.structureCache.get(cacheKey) || [];
    }
    
    // Generar todas las estructuras para este tipo
    const allStructures = this.generateStructuresWithVersion(factory, Math.max(endX - startX, endZ - startZ));
    
    // Filtrar las estructuras que están dentro del rango especificado
    const structures = allStructures.filter(structure => {
      const chunkX = Math.floor(structure.x / 16);
      const chunkZ = Math.floor(structure.z / 16);
      return chunkX >= startX && chunkX <= endX && chunkZ >= startZ && chunkZ <= endZ;
    });
    
    // Guardar en caché
    this.structureCache.set(cacheKey, structures);
    
    return structures;
  }
  
  /**
   * Obtiene la fábrica para un tipo de estructura
   * @param type Tipo de estructura
   * @returns Fábrica de estructuras o undefined si no existe
   */
  public getFactory(type: StructureType): IStructureFactory | undefined {
    return this.factories.get(type);
  }
}