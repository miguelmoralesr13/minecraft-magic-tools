/**
 * StructureGenerator.ts
 * Generador de estructuras de Minecraft basado en semillas
 */

import seedrandom from 'seedrandom';

// Tipos de estructuras disponibles en Minecraft
export const STRUCTURE_TYPES = [
  'village',
  'fortress',
  'stronghold',
  'monument',
  'mansion',
  'temple',
  'mineshaft',
  'ruined_portal',
  'outpost',
  'spawner'
];

// Nombres de biomas en Minecraft
export const BIOME_NAMES = [
  'plains',
  'desert',
  'forest',
  'taiga',
  'swamp',
  'jungle',
  'savanna',
  'badlands',
  'snowy_tundra',
  'mountains',
  'dark_forest',
  'ocean',
  'deep_ocean',
  'warm_ocean',
  'lukewarm_ocean',
  'cold_ocean',
  'frozen_ocean',
  'mushroom_fields',
  'beach',
  'stone_shore',
  'river',
  'frozen_river',
  'nether_wastes',
  'soul_sand_valley',
  'crimson_forest',
  'warped_forest',
  'basalt_deltas',
  'the_end'
];

// Interfaz para las estructuras de Minecraft
export interface MinecraftStructure {
  type: string;
  x: number;
  z: number;
  biome: string;
  distanceFromSpawn: number;
  version: string;
}

/**
 * Genera estructuras aleatorias basadas en una semilla
 * @param seed Semilla para la generación
 * @param count Número de estructuras a generar
 * @param version Versión de Minecraft (java o bedrock)
 * @returns Array de estructuras generadas
 */
export const generateStructures = (seed: string, count: number = 100, version: string = 'java'): MinecraftStructure[] => {
  // Inicializar el generador de números aleatorios con la semilla
  const rng = seedrandom(seed);
  const structures: MinecraftStructure[] = [];
  
  // Generar estructuras aleatorias
  for (let i = 0; i < count; i++) {
    // Seleccionar un tipo de estructura aleatorio
    const typeIndex = Math.floor(rng() * STRUCTURE_TYPES.length);
    const type = STRUCTURE_TYPES[typeIndex];
    
    // Generar coordenadas aleatorias (centradas alrededor del origen)
    // El rango es mayor para estructuras más raras
    let range = 2000;
    if (type === 'stronghold' || type === 'monument' || type === 'mansion') {
      range = 8000;
    } else if (type === 'village' || type === 'temple') {
      range = 4000;
    }
    
    const x = Math.floor(rng() * range * 2 - range);
    const z = Math.floor(rng() * range * 2 - range);
    
    // Seleccionar un bioma aleatorio apropiado para la estructura
    let biomeIndex;
    switch (type) {
      case 'village':
        // Las aldeas aparecen en llanuras, desiertos, sabanas y taiga
        biomeIndex = Math.floor(rng() * 4);
        const villageBiomes = ['plains', 'desert', 'savanna', 'taiga'];
        var biome = villageBiomes[biomeIndex];
        break;
      case 'fortress':
        // Las fortalezas aparecen en el Nether
        biome = 'nether_wastes';
        break;
      case 'stronghold':
        // Los strongholds pueden aparecer en cualquier bioma del Overworld
        biomeIndex = Math.floor(rng() * 22); // Excluir biomas del Nether y End
        biome = BIOME_NAMES[biomeIndex];
        break;
      case 'monument':
        // Los monumentos aparecen en océanos
        biomeIndex = Math.floor(rng() * 5);
        const oceanBiomes = ['ocean', 'deep_ocean', 'warm_ocean', 'lukewarm_ocean', 'cold_ocean'];
        biome = oceanBiomes[biomeIndex];
        break;
      case 'mansion':
        // Las mansiones aparecen en bosques oscuros
        biome = 'dark_forest';
        break;
      case 'temple':
        // Los templos aparecen en desiertos, junglas y hielo
        biomeIndex = Math.floor(rng() * 3);
        const templeBiomes = ['desert', 'jungle', 'snowy_tundra'];
        biome = templeBiomes[biomeIndex];
        break;
      case 'mineshaft':
        // Las minas abandonadas pueden aparecer en cualquier bioma
        biomeIndex = Math.floor(rng() * BIOME_NAMES.length);
        biome = BIOME_NAMES[biomeIndex];
        break;
      case 'ruined_portal':
        // Los portales en ruinas pueden aparecer en cualquier bioma
        biomeIndex = Math.floor(rng() * BIOME_NAMES.length);
        biome = BIOME_NAMES[biomeIndex];
        break;
      case 'outpost':
        // Los puestos de avanzada aparecen en varios biomas
        biomeIndex = Math.floor(rng() * 5);
        const outpostBiomes = ['plains', 'desert', 'taiga', 'savanna', 'snowy_tundra'];
        biome = outpostBiomes[biomeIndex];
        break;
      case 'spawner':
        // Los spawners pueden aparecer en cualquier bioma subterráneo
        biomeIndex = Math.floor(rng() * 22); // Excluir biomas del Nether y End
        biome = BIOME_NAMES[biomeIndex];
        break;
      default:
        biomeIndex = Math.floor(rng() * BIOME_NAMES.length);
        biome = BIOME_NAMES[biomeIndex];
    }
    
    // Calcular la distancia desde el spawn (0,0)
    const distanceFromSpawn = Math.sqrt(x * x + z * z);
    
    // Añadir la estructura al array
    structures.push({
      type,
      x,
      z,
      biome,
      distanceFromSpawn,
      version
    });
  }
  
  // Ordenar las estructuras por distancia al spawn
  return structures.sort((a, b) => a.distanceFromSpawn - b.distanceFromSpawn);
};

/**
 * Genera estructuras específicas para una semilla y versión
 * Esta función simula la generación de estructuras de Chunkbase
 * @param seed Semilla para la generación
 * @param version Versión de Minecraft
 * @returns Array de estructuras generadas
 */
export const generateChunkbaseStructures = async (seed: string, version: string = 'java'): Promise<MinecraftStructure[]> => {
  // En una implementación real, aquí se llamaría a la biblioteca Cubiomes a través de WebAssembly
  // Por ahora, usamos el generador aleatorio como placeholder
  return generateStructures(seed, 150, version);
};