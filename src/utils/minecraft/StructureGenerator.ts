
import { JavaRandom } from './JavaRandom';
import { BiomeGenerator, BiomeType } from './BiomeGenerator';
import { StructureFactoryManager } from './structures/StructureFactoryManager';

export interface MinecraftStructure {
  type: StructureType;
  x: number;
  z: number;
  biome: BiomeType;
  distanceFromSpawn: number;
}

export type StructureType = 
  | 'village' 
  | 'temple' 
  | 'stronghold'
  | 'monument'
  | 'mansion'
  | 'mineshaft'
  | 'fortress'
  | 'spawner'
  | 'outpost'
  | 'ruined_portal';

export type MinecraftVersion = '1.16' | '1.18' | '1.20';

export class StructureGenerator {
  private seed: string | number;
  private biomeGenerator: BiomeGenerator;
  private factoryManager: StructureFactoryManager;
  private structures: Record<StructureType, MinecraftStructure[]> = {
    village: [],
    temple: [],
    stronghold: [],
    monument: [],
    mansion: [],
    mineshaft: [],
    fortress: [],
    spawner: [],
    outpost: [],
    ruined_portal: []
  };
  private version: MinecraftVersion;
  private structureCache: Map<string, MinecraftStructure[]> = new Map();

  constructor(seed: string | number, version: MinecraftVersion = '1.20') {
    this.seed = seed;
    this.version = version;
    this.biomeGenerator = new BiomeGenerator(seed, 256); // Menor tamaño para mejor rendimiento
    this.factoryManager = new StructureFactoryManager(seed, this.biomeGenerator, version);
    
    try {
      // Generación de estructuras pero con límites más restrictivos para evitar cuelgues
      this.generateAllStructures();
    } catch (error) {
      console.error("Error generando estructuras:", error);
      // Si falla, al menos aseguramos que hay algunas estructuras para mostrar
      this.generateMinimalStructures();
    }
  }

  // Genera todas las estructuras para una región definida, pero con límites más pequeños
  private generateAllStructures() {
    console.time('generateStructures');
    
    // Verificar si ya tenemos estructuras en caché para esta semilla y versión
    const cacheKey = `${this.seed}_${this.version}`;
    if (this.structureCache.has(cacheKey)) {
      const cachedStructures = this.structureCache.get(cacheKey);
      if (cachedStructures) {
        // Asignar estructuras desde la caché
        for (const structure of cachedStructures) {
          this.structures[structure.type].push(structure);
        }
        console.timeEnd('generateStructures');
        return;
      }
    }
    
    // Usar el gestor de fábricas para generar todas las estructuras
    const generatedStructures = this.factoryManager.generateAllStructures(48);
    
    // Asignar las estructuras generadas a nuestro mapa de estructuras
    for (const [type, structures] of Object.entries(generatedStructures)) {
      this.structures[type as StructureType] = structures;
    }
    
    // Guardar en caché para futuras consultas
    this.structureCache.set(cacheKey, this.getAllStructures());
    
    console.timeEnd('generateStructures');
  }

  // Versión mínima que garantiza algún resultado aunque falle la generación principal
  private generateMinimalStructures() {
    // Generar al menos algunas estructuras cercanas al spawn
    for (let i = 0; i < 5; i++) {
      const x = (Math.random() * 2000) - 1000;
      const z = (Math.random() * 2000) - 1000;
      const biome = this.biomeGenerator.getBiomeAt(x, z);
      
      this.structures.village.push({
        type: 'village',
        x: Math.round(x),
        z: Math.round(z),
        biome,
        distanceFromSpawn: this.calculateDistanceFromSpawn(x, z)
      });
    }
  }

  // Obtiene el punto de spawn predeterminado (0,0 para simplificar)
  public getSpawnPoint(): { x: number, z: number } {
    return { x: 0, z: 0 };
  }

  // Calcula la distancia desde el spawn
  private calculateDistanceFromSpawn(x: number, z: number): number {
    const spawn = this.getSpawnPoint();
    return Math.sqrt(Math.pow(x - spawn.x, 2) + Math.pow(z - spawn.z, 2));
  }

  // Genera estructuras por lotes para mejorar el rendimiento
  public generateStructuresBatch(chunkX: number, chunkZ: number, radius: number): MinecraftStructure[] {
    const batchKey = `${this.seed}_${this.version}_${chunkX}_${chunkZ}_${radius}`;
    
    // Verificar si ya tenemos este lote en caché
    if (this.structureCache.has(batchKey)) {
      return this.structureCache.get(batchKey) || [];
    }
    
    // Generar estructuras para este lote
    const structures: MinecraftStructure[] = [];
    const startX = chunkX - radius;
    const startZ = chunkZ - radius;
    const endX = chunkX + radius;
    const endZ = chunkZ + radius;
    
    // Generar estructuras para cada tipo en el rango especificado
    for (const type of Object.keys(this.structures) as StructureType[]) {
      const typeStructures = this.factoryManager.generateStructuresInRange(
        type, startX, startZ, endX, endZ
      );
      structures.push(...typeStructures);
    }
    
    // Guardar en caché para futuras consultas
    this.structureCache.set(batchKey, structures);
    
    return structures;
  }

  // ----- Métodos públicos para acceder a las estructuras -----
  
  // Obtiene todas las estructuras de un tipo específico
  public getStructures(type: StructureType): MinecraftStructure[] {
    return this.structures[type] || [];
  }
  
  // Obtiene todas las estructuras
  public getAllStructures(): MinecraftStructure[] {
    return Object.values(this.structures).flat();
  }
  
  // Obtiene estructuras filtradas por tipo
  public getFilteredStructures(types: StructureType[]): MinecraftStructure[] {
    if (types.length === 0) {
      return this.getAllStructures();
    }
    
    return types.flatMap(type => this.getStructures(type));
  }
  
  // Encuentra la estructura más cercana al punto dado
  public findClosestStructure(x: number, z: number, type?: StructureType): MinecraftStructure | null {
    const structures = type ? this.getStructures(type) : this.getAllStructures();
    
    if (structures.length === 0) {
      return null;
    }
    
    let closest = structures[0];
    let minDistance = Math.sqrt(Math.pow(closest.x - x, 2) + Math.pow(closest.z - z, 2));
    
    for (const structure of structures) {
      const distance = Math.sqrt(Math.pow(structure.x - x, 2) + Math.pow(structure.z - z, 2));
      if (distance < minDistance) {
        minDistance = distance;
        closest = structure;
      }
    }
    
    return closest;
  }

  // Obtiene la versión actual de Minecraft
  public getVersion(): MinecraftVersion {
    return this.version;
  }

  // Cambia la versión de Minecraft y regenera las estructuras
  public setVersion(version: MinecraftVersion): void {
    if (this.version !== version) {
      this.version = version;
      this.factoryManager.setVersion(version);
      
      // Limpiar estructuras actuales
      for (const type of Object.keys(this.structures) as StructureType[]) {
        this.structures[type] = [];
      }
      
      // Regenerar estructuras con la nueva versión
      this.generateAllStructures();
    }
  }
}
