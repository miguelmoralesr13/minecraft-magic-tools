import { BiomeGenerator, BiomeType } from '../BiomeGenerator';
import { MinecraftStructure } from '../StructureGenerator';
import { AbstractStructureFactory } from './AbstractStructureFactory';

/**
 * Fábrica para la generación de spawners en Minecraft
 */
export class SpawnerFactory extends AbstractStructureFactory {
  /**
   * Tipo de estructura que genera esta fábrica
   */
  readonly structureType = 'spawner' as const;
  
  /**
   * Los spawners pueden generarse en cualquier bioma
   * @param biome Bioma a verificar
   * @returns true siempre, ya que los spawners pueden aparecer en cualquier bioma
   */
  isValidBiome(biome: BiomeType): boolean {
    // Los spawners pueden aparecer en cualquier bioma
    return true;
  }
  
  /**
   * Genera spawners basados en la semilla y parámetros dados
   * @param seed Semilla para la generación
   * @param biomeGenerator Generador de biomas para validar ubicaciones
   * @param range Rango de generación en bloques
   * @returns Array de estructuras de spawners generadas
   */
  generateStructures(seed: string | number, biomeGenerator: BiomeGenerator, range: number): MinecraftStructure[] {
    const spawners: MinecraftStructure[] = [];
    const random = this.createRandom(seed, 'spawners');
    
    // Los spawners aparecen en cuevas y mazmorras
    const count = 20; // Reducido para mejor rendimiento
    const spawnRange = 1500; // Rango en bloques (no en chunks)
    
    for (let i = 0; i < count; i++) {
      const x = random.nextInt(spawnRange * 2) - spawnRange;
      const z = random.nextInt(spawnRange * 2) - spawnRange;
      
      // Los spawners son más comunes subterráneamente, pero para visualización los ponemos en la superficie
      const biome = biomeGenerator.getBiomeAt(x, z);
      
      if (random.nextFloat() < 0.5) { // Mayor probabilidad para compensar menos iteraciones
        spawners.push(this.createStructure(x, z, biome));
      }
    }
    
    return spawners;
  }
}