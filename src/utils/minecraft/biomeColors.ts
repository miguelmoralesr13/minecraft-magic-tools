
/**
 * biomeColors.ts
 * Colores para los diferentes biomas de Minecraft
 * Basado en los colores usados por Chunkbase
 */

export const biomeColors: { [key: number]: string } = {
  0: '#000000',    // Unknown
  1: '#8DB360',    // Plains
  2: '#F9E49A',    // Desert
  3: '#056621',    // Forest
  4: '#507A32',    // Mountains
  5: '#2D6D77',    // Swamp
  6: '#3F76E4',    // Ocean
  7: '#0E4ECF',    // River
  8: '#31554A',    // Taiga
  9: '#DDD7A0',    // Beach
  10: '#BBB050',   // Savanna
  11: '#14B485',   // Jungle
  12: '#D94515',   // Badlands
  13: '#1E3B18',   // Dark Forest
  14: '#FFFFFF',   // Ice Plains
  15: '#8B6D5C',   // Mushroom Island
  16: '#606060',   // Mountains Edge
  17: '#0000A0',   // Deep Ocean
  18: '#114554',   // Cold Ocean
  19: '#115EA1',   // Warm Ocean
  20: '#141414',   // Deep Warm Ocean
  21: '#0A0A1E',   // Deep Cold Ocean
  22: '#125252',   // Lukewarm Ocean
  23: '#0E2C3A',   // Deep Lukewarm Ocean
  24: '#3D6D33',   // Snowy Tundra
  25: '#2E5E20',   // Snowy Mountains
  26: '#428F3D',   // Snowy Taiga
  27: '#245122',   // Snowy Taiga Mountains
  28: '#4D552B',   // Giant Tree Taiga
  29: '#737A46',   // Giant Tree Taiga Hills
  30: '#BD5B1D',   // Wooded Mountains
  31: '#876B36',   // Wooded Badlands
  32: '#99593D',   // Badlands Plateau
  33: '#D97634',   // Modified Badlands Plateau
  34: '#877165',   // Modified Wooded Badlands Plateau
  35: '#AA7655',   // Modified Wooded Badlands Plateau
  36: '#308955',   // Bamboo Jungle
  37: '#247B5B',   // Bamboo Jungle Hills
  38: '#97BF26',   // Sunflower Plains
  39: '#157C50',   // Desert Lakes
  40: '#589C3A',   // Flower Forest
  41: '#1AAC55',   // Tall Birch Forest
  42: '#FFBC5E',   // Birch Forest Hills
  43: '#1FA34A',   // Dark Forest Hills
  44: '#1E5522',   // Giant Spruce Taiga
  45: '#1E5B1E',   // Modified Gravelly Mountains
  
  // Especiales para overworld
  50: '#8AF9BF',   // The End (para mapas combinados)
  51: '#FF0000',   // Nether (para mapas combinados)
  
  // Nether biomes
  100: '#8B0000',  // Nether Wastes
  101: '#BC4A4A',  // Soul Sand Valley
  102: '#AA6600',  // Crimson Forest
  103: '#26A535',  // Warped Forest
  104: '#684A25',  // Basalt Deltas
  
  // The End biomes
  150: '#2E1B50',  // The End
  151: '#A6A35C',  // Small End Islands
  152: '#A69F90',  // End Midlands
  153: '#E8DDC8',  // End Highlands
  154: '#595550',  // End Barrens
};

export const biomeNames: { [key: number]: string } = {
  0: 'Desconocido',
  1: 'Llanuras',
  2: 'Desierto',
  3: 'Bosque',
  4: 'Montañas',
  5: 'Pantano',
  6: 'Océano',
  7: 'Río',
  8: 'Taiga',
  9: 'Playa',
  10: 'Sabana',
  11: 'Jungla',
  12: 'Badlands',
  13: 'Bosque Oscuro',
  14: 'Tundra',
  15: 'Isla de Hongos',
  16: 'Borde de Montañas',
  17: 'Océano Profundo',
  18: 'Océano Frío',
  19: 'Océano Cálido',
  20: 'Océano Cálido Profundo',
  21: 'Océano Frío Profundo',
  22: 'Océano Templado',
  23: 'Océano Templado Profundo',
  24: 'Tundra Nevada',
  25: 'Montañas Nevadas',
  26: 'Taiga Nevada',
  27: 'Montañas de Taiga Nevada',
  28: 'Taiga de Árboles Gigantes',
  29: 'Colinas de Taiga Gigante',
  30: 'Montañas Boscosas',
  31: 'Badlands Boscosas',
  32: 'Meseta de Badlands',
  33: 'Meseta de Badlands Modificada',
  34: 'Meseta de Badlands Boscosa Modificada',
  35: 'Meseta de Badlands Boscosa',
  36: 'Jungla de Bambú',
  37: 'Colinas de Jungla de Bambú',
  38: 'Llanuras de Girasoles',
  39: 'Lagos del Desierto',
  40: 'Bosque de Flores',
  41: 'Bosque de Abedules Alto',
  42: 'Colinas de Bosque de Abedules',
  43: 'Colinas de Bosque Oscuro',
  44: 'Taiga de Abetos Gigantes',
  45: 'Montañas Pedregosas Modificadas',
  
  // Especiales para overworld
  50: 'The End',
  51: 'Nether',
  
  // Nether biomes
  100: 'Nether Wastes',
  101: 'Soul Sand Valley',
  102: 'Crimson Forest',
  103: 'Warped Forest',
  104: 'Basalt Deltas',
  
  // The End biomes
  150: 'The End',
  151: 'Small End Islands',
  152: 'End Midlands',
  153: 'End Highlands',
  154: 'End Barrens',
};
