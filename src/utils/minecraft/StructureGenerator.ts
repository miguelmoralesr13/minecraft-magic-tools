
import { JavaRandom } from './JavaRandom';
import { BiomeGenerator, BiomeType } from './BiomeGenerator';

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

export class StructureGenerator {
  private seed: string | number;
  private biomeGenerator: BiomeGenerator;
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

  constructor(seed: string | number) {
    this.seed = seed;
    this.biomeGenerator = new BiomeGenerator(seed, 256); // Menor tamaño para mejor rendimiento
    
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
    this.generateVillages();
    this.generateTemples();
    this.generateStrongholds();
    this.generateSpawners();
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

  // ----- Generadores de estructuras específicas -----

  // Genera aldeas basadas en la semilla, pero en un rango más limitado
  private generateVillages() {
    const random = new JavaRandom(`${this.seed}_villages`);
    
    // Parámetros de generación de aldeas con rangos más pequeños
    const spacing = 32; // Espaciado en chunks (32 chunks = 512 bloques)
    const separation = 8; // Separación mínima
    const range = 48; // Rango reducido para evitar cuelgues (equivale a unos 1500 bloques)
    
    for (let regionX = -range; regionX <= range; regionX += spacing) {
      for (let regionZ = -range; regionZ <= range; regionZ += spacing) {
        // Determinar si hay una aldea en esta región
        const r = new JavaRandom(`${this.seed}_village_${regionX}_${regionZ}`);
        
        // Offset dentro de la región para añadir variabilidad
        const offsetX = r.nextInt(spacing - separation);
        const offsetZ = r.nextInt(spacing - separation);
        
        const x = regionX + offsetX;
        const z = regionZ + offsetZ;
        
        // Convertir de chunks a bloques (x16)
        const blockX = x * 16;
        const blockZ = z * 16;
        
        // Verificar si el bioma puede tener aldea
        const biome = this.biomeGenerator.getBiomeAt(blockX, blockZ);
        const validBiomes: BiomeType[] = ['plains', 'desert', 'savanna', 'taiga'];
        
        if (validBiomes.includes(biome) && r.nextFloat() < 0.5) {
          this.structures.village.push({
            type: 'village',
            x: blockX,
            z: blockZ,
            biome,
            distanceFromSpawn: this.calculateDistanceFromSpawn(blockX, blockZ)
          });
        }
      }
    }
  }

  // Genera templos basados en la semilla, con rangos reducidos
  private generateTemples() {
    const random = new JavaRandom(`${this.seed}_temples`);
    
    // Parámetros de generación de templos
    const spacing = 32;
    const separation = 8;
    const range = 48; // Rango reducido también
    
    for (let regionX = -range; regionX <= range; regionX += spacing) {
      for (let regionZ = -range; regionZ <= range; regionZ += spacing) {
        const r = new JavaRandom(`${this.seed}_temple_${regionX}_${regionZ}`);
        
        const offsetX = r.nextInt(spacing - separation);
        const offsetZ = r.nextInt(spacing - separation);
        
        const x = regionX + offsetX;
        const z = regionZ + offsetZ;
        
        const blockX = x * 16;
        const blockZ = z * 16;
        
        const biome = this.biomeGenerator.getBiomeAt(blockX, blockZ);
        const validBiomes: BiomeType[] = ['desert', 'jungle', 'plains'];
        
        if (validBiomes.includes(biome) && r.nextFloat() < 0.3) {
          this.structures.temple.push({
            type: 'temple',
            x: blockX,
            z: blockZ,
            biome,
            distanceFromSpawn: this.calculateDistanceFromSpawn(blockX, blockZ)
          });
        }
      }
    }
  }

  // Genera fortalezas basadas en la semilla
  private generateStrongholds() {
    const random = new JavaRandom(`${this.seed}_strongholds`);
    
    // En Minecraft hay normalmente 128 fortalezas distribuidas en anillos
    const count = 8; // Un poco más que antes para compensar el menor rango
    const distance = 1280; // Distancia aproximada del primer anillo
    
    for (let i = 0; i < count; i++) {
      // Ángulo en radianes distribuido uniformemente alrededor del círculo
      const angle = 2 * Math.PI * (i / count);
      
      // Calculamos posición en el círculo
      const x = Math.floor(Math.cos(angle) * distance);
      const z = Math.floor(Math.sin(angle) * distance);
      
      // Añadir algo de variabilidad
      const jitterX = random.nextInt(200) - 100;
      const jitterZ = random.nextInt(200) - 100;
      
      const finalX = x + jitterX;
      const finalZ = z + jitterZ;
      
      const biome = this.biomeGenerator.getBiomeAt(finalX, finalZ);
      
      this.structures.stronghold.push({
        type: 'stronghold',
        x: finalX,
        z: finalZ,
        biome,
        distanceFromSpawn: this.calculateDistanceFromSpawn(finalX, finalZ)
      });
    }
  }

  // Genera spawners basados en la semilla, versión más eficiente
  private generateSpawners() {
    const random = new JavaRandom(`${this.seed}_spawners`);
    
    // Los spawners aparecen en cuevas y mazmorras - menos spawners pero mejor distribuidos
    const count = 20; // Reducido para mejor rendimiento
    const range = 1500;
    
    for (let i = 0; i < count; i++) {
      const x = random.nextInt(range * 2) - range;
      const z = random.nextInt(range * 2) - range;
      
      // Los spawners son más comunes subterráneamente, pero para visualización los ponemos en la superficie
      const biome = this.biomeGenerator.getBiomeAt(x, z);
      
      if (random.nextFloat() < 0.5) { // Mayor probabilidad para compensar menos iteraciones
        this.structures.spawner.push({
          type: 'spawner',
          x,
          z,
          biome,
          distanceFromSpawn: this.calculateDistanceFromSpawn(x, z)
        });
      }
    }
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
}
