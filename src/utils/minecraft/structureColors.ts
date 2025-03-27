/**
 * structureColors.ts
 * Colores para los diferentes tipos de estructuras de Minecraft
 */

export const structureColors: Record<string, string> = {
  'village': '#4CAF50',      // Verde
  'fortress': '#F44336',      // Rojo
  'stronghold': '#9C27B0',    // Púrpura
  'monument': '#2196F3',      // Azul
  'mansion': '#795548',       // Marrón
  'temple': '#FF9800',        // Naranja
  'mineshaft': '#607D8B',     // Gris azulado
  'ruined_portal': '#673AB7', // Violeta
  'outpost': '#FFC107',       // Ámbar
  'spawner': '#E91E63',       // Rosa
  
  // Valor por defecto para estructuras desconocidas
  'unknown': '#000000'        // Negro
};

// Tamaños de iconos para diferentes estructuras
export const structureSizes: Record<string, number> = {
  'village': 24,
  'fortress': 24,
  'stronghold': 28,
  'monument': 26,
  'mansion': 26,
  'temple': 22,
  'mineshaft': 20,
  'ruined_portal': 22,
  'outpost': 22,
  'spawner': 18,
  
  // Valor por defecto
  'unknown': 20
};