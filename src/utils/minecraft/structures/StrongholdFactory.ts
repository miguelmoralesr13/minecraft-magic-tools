import { BiomeGenerator, BiomeType } from '../BiomeGenerator';
import { MinecraftStructure } from '../StructureGenerator';
import { AbstractStructureFactory } from './AbstractStructureFactory';

/**
 * Fábrica para la generación de fortalezas en Minecraft
 */
export class StrongholdFactory extends AbstractStructureFactory {
  /**
   * Tipo de estructura que genera esta fábrica
   */
  readonly structureType = 'stronghold' as const;
  
  /**
   * Las fortalezas pueden generarse en cualquier bioma terrestre
   * @param biome Bioma a verificar
   * @returns true si el bioma es válido para fortalezas
   */
  isValidBiome(biome: BiomeType): boolean {
    // Las fortalezas pueden generarse en casi cualquier bioma terrestre
    const invalidBiomes: BiomeType[] = ['ocean', 'river', 'beach'];
    return !invalidBiomes.includes(biome);
  }
  
  /**
   * Genera fortalezas basadas en la semilla y parámetros dados
   * @param seed Semilla para la generación
   * @param biomeGenerator Generador de biomas para validar ubicaciones
   * @param range Rango de generación en chunks (ignorado para fortalezas)
   * @returns Array de estructuras de fortalezas generadas
   */
  generateStructures(seed: string | number, biomeGenerator: BiomeGenerator, range: number): MinecraftStructure[] {
    const strongholds: MinecraftStructure[] = [];
    const random = this.createRandom(seed, 'strongholds');
    
    // En Minecraft hay normalmente 128 fortalezas distribuidas en anillos
    const count = 8; // Reducido para mejor rendimiento
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
      
      const biome = biomeGenerator.getBiomeAt(finalX, finalZ);
      
      // Las fortalezas se generan independientemente del bioma
      strongholds.push(this.createStructure(finalX, finalZ, biome));
    }
    
    return strongholds;
  }
}