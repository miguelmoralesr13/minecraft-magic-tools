
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
  private random: JavaRandom;
  private temperatureNoise: number[][];
  private humidityNoise: number[][];
  private size: number;

  constructor(seed: string | number, size: number = 1000) {
    this.random = new JavaRandom(seed);
    this.size = size;
    
    // Inicializar mapas de ruido de temperatura y humedad
    this.temperatureNoise = this.generateNoiseMap(size, 8);
    this.humidityNoise = this.generateNoiseMap(size, 8);
  }

  // Genera un mapa de ruido simple
  private generateNoiseMap(size: number, octaves: number): number[][] {
    const noise: number[][] = [];
    
    for (let x = 0; x < size; x++) {
      noise[x] = [];
      for (let z = 0; z < size; z++) {
        // Valor de ruido basado en la semilla y posición
        let value = 0;
        let amplitude = 1.0;
        let frequency = 1.0;
        
        for (let i = 0; i < octaves; i++) {
          const noiseX = this.random.nextFloat() * frequency;
          const noiseZ = this.random.nextFloat() * frequency;
          value += this.interpolatedNoise(x * noiseX, z * noiseZ) * amplitude;
          
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        
        noise[x][z] = value;
      }
    }
    
    return noise;
  }

  // Ruido interpolado suave
  private interpolatedNoise(x: number, z: number): number {
    const intX = Math.floor(x);
    const intZ = Math.floor(z);
    const fractX = x - intX;
    const fractZ = z - intZ;
    
    const v1 = this.smoothNoise(intX, intZ);
    const v2 = this.smoothNoise(intX + 1, intZ);
    const v3 = this.smoothNoise(intX, intZ + 1);
    const v4 = this.smoothNoise(intX + 1, intZ + 1);
    
    const i1 = this.interpolate(v1, v2, fractX);
    const i2 = this.interpolate(v3, v4, fractX);
    
    return this.interpolate(i1, i2, fractZ);
  }

  // Interpolación cúbica
  private interpolate(a: number, b: number, x: number): number {
    const ft = x * Math.PI;
    const f = (1 - Math.cos(ft)) * 0.5;
    return a * (1 - f) + b * f;
  }

  // Ruido suavizado
  private smoothNoise(x: number, z: number): number {
    const seed = (x * 13031 + z * 54323) % 10000;
    this.random.skip(seed);
    return this.random.nextFloat();
  }

  // Obtiene el bioma en una coordenada específica
  public getBiomeAt(x: number, z: number): BiomeType {
    // Ajustar coordenadas para que estén dentro del mapa de ruido
    const adjustedX = ((x % this.size) + this.size) % this.size;
    const adjustedZ = ((z % this.size) + this.size) % this.size;
    
    const temperature = this.temperatureNoise[adjustedX][adjustedZ];
    const humidity = this.humidityNoise[adjustedX][adjustedZ];
    
    // Determinación del bioma basado en temperatura y humedad
    if (temperature < 0.1) {
      return 'ice_plains';
    } else if (temperature < 0.2) {
      return 'taiga';
    } else if (temperature < 0.4) {
      if (humidity > 0.7) return 'swamp';
      return 'forest';
    } else if (temperature < 0.7) {
      if (humidity < 0.2) return 'desert';
      if (humidity > 0.5) return 'jungle';
      return 'plains';
    } else {
      if (humidity < 0.3) return 'badlands';
      return 'savanna';
    }
  }
}
