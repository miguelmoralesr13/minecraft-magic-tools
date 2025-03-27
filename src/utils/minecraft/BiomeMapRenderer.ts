
/**
 * BiomeMapRenderer.ts
 * Renderizador de mapa de biomas utilizando técnicas similares a Chunkbase
 * Implementa un renderizado eficiente píxel por píxel usando ImageData
 */

import { biomeColors, biomeNames } from './biomeColors';
import { getBiomeAt } from './initCubiomes';

// Interfaz para las opciones de renderizado del mapa
export interface BiomeMapRenderOptions {
  canvas: HTMLCanvasElement;
  seed: string;
  version: string;
  centerX: number;
  centerZ: number;
  zoom: number;
  width: number;
  height: number;
  showBiomes: boolean;
}

/**
 * Renderiza un mapa de biomas de Minecraft de forma eficiente
 * Usa técnica de ImageData para manipular píxeles directamente en lugar de fillRect
 */
export const renderBiomeMap = async (options: BiomeMapRenderOptions): Promise<void> => {
  const { 
    canvas, 
    seed, 
    version, 
    centerX, 
    centerZ, 
    zoom, 
    width, 
    height,
    showBiomes 
  } = options;
  
  // Obtener el contexto 2D
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Crear un ImageData para manipular píxeles directamente
  const imageData = ctx.createImageData(width, height);
  const pixels = imageData.data;
  
  // Tamaño de un chunk en bloques
  const chunkSize = 16;
  // Escala: cuántos píxeles por bloque
  const blockScale = zoom;
  // Tamaño de la región a cargar (en bloques)
  const blocksWidth = Math.ceil(width / blockScale);
  const blocksHeight = Math.ceil(height / blockScale);
  
  // Calcular las coordenadas de inicio en el mundo
  const startX = Math.floor(centerX - blocksWidth / 2);
  const startZ = Math.floor(centerZ - blocksHeight / 2);
  
  // Biome cache para evitar recalcular biomas repetidos
  const biomeCache: Record<string, number> = {};
  
  // Función para obtener el bioma con caché
  const getBiomeCached = async (x: number, z: number): Promise<number> => {
    const key = `${x},${z}`;
    if (biomeCache[key] !== undefined) {
      return biomeCache[key];
    }
    
    const biome = await getBiomeAt(seed, x, z, version);
    biomeCache[key] = biome;
    return biome;
  };
  
  // Color de fondo para cuando no se muestran biomas
  if (!showBiomes) {
    // Fondo gris claro
    for (let i = 0; i < width * height; i++) {
      pixels[4*i + 0] = 242; // R
      pixels[4*i + 1] = 242; // G
      pixels[4*i + 2] = 242; // B
      pixels[4*i + 3] = 255; // A
    }
    
    // Dibujar cuadrícula
    for (let z = 0; z < height; z++) {
      for (let x = 0; x < width; x++) {
        // Posición en bloques del mundo
        const worldX = startX + Math.floor(x / blockScale);
        const worldZ = startZ + Math.floor(z / blockScale);
        
        // Si estamos en el borde de un chunk, dibujamos líneas
        if (worldX % chunkSize === 0 || worldZ % chunkSize === 0) {
          pixels[4*(z * width + x) + 0] = 200; // R
          pixels[4*(z * width + x) + 1] = 200; // G
          pixels[4*(z * width + x) + 2] = 200; // B
        }
      }
    }
  } else {
    // Cargamos biomas para cada píxel
    const loadBiomesPromises: Promise<void>[] = [];
    
    // Recorrer por píxel de pantalla
    for (let z = 0; z < height; z++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = z * width + x;
        
        // Coordenadas del mundo para este píxel
        const worldX = startX + Math.floor(x / blockScale);
        const worldZ = startZ + Math.floor(z / blockScale);
        
        // Solo cargar un bioma por cada posición del mundo
        // (esto optimiza no cargar varias veces el mismo bloque)
        const promiseForPixel = (async () => {
          // No obtenemos el bioma de cada píxel, sino de cada bloque del mundo
          // Esto reduce enormemente las llamadas a getBiomeAt
          const biome = await getBiomeCached(worldX, worldZ);
          
          // Obtener color del bioma
          const colorHex = biomeColors[biome] || '#888888';
          
          // Convertir color hexadecimal a RGB
          const r = parseInt(colorHex.substring(1, 3), 16);
          const g = parseInt(colorHex.substring(3, 5), 16);
          const b = parseInt(colorHex.substring(5, 7), 16);
          
          // Ajustar color por posición para dar efecto de variación
          const variation = (((worldX % 4) + (worldZ % 4)) % 3) - 1; // -1, 0, 1
          
          // Escribir en los píxeles
          pixels[4*pixelIndex + 0] = Math.min(255, Math.max(0, r + variation * 5)); // R
          pixels[4*pixelIndex + 1] = Math.min(255, Math.max(0, g + variation * 5)); // G
          pixels[4*pixelIndex + 2] = Math.min(255, Math.max(0, b + variation * 5)); // B
          pixels[4*pixelIndex + 3] = 255; // A
        })();
        
        loadBiomesPromises.push(promiseForPixel);
      }
    }
    
    // Esperar a que terminen todas las promesas de carga
    await Promise.all(loadBiomesPromises);
  }
  
  // Dibujar ejes de coordenadas (X = rojo, Z = azul)
  const originX = Math.floor((0 - startX) * blockScale);
  const originZ = Math.floor((0 - startZ) * blockScale);
  
  // Eje X (coordenada Z = 0)
  if (originZ >= 0 && originZ < height) {
    for (let x = 0; x < width; x++) {
      pixels[4*(originZ * width + x) + 0] = 255; // R
      pixels[4*(originZ * width + x) + 1] = 0;   // G
      pixels[4*(originZ * width + x) + 2] = 0;   // B
      pixels[4*(originZ * width + x) + 3] = 255; // A
    }
  }
  
  // Eje Z (coordenada X = 0)
  if (originX >= 0 && originX < width) {
    for (let z = 0; z < height; z++) {
      pixels[4*(z * width + originX) + 0] = 0;   // R
      pixels[4*(z * width + originX) + 1] = 0;   // G
      pixels[4*(z * width + originX) + 2] = 255; // B
      pixels[4*(z * width + originX) + 3] = 255; // A
    }
  }
  
  // Dibujar punto de origen (0,0) si está visible
  if (originX >= 0 && originX < width && originZ >= 0 && originZ < height) {
    // Dibujar un círculo de 5px para el punto de origen
    const radius = 2;
    for (let dz = -radius; dz <= radius; dz++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx*dx + dz*dz <= radius*radius) {
          const px = originX + dx;
          const pz = originZ + dz;
          
          if (px >= 0 && px < width && pz >= 0 && pz < height) {
            pixels[4*(pz * width + px) + 0] = 255; // R
            pixels[4*(pz * width + px) + 1] = 255; // G
            pixels[4*(pz * width + px) + 2] = 0;   // B
            pixels[4*(pz * width + px) + 3] = 255; // A
          }
        }
      }
    }
  }
  
  // Dibujar la imagen en el canvas
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Prepara un ImageData para los biomas de una región
 * @param seed Semilla del mundo
 * @param version Versión de Minecraft
 * @param x Coordenada X central (en bloques)
 * @param z Coordenada Z central (en bloques)
 * @param width Ancho en píxeles
 * @param height Alto en píxeles
 * @returns ImageData para dibujar en el canvas
 */
export const prepareBiomeImageData = async (
  seed: string,
  version: string,
  x: number,
  z: number,
  width: number,
  height: number,
  zoom: number = 1
): Promise<ImageData> => {
  // Crear un ImageData del tamaño requerido
  const imageData = new ImageData(width, height);
  const pixels = imageData.data;
  
  // Escala: cuántos píxeles por bloque
  const blockScale = zoom;
  
  // Calcular coordenadas de inicio
  const startX = x - Math.floor(width / blockScale / 2);
  const startZ = z - Math.floor(height / blockScale / 2);
  
  // Biome cache
  const biomeCache: Record<string, number> = {};
  
  // Cargar biomas para cada píxel
  const promises: Promise<void>[] = [];
  
  for (let pz = 0; pz < height; pz++) {
    for (let px = 0; px < width; px++) {
      const pixelIndex = pz * width + px;
      
      // Convertir píxel a coordenada del mundo
      const worldX = startX + Math.floor(px / blockScale);
      const worldZ = startZ + Math.floor(pz / blockScale);
      
      const promise = (async () => {
        // Obtener bioma (con caché)
        const cacheKey = `${worldX},${worldZ}`;
        let biome: number;
        
        if (biomeCache[cacheKey] !== undefined) {
          biome = biomeCache[cacheKey];
        } else {
          biome = await getBiomeAt(seed, worldX, worldZ, version);
          biomeCache[cacheKey] = biome;
        }
        
        // Obtener color del bioma
        const colorHex = biomeColors[biome] || '#888888';
        
        // Convertir color hexadecimal a RGB
        const r = parseInt(colorHex.substring(1, 3), 16);
        const g = parseInt(colorHex.substring(3, 5), 16);
        const b = parseInt(colorHex.substring(5, 7), 16);
        
        // Escribir en los píxeles
        pixels[4*pixelIndex + 0] = r; // R
        pixels[4*pixelIndex + 1] = g; // G
        pixels[4*pixelIndex + 2] = b; // B
        pixels[4*pixelIndex + 3] = 255; // A
      })();
      
      promises.push(promise);
    }
  }
  
  await Promise.all(promises);
  return imageData;
};
