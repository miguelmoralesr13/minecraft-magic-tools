/**
 * biomeColors.ts
 * Colores para los diferentes biomas de Minecraft
 */

export const biomeColors: Record<string, string> = {
  // Overworld - Biomas terrestres
  'plains': '#8DB360',
  'desert': '#F9D29D',
  'forest': '#056621',
  'taiga': '#0B6659',
  'swamp': '#07F9B2',
  'jungle': '#2C8B0B',
  'savanna': '#BDB25F',
  'badlands': '#D94515',
  'snowy_tundra': '#FFFFFF',
  'mountains': '#888888',
  'dark_forest': '#40511A',
  'mushroom_fields': '#FF00FF',
  'beach': '#FADE55',
  'stone_shore': '#A2A284',
  
  // Overworld - Biomas acuáticos
  'river': '#0000FF',
  'frozen_river': '#A0A0FF',
  'ocean': '#000070',
  'deep_ocean': '#000030',
  'warm_ocean': '#0000A0',
  'lukewarm_ocean': '#000090',
  'cold_ocean': '#202070',
  'frozen_ocean': '#7070D0',
  
  // Nether
  'nether_wastes': '#BF3B3B',
  'soul_sand_valley': '#5E3830',
  'crimson_forest': '#DD0808',
  'warped_forest': '#49907B',
  'basalt_deltas': '#403636',
  
  // End
  'the_end': '#8080FF',
  
  // Valor por defecto para biomas desconocidos
  'Unknown': '#000000'
};