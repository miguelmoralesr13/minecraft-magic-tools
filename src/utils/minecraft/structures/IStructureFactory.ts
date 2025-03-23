import { BiomeGenerator, BiomeType } from '../BiomeGenerator';
import { MinecraftStructure, StructureType, MinecraftVersion } from '../StructureGenerator';

/**
 * Opciones para la generación de estructuras
 */
export interface StructureGenerationOptions {
  version?: MinecraftVersion;
  densityFactor?: number;
}

/**
 * Interfaz base para todas las fábricas de estructuras de Minecraft
 * Siguiendo el patrón Factory para la generación de estructuras
 */
export interface IStructureFactory {
  /**
   * Tipo de estructura que genera esta fábrica
   */
  readonly structureType: StructureType;
  
  /**
   * Genera estructuras basadas en la semilla y parámetros dados
   * @param seed Semilla para la generación
   * @param biomeGenerator Generador de biomas para validar ubicaciones
   * @param range Rango de generación en chunks
   * @param options Opciones adicionales para la generación (versión, densidad, etc.)
   * @returns Array de estructuras generadas
   */
  generateStructures(
    seed: string | number, 
    biomeGenerator: BiomeGenerator, 
    range: number,
    options?: StructureGenerationOptions
  ): MinecraftStructure[];
  
  /**
   * Verifica si un bioma es válido para esta estructura
   * @param biome Bioma a verificar
   * @param version Versión de Minecraft (opcional)
   * @returns true si el bioma es válido para esta estructura
   */
  isValidBiome(biome: BiomeType, version?: MinecraftVersion): boolean;
  
  /**
   * Calcula la distancia desde el spawn (0,0) a las coordenadas dadas
   * @param x Coordenada X
   * @param z Coordenada Z
   * @returns Distancia en bloques
   */
  calculateDistanceFromSpawn(x: number, z: number): number;
}