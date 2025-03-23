import { BiomeGenerator, BiomeType } from '../BiomeGenerator';
import { JavaRandom } from '../JavaRandom';
import { MinecraftStructure, StructureType } from '../StructureGenerator';
import { IStructureFactory } from './IStructureFactory';

/**
 * Clase abstracta base que implementa la interfaz IStructureFactory
 * Proporciona implementaciones comunes para todos los generadores de estructuras
 */
export abstract class AbstractStructureFactory implements IStructureFactory {
  /**
   * Tipo de estructura que genera esta fábrica
   */
  abstract readonly structureType: StructureType;
  
  /**
   * Genera estructuras basadas en la semilla y parámetros dados
   * @param seed Semilla para la generación
   * @param biomeGenerator Generador de biomas para validar ubicaciones
   * @param range Rango de generación en chunks
   * @returns Array de estructuras generadas
   */
  abstract generateStructures(seed: string | number, biomeGenerator: BiomeGenerator, range: number): MinecraftStructure[];
  
  /**
   * Verifica si un bioma es válido para esta estructura
   * @param biome Bioma a verificar
   * @returns true si el bioma es válido para esta estructura
   */
  abstract isValidBiome(biome: BiomeType): boolean;
  
  /**
   * Obtiene el punto de spawn predeterminado (0,0 para simplificar)
   * @returns Coordenadas del punto de spawn
   */
  protected getSpawnPoint(): { x: number, z: number } {
    return { x: 0, z: 0 };
  }
  
  /**
   * Calcula la distancia desde el spawn (0,0) a las coordenadas dadas
   * @param x Coordenada X
   * @param z Coordenada Z
   * @returns Distancia en bloques
   */
  calculateDistanceFromSpawn(x: number, z: number): number {
    const spawn = this.getSpawnPoint();
    return Math.sqrt(Math.pow(x - spawn.x, 2) + Math.pow(z - spawn.z, 2));
  }
  
  /**
   * Crea una instancia de JavaRandom con una semilla derivada
   * @param seed Semilla base
   * @param suffix Sufijo para derivar una subsemilla
   * @returns Instancia de JavaRandom
   */
  protected createRandom(seed: string | number, suffix: string): JavaRandom {
    return new JavaRandom(`${seed}_${suffix}`);
  }
  
  /**
   * Crea una estructura de Minecraft con los parámetros dados
   * @param x Coordenada X en bloques
   * @param z Coordenada Z en bloques
   * @param biome Bioma donde se encuentra la estructura
   * @returns Objeto MinecraftStructure
   */
  protected createStructure(x: number, z: number, biome: BiomeType): MinecraftStructure {
    return {
      type: this.structureType,
      x,
      z,
      biome,
      distanceFromSpawn: this.calculateDistanceFromSpawn(x, z)
    };
  }
}