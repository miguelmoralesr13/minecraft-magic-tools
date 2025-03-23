
import { JavaRandom } from './JavaRandom';

export type BiomeType = 
  | 'plains' 
  | 'desert' 
  | 'forest' 
  | 'mountains' 
  | 'swamp'
  | 'ocean'
  | 'river'
  | 'taiga'
  | 'beach'
  | 'savanna'
  | 'jungle'
  | 'badlands'
  | 'dark_forest'
  | 'ice_plains'
  | 'mushroom_island';

// Colores por bioma para visualización
export const biomeColors: Record<BiomeType, string> = {
  plains: '#8DB360',
  desert: '#FA9418',
  forest: '#056621',
  mountains: '#606060',
  swamp: '#07F9B2',
  ocean: '#000070',
  river: '#0000FF',
  taiga: '#0B6659',
  beach: '#FADE55',
  savanna: '#BDB25F',
  jungle: '#537B09',
  badlands: '#D94515',
  dark_forest: '#40511A',
  ice_plains: '#FFFFFF',
  mushroom_island: '#FF00FF'
};

export class BiomeGenerator {
  private seed: string | number;
  private randomObj: JavaRandom;
  private cacheSize: number;
  private biomeCache: Map<string, BiomeType>;

  constructor(seed: string | number, cacheSize: number = 256) {
    this.seed = seed;
    this.randomObj = new JavaRandom(seed);
    this.cacheSize = cacheSize;
    this.biomeCache = new Map();
  }

  // Método optimizado que usa caché para reducir cálculos repetidos
  public getBiomeAt(x: number, z: number): BiomeType {
    const key = `${x},${z}`;
    
    // Verificar si ya tenemos este bioma en caché
    if (this.biomeCache.has(key)) {
      return this.biomeCache.get(key)!;
    }
    
    // Si no está en caché, calcularlo
    const temperature = this.getNoiseValue(x * 0.05, z * 0.05, `${this.seed}_temp`);
    const humidity = this.getNoiseValue(x * 0.05, z * 0.05 + 1000, `${this.seed}_humidity`);
    
    let biome: BiomeType;
    
    // Determinación del bioma basado en temperatura y humedad
    if (temperature < 0.1) {
      biome = 'ice_plains';
    } else if (temperature < 0.2) {
      biome = 'taiga';
    } else if (temperature < 0.4) {
      if (humidity > 0.7) biome = 'swamp';
      else biome = 'forest';
    } else if (temperature < 0.7) {
      if (humidity < 0.2) biome = 'desert';
      if (humidity > 0.5) biome = 'jungle';
      else biome = 'plains';
    } else {
      if (humidity < 0.3) biome = 'badlands';
      else biome = 'savanna';
    }
    
    // Guardar en caché para reutilizar
    if (this.biomeCache.size >= this.cacheSize) {
      // Si la caché está llena, eliminar la primera entrada
      const firstKey = this.biomeCache.keys().next().value;
      this.biomeCache.delete(firstKey);
    }
    this.biomeCache.set(key, biome);
    
    return biome;
  }

  // Genera un valor de ruido para las coordenadas dadas
  private getNoiseValue(x: number, z: number, noiseSeed: string): number {
    const random = new JavaRandom(`${noiseSeed}_${Math.floor(x)}_${Math.floor(z)}`);
    
    // Valor base con algo de aleatoriedad
    const base = random.nextFloat();
    
    // Aplicar algoritmo simple de ruido Perlin
    const corners = this.interpolatedCorners(x, z, noiseSeed);
    const noise = (base * 0.4) + (corners * 0.6); // Mezcla entre aleatoriedad y coherencia
    
    // Normalizar entre 0 y 1
    return Math.max(0, Math.min(1, noise));
  }
  
  // Cálculo simplificado de ruido por interpolación de esquinas
  private interpolatedCorners(x: number, z: number, noiseSeed: string): number {
    const x0 = Math.floor(x);
    const z0 = Math.floor(z);
    const x1 = x0 + 1;
    const z1 = z0 + 1;
    
    // Obtener valores de ruido para las cuatro esquinas
    const n00 = this.cornerNoise(x0, z0, noiseSeed);
    const n01 = this.cornerNoise(x0, z1, noiseSeed);
    const n10 = this.cornerNoise(x1, z0, noiseSeed);
    const n11 = this.cornerNoise(x1, z1, noiseSeed);
    
    // Calcular pesos para interpolación
    const sx = x - x0;
    const sz = z - z0;
    
    // Interpolación bilineal
    const nx0 = this.lerp(n00, n10, sx);
    const nx1 = this.lerp(n01, n11, sx);
    return this.lerp(nx0, nx1, sz);
  }
  
  // Valor de ruido para una esquina
  private cornerNoise(x: number, z: number, noiseSeed: string): number {
    const random = new JavaRandom(`${noiseSeed}_corner_${x}_${z}`);
    return random.nextFloat();
  }
  
  // Interpolación lineal
  private lerp(a: number, b: number, t: number): number {
    // Interpolación con suavizado
    const s = t * t * (3 - 2 * t); // Curva suave S
    return a + s * (b - a);
  }
}
