import { BiomeGenerator, BiomeType } from '../BiomeGenerator';
import { MinecraftStructure } from '../StructureGenerator';
import { AbstractStructureFactory } from './AbstractStructureFactory';

/**
 * Fábrica para la generación de templos en Minecraft
 */
export class TempleFactory extends AbstractStructureFactory {
  /**
   * Tipo de estructura que genera esta fábrica
   */
  readonly structureType = 'temple' as const;
  
  /**
   * Biomas válidos donde pueden generarse templos
   */
  private readonly validBiomes: BiomeType[] = ['desert', 'jungle', 'plains'];
  
  /**
   * Verifica si un bioma es válido para generar un templo
   * @param biome Bioma a verificar
   * @returns true si el bioma es válido para templos
   */
  isValidBiome(biome: BiomeType): boolean {
    return this.validBiomes.includes(biome);
  }
  
  /**
   * Genera templos basados en la semilla y parámetros dados
   * @param seed Semilla para la generación
   * @param biomeGenerator Generador de biomas para validar ubicaciones
   * @param range Rango de generación en chunks
   * @returns Array de estructuras de templos generadas
   */
  generateStructures(seed: string | number, biomeGenerator: BiomeGenerator, range: number): MinecraftStructure[] {
    const temples: MinecraftStructure[] = [];
    
    // Parámetros de generación de templos
    const spacing = 32; // Espaciado en chunks
    const separation = 8; // Separación mínima
    
    for (let regionX = -range; regionX <= range; regionX += spacing) {
      for (let regionZ = -range; regionZ <= range; regionZ += spacing) {
        // Determinar si hay un templo en esta región
        const r = this.createRandom(seed, `temple_${regionX}_${regionZ}`);
        
        // Offset dentro de la región para añadir variabilidad
        const offsetX = r.nextInt(spacing - separation);
        const offsetZ = r.nextInt(spacing - separation);
        
        const x = regionX + offsetX;
        const z = regionZ + offsetZ;
        
        // Convertir de chunks a bloques (x16)
        const blockX = x * 16;
        const blockZ = z * 16;
        
        // Verificar si el bioma puede tener templo
        const biome = biomeGenerator.getBiomeAt(blockX, blockZ);
        
        // Los templos son menos comunes que las aldeas
        if (this.isValidBiome(biome) && r.nextFloat() < 0.3) {
          temples.push(this.createStructure(blockX, blockZ, biome));
        }
      }
    }
    
    return temples;
  }
}