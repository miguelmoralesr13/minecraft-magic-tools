import { BiomeGenerator, BiomeType } from '../BiomeGenerator';
import { JavaRandom } from '../JavaRandom';
import { MinecraftStructure } from '../StructureGenerator';
import { AbstractStructureFactory } from './AbstractStructureFactory';

/**
 * Fábrica para la generación de aldeas en Minecraft
 */
export class VillageFactory extends AbstractStructureFactory {
  /**
   * Tipo de estructura que genera esta fábrica
   */
  readonly structureType = 'village' as const;
  
  /**
   * Biomas válidos donde pueden generarse aldeas
   */
  private readonly validBiomes: BiomeType[] = ['plains', 'desert', 'savanna', 'taiga'];
  
  /**
   * Verifica si un bioma es válido para generar una aldea
   * @param biome Bioma a verificar
   * @returns true si el bioma es válido para aldeas
   */
  isValidBiome(biome: BiomeType): boolean {
    return this.validBiomes.includes(biome);
  }
  
  /**
   * Genera aldeas basadas en la semilla y parámetros dados
   * @param seed Semilla para la generación
   * @param biomeGenerator Generador de biomas para validar ubicaciones
   * @param range Rango de generación en chunks
   * @returns Array de estructuras de aldeas generadas
   */
  generateStructures(seed: string | number, biomeGenerator: BiomeGenerator, range: number): MinecraftStructure[] {
    const villages: MinecraftStructure[] = [];
    
    // Parámetros de generación de aldeas
    const spacing = 32; // Espaciado en chunks (32 chunks = 512 bloques)
    const separation = 8; // Separación mínima
    
    for (let regionX = -range; regionX <= range; regionX += spacing) {
      for (let regionZ = -range; regionZ <= range; regionZ += spacing) {
        // Determinar si hay una aldea en esta región
        const r = this.createRandom(seed, `village_${regionX}_${regionZ}`);
        
        // Offset dentro de la región para añadir variabilidad
        const offsetX = r.nextInt(spacing - separation);
        const offsetZ = r.nextInt(spacing - separation);
        
        const x = regionX + offsetX;
        const z = regionZ + offsetZ;
        
        // Convertir de chunks a bloques (x16)
        const blockX = x * 16;
        const blockZ = z * 16;
        
        // Verificar si el bioma puede tener aldea
        const biome = biomeGenerator.getBiomeAt(blockX, blockZ);
        
        if (this.isValidBiome(biome) && r.nextFloat() < 0.5) {
          villages.push(this.createStructure(blockX, blockZ, biome));
        }
      }
    }
    
    return villages;
  }
}