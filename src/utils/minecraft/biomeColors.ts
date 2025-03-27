
/**
 * biomeColors.ts
 * Colores para los diferentes biomas de Minecraft
 */

// Mapa de colores para los biomas
export const biomeColors: Record<string | number, string> = {
  // Biomas básicos
  1: '#8DB360', // Plains - Llanuras
  2: '#F9E49A', // Desert - Desierto
  3: '#056621', // Forest - Bosque
  4: '#507A32', // Mountains - Montañas
  5: '#2D6D77', // Swamp - Pantano
  6: '#3F76E4', // Ocean - Océano
  7: '#0E4ECF', // River - Río
  8: '#31554A', // Taiga
  9: '#DDD7A0', // Beach - Playa
  10: '#BBB050', // Savanna - Sabana
  11: '#14B485', // Jungle - Jungla
  12: '#D94515', // Badlands - Badlands
  13: '#1E3B18', // Dark Forest - Bosque Oscuro
  14: '#FFFFFF', // Ice Plains - Llanuras de Hielo
  15: '#8B6D5C', // Mushroom Island - Isla de Hongos
  
  // También permitir acceso por nombre
  'plains': '#8DB360',
  'desert': '#F9E49A',
  'forest': '#056621',
  'mountains': '#507A32',
  'swamp': '#2D6D77',
  'ocean': '#3F76E4',
  'river': '#0E4ECF',
  'taiga': '#31554A',
  'beach': '#DDD7A0',
  'savanna': '#BBB050',
  'jungle': '#14B485',
  'badlands': '#D94515',
  'dark_forest': '#1E3B18',
  'ice_plains': '#FFFFFF',
  'mushroom_island': '#8B6D5C',
  
  // Valor por defecto para biomas desconocidos
  'unknown': '#000000',
  0: '#000000'
};

// Mapa de colores para las estructuras
export const structureColors: Record<string, string> = {
  'village': '#7F7F7F',
  'temple': '#FFD700',
  'stronghold': '#FF00FF',
  'monument': '#00FFFF',
  'mansion': '#8B4513',
  'mineshaft': '#8B8B8B',
  'fortress': '#FF0000',
  'spawner': '#00FF00',
  'outpost': '#FFA500',
  'ruined_portal': '#9932CC'
};

// Mapa de nombres para los biomas
export const biomeNames: Record<number, string> = {
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
  14: 'Llanuras Heladas',
  15: 'Isla de Hongos'
};

// Mapa de nombres para las estructuras
export const structureNames: Record<string, string> = {
  'village': 'Aldea',
  'temple': 'Templo',
  'stronghold': 'Fortaleza del End',
  'monument': 'Monumento Oceánico',
  'mansion': 'Mansión del Bosque',
  'mineshaft': 'Mina Abandonada',
  'fortress': 'Fortaleza del Nether',
  'spawner': 'Generador de Monstruos',
  'outpost': 'Puesto de Pillagers',
  'ruined_portal': 'Portal en Ruinas'
};
