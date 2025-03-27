
/**
 * structureColors.ts
 * Colores para los diferentes tipos de estructuras de Minecraft
 * Basado en los colores usados por Chunkbase
 */

export const structureColors: { [key: string]: string } = {
  village: '#DDB032',       // Aldea - Color amarillo dorado
  temple: '#B35900',        // Templo - Color marrón
  stronghold: '#8000C4',    // Fortaleza del End - Color púrpura
  monument: '#00C4C4',      // Monumento Oceánico - Color turquesa
  mansion: '#8B4513',       // Mansión del Bosque - Color café/marrón oscuro
  mineshaft: '#725038',     // Mina abandonada - Color marrón tierra
  fortress: '#AA0000',      // Fortaleza del Nether - Color rojo
  spawner: '#634125',       // Spawner - Color marrón oscuro
  outpost: '#964B00',       // Outpost - Color cobre
  ruined_portal: '#773600',  // Portal en ruinas - Color bronce
};

// Nombres de estructura en español para mostrar
export const structureNames: { [key: string]: string } = {
  village: 'Aldea',
  temple: 'Templo',
  stronghold: 'Fortaleza del End',
  monument: 'Monumento Oceánico',
  mansion: 'Mansión del Bosque',
  mineshaft: 'Mina Abandonada',
  fortress: 'Fortaleza del Nether',
  spawner: 'Generador de Monstruos',
  outpost: 'Puesto de Avanzada de Pillagers',
  ruined_portal: 'Portal en Ruinas',
};
