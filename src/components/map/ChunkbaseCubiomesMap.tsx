/**
 * ChunkbaseCubiomesMap.tsx
 * Componente para renderizar el mapa de Minecraft utilizando la integración de Chunkbase y Cubiomes
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useMapStore } from '@/store/mapStore';
import { MinecraftStructure } from '@/utils/minecraft/StructureGenerator';
import { biomeColors } from '@/utils/minecraft/biomeColors';
import { structureColors } from '@/utils/minecraft/structureColors';
import { ChunkbaseCubiomesAdapter, createChunkbaseCubiomesAdapter, MapGenerationOptions } from '@/utils/minecraft/ChunkbaseCubiomesAdapter';
import { toast } from 'sonner';
import { initCubiomes } from '@/utils/minecraft/initCubiomes';

interface ChunkbaseCubiomesMapProps {
  seed: string;
  version: string;
  filters: string[];
  isLoading: boolean;
  onLoadingChange: (isLoading: boolean) => void;
}

const ChunkbaseCubiomesMap = React.forwardRef<{ downloadMap: () => void }, ChunkbaseCubiomesMapProps>(
  ({ seed, version, filters, isLoading, onLoadingChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [adapter, setAdapter] = useState<ChunkbaseCubiomesAdapter | null>(null);
    const [structures, setStructures] = useState<MinecraftStructure[]>([]);
    const [biomeData, setBiomeData] = useState<Record<string, string>>({});

    const {
      position,
      zoom,
      isDragging,
      handleCanvasClick,
      handleWheel,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      selectedStructure,
      showBiomes
    } = useMapStore();

    // Inicializar el adaptador
    useEffect(() => {
      const initAdapter = async () => {
        try {
          // Inicializar Cubiomes primero
          await initCubiomes();
          console.log('Módulo Cubiomes inicializado correctamente');
          
          // Luego crear el adaptador
          const newAdapter = await createChunkbaseCubiomesAdapter(seed, version);
          setAdapter(newAdapter);
          console.log('Adaptador inicializado con semilla:', seed);
          
          // Generar el mapa inicial
          if (newAdapter) {
            setTimeout(() => {
              generateMap();
            }, 500);
          }
        } catch (error) {
          console.error('Error al inicializar el adaptador:', error);
          toast.error('Error al inicializar el mapa', {
            description: 'No se pudo cargar el módulo Cubiomes'
          });
        }
      };

      initAdapter();
    }, []);
    
    // Asegurar que el adaptador se reinicialice si hay cambios en la semilla o versión
    useEffect(() => {
      if (!adapter) return;
      
      // Si cambia la semilla o versión, actualizar el adaptador
      if (adapter.seed !== seed || adapter.version !== version) {
        console.log('Actualizando semilla y versión:', seed, version);
        adapter.setSeedAndVersion(seed, version);
        generateMap();
      }
    }, [seed, version, adapter]);

    // Generar el mapa
    const generateMap = useCallback(async () => {
      if (!adapter || isLoading) return;

      onLoadingChange(true);

      try {
        // Configurar opciones de generación
        const options: MapGenerationOptions = {
          seed,
          version,
          centerX: 0,
          centerZ: 0,
          radius: 5000,
          structureTypes: filters.length > 0 ? filters : undefined,
          showBiomes
        };

        // Generar el mapa
        const result = await adapter.generateMap(options);
        setStructures(result.structures);

        if (result.biomeData) {
          setBiomeData(result.biomeData);
        }

        toast.success('Mapa generado', {
          description: `Se han encontrado ${result.structures.length} estructuras para la semilla ${seed}`
        });
      } catch (error) {
        console.error('Error al generar el mapa:', error);
        toast.error('Error al generar el mapa', {
          description: 'No se pudieron generar las estructuras'
        });
      } finally {
        onLoadingChange(false);
      }
    }, [adapter, seed, version, filters, showBiomes, isLoading, onLoadingChange]);

    // Regenerar el mapa cuando cambien los filtros
    useEffect(() => {
      if (adapter) {
        generateMap();
      }
    }, [filters, generateMap]);

    // Renderizar el mapa
    useEffect(() => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar el fondo
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar la cuadrícula
      const gridSize = 16 * (zoom / 16); // Tamaño de un chunk en píxeles
      const offsetX = position.x % gridSize;
      const offsetZ = position.y % gridSize;

      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 0.5;

      // Dibujar líneas verticales
      for (let x = offsetX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Dibujar líneas horizontales
      for (let z = offsetZ; z < canvas.height; z += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, z);
        ctx.lineTo(canvas.width, z);
        ctx.stroke();
      }

      // Dibujar biomas si están activados - Implementación mejorada basada en Chunkbase con ImageData
      if (showBiomes && Object.keys(biomeData).length > 0) {
        const centerX = canvas.width / 2;
        const centerZ = canvas.height / 2;
        
        // Calcular el chunk central en coordenadas del mundo
        const centerWorldX = -position.x * 16 / zoom;
        const centerWorldZ = -position.y * 16 / zoom;
        const centerChunkX = Math.floor(centerWorldX / 16);
        const centerChunkZ = Math.floor(centerWorldZ / 16);
        
        // Calcular cuántos chunks son visibles (añadir margen para evitar bordes vacíos)
        const visibleChunksX = Math.ceil(canvas.width / gridSize) + 4;
        const visibleChunksZ = Math.ceil(canvas.height / gridSize) + 4;
        
        // Crear ImageData para manipular píxeles directamente
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Generar datos de altura más naturales usando una implementación mejorada de ruido
        const generateHeightData = (x: number, z: number): number => {
          // Implementación mejorada de ruido para terreno más natural
          // Usar múltiples octavas con diferentes frecuencias y amplitudes
          const scale = 1000; // Escala base para el ruido
          
          // Primera octava - características grandes del terreno
          const nx1 = x / scale;
          const nz1 = z / scale;
          const noise1 = Math.sin(nx1 * 3.14159) * Math.cos(nz1 * 3.14159) * 15;
          
          // Segunda octava - detalles medianos
          const nx2 = x / (scale * 0.5);
          const nz2 = z / (scale * 0.5);
          const noise2 = Math.sin(nx2 * 6.28318 + 0.7) * Math.cos(nz2 * 6.28318 + 0.3) * 7.5;
          
          // Tercera octava - detalles pequeños
          const nx3 = x / (scale * 0.25);
          const nz3 = z / (scale * 0.25);
          const noise3 = Math.sin(nx3 * 12.56636 + 1.3) * Math.cos(nz3 * 12.56636 + 1.7) * 3.75;
          
          // Cuarta octava - micro detalles
          const nx4 = x / (scale * 0.125);
          const nz4 = z / (scale * 0.125);
          const noise4 = Math.sin(nx4 * 25.13272 + 2.1) * Math.cos(nz4 * 25.13272 + 2.5) * 1.875;
          
          // Combinar las diferentes capas de ruido con pesos decrecientes
          const combinedNoise = noise1 + noise2 + noise3 + noise4;
          
          // Ajustar a un rango adecuado para la altura del terreno (40-120)
          return Math.floor(combinedNoise + 70);
        };
        
        // Ajustar color según la altura (similar a la función en Chunkbase)
        const adjustColorByHeight = (height: number, color: number): number => {
          // Valores más altos = colores más claros, valores más bajos = colores más oscuros
          if (height > 100) {
            // Terreno alto - más claro (nieve, montañas)
            return Math.min(255, color + Math.floor((height - 100) * 0.75));
          } else if (height < 60) {
            // Terreno bajo - más oscuro (valles, depresiones)
            return Math.max(0, color - Math.floor((60 - height) * 0.75));
          }
          return color; // Altura normal - sin ajuste
        };
        
        // Función para aplicar sombreado basado en pendiente (simula iluminación)
        const applyShadingBySlope = (x: number, z: number, rgb: number[]): number[] => {
          // Calcular alturas en puntos vecinos para determinar la pendiente
          const heightCenter = generateHeightData(x, z);
          const heightEast = generateHeightData(x + 8, z);
          const heightWest = generateHeightData(x - 8, z);
          const heightNorth = generateHeightData(x, z - 8);
          const heightSouth = generateHeightData(x, z + 8);
          
          // Calcular vectores de pendiente (gradiente)
          const slopeX = (heightEast - heightWest) / 16;
          const slopeZ = (heightSouth - heightNorth) / 16;
          
          // Calcular factor de sombreado basado en la pendiente
          // Simula luz viniendo desde el noroeste
          const lightX = -0.7071; // cos(45°)
          const lightZ = -0.7071; // sin(45°)
          
          // Producto escalar entre vector de luz y vector normal a la superficie
          const dotProduct = lightX * slopeX + lightZ * slopeZ;
          
          // Factor de sombreado: pendientes hacia la luz son más brillantes
          const shadingFactor = 1.0 - Math.min(Math.max(dotProduct * 0.5, -0.3), 0.3);
          
          // Aplicar factor de sombreado a los componentes RGB
          return [
            Math.min(255, Math.max(0, Math.floor(rgb[0] * shadingFactor))),
            Math.min(255, Math.max(0, Math.floor(rgb[1] * shadingFactor))),
            Math.min(255, Math.max(0, Math.floor(rgb[2] * shadingFactor)))
          ];
        };
        
        // Renderizar cada píxel del canvas con optimización
        for (let canvasY = 0; canvasY < canvas.height; canvasY++) {
          for (let canvasX = 0; canvasX < canvas.width; canvasX++) {
            // Convertir coordenadas del canvas a coordenadas del mundo
            const worldX = ((canvasX - centerX - position.x) * 16) / zoom;
            const worldZ = ((canvasY - centerZ - position.y) * 16) / zoom;
            
            // Calcular el chunk al que pertenece este píxel
            const chunkX = Math.floor(worldX / 16);
            const chunkZ = Math.floor(worldZ / 16);
            const chunkKey = `${chunkX},${chunkZ}`;
            
            // Obtener el bioma y su color
            const biomeName = biomeData[chunkKey] || 'unknown';
            const colorHex = biomeColors[biomeName] || '#000000';
            
            // Convertir color hexadecimal a RGB
            const r = parseInt(colorHex.substring(1, 3), 16);
            const g = parseInt(colorHex.substring(3, 5), 16);
            const b = parseInt(colorHex.substring(5, 7), 16);
            
            // Obtener altura simulada para este punto
            const height = generateHeightData(worldX, worldZ);
            
            // Determinar categoría y temperatura basado en el nombre del bioma
            const isWater = biomeName.includes('ocean') || biomeName.includes('river') || biomeName.includes('lake');
            const isCold = biomeName.includes('frozen') || biomeName.includes('snowy') || biomeName.includes('cold') || biomeName.includes('ice');
            const isMountain = biomeName.includes('mountain') || biomeName.includes('hill') || biomeName.includes('peak');
            
            // Índice del píxel en el array de datos
            const pixelIndex = (canvasY * canvas.width + canvasX) * 4;
            
            // Colores base ajustados según el tipo de bioma
            let baseR = r;
            let baseG = g;
            let baseB = b;
            
            // Aplicar reglas especiales de coloración basadas en elevación y tipo de bioma
            if (height < 62 && !isWater) {
              // Tierra baja no acuática
              const baseColor = isCold ? biomeColors['snowy_tundra'] : biomeColors['plains'];
              baseR = parseInt(baseColor.substring(1, 3), 16);
              baseG = parseInt(baseColor.substring(3, 5), 16);
              baseB = parseInt(baseColor.substring(5, 7), 16);
            } else if (height >= 90 && !isWater && !isMountain) {
              // Terreno alto no montañoso - añadir tinte de nieve
              const snowFactor = Math.min(1.0, (height - 90) / 30);
              baseR = Math.floor(baseR * (1 - snowFactor) + 255 * snowFactor);
              baseG = Math.floor(baseG * (1 - snowFactor) + 255 * snowFactor);
              baseB = Math.floor(baseB * (1 - snowFactor) + 255 * snowFactor);
            } else if (height >= 62 && isWater) {
              // Agua en elevación alta
              const baseColor = isCold ? biomeColors['frozen_ocean'] : biomeColors['ocean'];
              baseR = parseInt(baseColor.substring(1, 3), 16);
              baseG = parseInt(baseColor.substring(3, 5), 16);
              baseB = parseInt(baseColor.substring(5, 7), 16);
            }
            
            // Ajustar colores por altura
            baseR = adjustColorByHeight(height, baseR);
            baseG = adjustColorByHeight(height, baseG);
            baseB = adjustColorByHeight(height, baseB);
            
            // Aplicar sombreado basado en pendiente para dar sensación de relieve
            const shadedRGB = applyShadingBySlope(worldX, worldZ, [baseR, baseG, baseB]);
            
            // Asignar colores finales al píxel
            pixels[pixelIndex] = shadedRGB[0];
            pixels[pixelIndex + 1] = shadedRGB[1];
            pixels[pixelIndex + 2] = shadedRGB[2];
            
            // Establecer canal alfa a completamente opaco
            pixels[pixelIndex + 3] = 255;
          }
        }
        
        // Dibujar la imagen en el canvas
        ctx.putImageData(imageData, 0, 0);
      }

      // Dibujar las estructuras
      const centerX = canvas.width / 2;
      const centerZ = canvas.height / 2;

      // Crear un segundo canvas temporal para las estructuras
      const structuresCanvas = document.createElement('canvas');
      structuresCanvas.width = canvas.width;
      structuresCanvas.height = canvas.height;
      const structuresCtx = structuresCanvas.getContext('2d');
      
      if (structuresCtx) {
        // Hacer el fondo transparente
        structuresCtx.clearRect(0, 0, structuresCanvas.width, structuresCanvas.height);

        structures.forEach(structure => {
          // Verificar si la estructura está filtrada
          const isFiltered = filters.length > 0 && !filters.includes(structure.type);
          if (isFiltered) return;

          // Calcular la posición en el canvas
          const x = centerX + (structure.x * zoom) / 16 + position.x;
          const z = centerZ + (structure.z * zoom) / 16 + position.y;

          // Verificar si la estructura está dentro del canvas
          if (x < -20 || x > canvas.width + 20 || z < -20 || z > canvas.height + 20) {
            return;
          }

          // Dibujar el icono de la estructura
          const color = structureColors[structure.type] || '#ffffff';
          const size = 6 * (zoom / 1);

          // Dibujar un círculo para la estructura con sombra para mejor visibilidad
          // Primero dibujar una sombra/borde
          structuresCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          structuresCtx.beginPath();
          structuresCtx.arc(x, z, size + 2, 0, Math.PI * 2);
          structuresCtx.fill();
          
          // Luego dibujar el círculo principal
          structuresCtx.fillStyle = color;
          structuresCtx.beginPath();
          structuresCtx.arc(x, z, size, 0, Math.PI * 2);
          structuresCtx.fill();

          // Si es la estructura seleccionada, dibujar un borde y la información
          if (selectedStructure && 
              selectedStructure.x === structure.x && 
              selectedStructure.z === structure.z && 
              selectedStructure.type === structure.type) {
            // Dibujar un borde más visible
            structuresCtx.strokeStyle = '#ffffff';
            structuresCtx.lineWidth = 2;
            structuresCtx.beginPath();
            structuresCtx.arc(x, z, size + 4, 0, Math.PI * 2);
            structuresCtx.stroke();

            // Crear un fondo para el texto para mejor legibilidad
            structuresCtx.font = '12px Arial';
            const textLines = [
              `${structure.type} (${structure.x}, ${structure.z})`,
              `Bioma: ${structure.biome}`,
              `Distancia: ${Math.floor(structure.distanceFromSpawn)} bloques`
            ];
            
            // Medir el texto para crear el fondo
            const textWidth = Math.max(
              ...textLines.map(line => structuresCtx.measureText(line).width)
            );
            const textHeight = 14 * textLines.length;
            
            // Dibujar fondo semi-transparente para el texto
            structuresCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            structuresCtx.fillRect(x + size + 4, z - 4, textWidth + 4, textHeight + 8);
            
            // Dibujar el texto
            structuresCtx.fillStyle = '#ffffff';
            textLines.forEach((line, index) => {
              structuresCtx.fillText(line, x + size + 6, z + (index * 14));
            });
          }
        });
        
        // Combinar el canvas de estructuras con el canvas principal
        ctx.drawImage(structuresCanvas, 0, 0);
      }

      // Dibujar el origen (0,0)
      const originX = centerX + position.x;
      const originZ = centerZ + position.y;
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(originX, originZ, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(originX, originZ, 8, 0, Math.PI * 2);
      ctx.stroke();

    }, [position, zoom, structures, filters, selectedStructure, showBiomes, biomeData]);

    // Función para descargar el mapa como imagen
    const downloadMap = useCallback(() => {
      if (!canvasRef.current) return;
      
      // Obtener la imagen del canvas
      const dataUrl = canvasRef.current.toDataURL('image/png');
      
      // Crear un enlace temporal para la descarga
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `mapa-seed-${seed}.png`;
      
      // Simular clic y eliminar el enlace
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, [seed]);

    // Exponer la función downloadMap a través de la referencia
    React.useImperativeHandle(ref, () => ({
      downloadMap
    }));

    // Ajustar el tamaño del canvas al tamaño de su contenedor
    useEffect(() => {
      const resizeCanvas = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const container = canvas.parentElement;
        if (!container) return;

        // Establecer un tamaño mínimo para el canvas para asegurar que el mapa sea grande
        const minWidth = Math.max(800, container.clientWidth);
        const minHeight = Math.max(600, container.clientHeight);
        
        canvas.width = minWidth;
        canvas.height = minHeight;
        
        // Asegurar que el contenedor se ajuste al tamaño del canvas
        container.style.minWidth = `${minWidth}px`;
        container.style.minHeight = `${minHeight}px`;
      };

      // Ajustar tamaño inicial
      resizeCanvas();

      // Ajustar tamaño cuando cambie el tamaño de la ventana
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onClick={(e) => handleCanvasClick(e, structures, filters)}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    );
  }
);

ChunkbaseCubiomesMap.displayName = 'ChunkbaseCubiomesMap';

export default ChunkbaseCubiomesMap;