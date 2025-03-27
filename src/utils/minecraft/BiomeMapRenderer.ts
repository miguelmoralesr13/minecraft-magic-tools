/**
 * BiomeMapRenderer.ts
 * Renderizador de mapa de biomas utilizando técnicas similares a Chunkbase
 * Implementa un renderizado eficiente píxel por píxel usando ImageData
 */

import { biomeColors } from './biomeColors';

// Interfaz para las opciones de renderizado
export interface BiomeMapRenderOptions {
  canvas: HTMLCanvasElement;
  biomeData: Uint8Array; // Array de índices de biomas
  heightData?: Uint8Array; // Datos de altura opcional
  width: number;
  height: number;
  biomeList: Record<number, { rgb: number[], category?: string, temperature?: number }>;
}

/**
 * Función auxiliar para ajustar el color según la altura
 * Similar a la función 'c' en el código de Chunkbase
 */
const adjustColorByHeight = (height: number, color: number): number => {
  // Ajustar el color basado en la altura
  // Valores más altos = colores más claros, valores más bajos = colores más oscuros
  if (height > 100) {
    return Math.min(255, color + Math.floor((height - 100) / 2));
  } else if (height < 60) {
    return Math.max(0, color - Math.floor((60 - height) / 2));
  }
  return color;
};

/**
 * Convierte los nombres de biomas a un formato compatible con el renderizador
 * @param biomeData Objeto con nombres de biomas por coordenadas de chunk
 * @returns Objeto con información de biomas para renderizado
 */
export const prepareBiomeData = (biomeData: Record<string, string>): {
  biomeIndices: Uint8Array,
  biomeList: Record<number, { rgb: number[], category: string, temperature: number }>
} => {
  // Crear un mapa de nombres de biomas a índices
  const biomeNames = Object.values(biomeData);
  const uniqueBiomes = [...new Set(biomeNames)];
  const biomeToIndex: Record<string, number> = {};
  
  // Asignar índices a cada bioma único
  uniqueBiomes.forEach((name, index) => {
    biomeToIndex[name] = index;
  });
  
  // Crear array de índices de biomas
  const size = Object.keys(biomeData).length;
  const biomeIndices = new Uint8Array(size);
  
  // Llenar el array con los índices correspondientes
  Object.entries(biomeData).forEach(([key, biomeName], index) => {
    biomeIndices[index] = biomeToIndex[biomeName] || 255; // 255 = desconocido
  });
  
  // Crear lista de biomas con información de color
  const biomeList: Record<number, { rgb: number[], category: string, temperature: number }> = {};
  
  uniqueBiomes.forEach((name) => {
    const index = biomeToIndex[name];
    const colorHex = biomeColors[name] || '#000000';
    
    // Convertir color hexadecimal a RGB
    const r = parseInt(colorHex.substring(1, 3), 16);
    const g = parseInt(colorHex.substring(3, 5), 16);
    const b = parseInt(colorHex.substring(5, 7), 16);
    
    // Determinar categoría y temperatura basado en el nombre del bioma
    const isOcean = name.includes('ocean') || name.includes('river');
    const isCold = name.includes('frozen') || name.includes('snowy') || name.includes('cold');
    
    biomeList[index] = {
      rgb: [r, g, b],
      category: isOcean ? 'ocean' : 'land',
      temperature: isCold ? 0 : 1
    };
  });
  
  return { biomeIndices, biomeList };
};

/**
 * Renderiza el mapa de biomas en un canvas utilizando ImageData
 * Implementa un enfoque similar al de Chunkbase para mayor eficiencia
 */
export const renderBiomeMap = (options: BiomeMapRenderOptions): void => {
  const { canvas, biomeData, heightData, width, height, biomeList } = options;
  
  // Obtener el contexto 2D del canvas
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Crear ImageData para manipular píxeles directamente
  const imageData = ctx.createImageData(width, height);
  const pixels = imageData.data;
  
  // Renderizar cada píxel
  for (let i = 0; i < width * height; i++) {
    const biomeIndex = biomeData[i];
    
    // Si el bioma es válido (no es 255 = desconocido)
    if (biomeIndex !== 255) {
      const biome = biomeList[biomeIndex];
      const rgb = biome.rgb;
      
      // Aplicar ajustes de color basados en altura si están disponibles
      if (heightData) {
        const height = heightData[i];
        const isLowElevation = height < 62;
        const isWater = biome.category === 'ocean' || biome.category === 'river';
        const isCold = biome.temperature <= 0.1;
        
        // Aplicar reglas especiales de coloración basadas en elevación y tipo de bioma
        if (isLowElevation && !isWater) {
          // Tierra baja no acuática
          const snowBiomeIndex = isCold ? 11 : 7; // Índices para biomas de nieve o normales
          const snowBiome = biomeList[snowBiomeIndex];
          
          pixels[4*i+0] = adjustColorByHeight(height, snowBiome.rgb[0]); // R
          pixels[4*i+1] = adjustColorByHeight(height, snowBiome.rgb[1]); // G
          pixels[4*i+2] = adjustColorByHeight(height, snowBiome.rgb[2]); // B
        } else if (!isLowElevation && isWater) {
          // Agua en elevación alta
          const waterBiomeIndex = isCold ? 26 : 16; // Índices para agua fría o normal
          const waterBiome = biomeList[waterBiomeIndex];
          
          pixels[4*i+0] = adjustColorByHeight(height, waterBiome.rgb[0]); // R
          pixels[4*i+1] = adjustColorByHeight(height, waterBiome.rgb[1]); // G
          pixels[4*i+2] = adjustColorByHeight(height, waterBiome.rgb[2]); // B
        } else {
          // Caso normal: ajustar color por altura
          pixels[4*i+0] = adjustColorByHeight(height, rgb[0]); // R
          pixels[4*i+1] = adjustColorByHeight(height, rgb[1]); // G
          pixels[4*i+2] = adjustColorByHeight(height, rgb[2]); // B
        }
      } else {
        // Sin datos de altura, usar colores directos
        pixels[4*i+0] = rgb[0]; // R
        pixels[4*i+1] = rgb[1]; // G
        pixels[4*i+2] = rgb[2]; // B
      }
      
      // Establecer canal alfa a completamente opaco
      pixels[4*i+3] = 255; // Alpha
    }
  }
  
  // Dibujar la imagen en el canvas
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Genera datos de altura simulados para pruebas
 * @param width Ancho del mapa
 * @param height Alto del mapa
 * @returns Array de datos de altura
 */
export const generateMockHeightData = (width: number, height: number): Uint8Array => {
  const heightData = new Uint8Array(width * height);
  
  // Generar datos de altura simulados
  for (let z = 0; z < height; z++) {
    for (let x = 0; x < width; x++) {
      // Simular colinas y valles con una función de ruido simple
      const nx = x / width - 0.5;
      const nz = z / height - 0.5;
      const distance = Math.sqrt(nx * nx + nz * nz) * 8;
      const noise = Math.sin(distance * Math.PI) * 20 + 70; // Valor entre 50 y 90
      
      heightData[z * width + x] = Math.floor(noise);
    }
  }
  
  return heightData;
};