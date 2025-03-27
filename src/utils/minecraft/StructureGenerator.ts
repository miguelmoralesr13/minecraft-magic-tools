
/**
 * StructureGenerator.ts
 * Generador de estructuras de Minecraft
 */

import { findStructures, getBiomeAt } from './initCubiomes';
import { biomeNames } from './biomeColors';

// Interfaz para estructuras de Minecraft
export interface MinecraftStructure {
  type: string;
  x: number;
  z: number;
  biome: any; // Puede ser un número o un string dependiendo del contexto
  distanceFromSpawn: number;
  version: string;
}

// Tipos de estructuras disponibles
export const STRUCTURE_TYPES = [
  'village',
  'temple',
  'stronghold',
  'monument',
  'mansion',
  'mineshaft',
  'fortress',
  'spawner',
  'outpost',
  'ruined_portal'
];

// Nombres de biomas
export const BIOME_NAMES = biomeNames;

/**
 * Genera estructuras para una semilla dada
 * @param seed Semilla del mundo
 * @param version Versión de Minecraft
 * @param filters Filtros de estructuras
 * @returns Lista de estructuras generadas
 */
export const generateStructures = async (
  seed: string,
  version: string = 'java',
  filters: string[] = STRUCTURE_TYPES
): Promise<MinecraftStructure[]> => {
  console.log(`Generando estructuras para la semilla: ${seed}, versión: ${version}`);
  
  try {
    let allStructures: MinecraftStructure[] = [];
    
    // Generar cada tipo de estructura filtrada
    for (const structureType of filters) {
      console.log(`Buscando estructuras de tipo: ${structureType}`);
      
      // Buscar estructuras de este tipo
      const structures = await findStructures(seed, structureType, 0, 0, 3000, version);
      
      // Añadir las estructuras encontradas
      allStructures = [...allStructures, ...structures];
    }
    
    console.log(`Se encontraron ${allStructures.length} estructuras en total`);
    return allStructures;
  } catch (error) {
    console.error('Error al generar estructuras:', error);
    return [];
  }
};

/**
 * Obtiene el nombre de un bioma a partir de su ID
 * @param biomeId ID del bioma
 * @returns Nombre del bioma
 */
export const getBiomeName = (biomeId: number): string => {
  return BIOME_NAMES[biomeId] || 'Desconocido';
};
