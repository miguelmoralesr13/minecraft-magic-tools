
/**
 * MapCanvas.tsx
 * Componente para renderizar el mapa de Minecraft con estructuras y biomas
 * Implementa renderizado eficiente con ImageData similar a Chunkbase
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useMapStore } from '@/store/mapStore';
import { MinecraftStructure } from '@/store/mapStore';
import { getBiomeAt } from '@/utils/minecraft/CubiomesModule';
import { biomeColors } from '@/utils/minecraft/biomeColors';
import { structureColors } from '@/utils/minecraft/structureColors';
import { renderBiomeMap, prepareBiomeImageData } from '@/utils/minecraft/BiomeMapRenderer';

interface MapCanvasProps {
  structures: MinecraftStructure[];
  filters: string[];
  isLoading: boolean;
  seed?: string;
  version?: string;
}

const MapCanvas = React.forwardRef<{ downloadMap: () => void }, MapCanvasProps>(({ structures, filters, isLoading, seed = "minecraft", version = "1.20" }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
  
  // Estado para almacenar los datos de biomas
  const [biomeData, setBiomeData] = useState<Record<string, string>>({});
  const [isBiomeLoading, setIsBiomeLoading] = useState<boolean>(false);

  // Usamos los colores importados de los archivos correspondientes
  // para los diferentes tipos de estructuras y biomas
  
  // Función para obtener el bioma en una posición específica
  const getBiomeAtPosition = async (x: number, z: number) => {
    const chunkX = Math.floor(x/16);
    const chunkZ = Math.floor(z/16);
    const chunkKey = `${chunkX},${chunkZ}`;
    
    // Si ya tenemos el bioma en caché, lo devolvemos
    if (biomeData[chunkKey]) {
      return biomeData[chunkKey];
    }
    
    try {
      // Llamar a la función getBiomeAt del módulo Cubiomes
      const biomeName = await getBiomeAt(seed, x, z, version);
      
      // Verificar si el nombre del bioma es válido
      if (!biomeName || biomeName === 'undefined') {
        console.warn(`Bioma no reconocido en (${x}, ${z})`);
        return 'Unknown';
      }
      
      console.log(`Bioma en (${x}, ${z}): ${biomeName}`);
      
      // Actualizar el estado con el nuevo bioma
      setBiomeData(prev => ({
        ...prev,
        [chunkKey]: biomeName
      }));
      
      return biomeName;
    } catch (error) {
      console.error(`Error al obtener el bioma en (${x}, ${z}):`, error);
      return 'Unknown';
    }
  };

  // Función para cargar los biomas visibles
  const loadVisibleBiomes = async () => {
      
    if (!showBiomes || !canvasRef.current) return;
    
    setIsBiomeLoading(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Renderizar el mapa de biomas usando la función optimizada
    await renderBiomeMap({
      canvas: canvas,
      seed: seed,
      version: version,
      centerX: Math.floor(-position.x * 16 / zoom),
      centerZ: Math.floor(-position.y * 16 / zoom),
      zoom: zoom,
      width: canvas.width,
      height: canvas.height,
      showBiomes: showBiomes
    });
    
    setIsBiomeLoading(false);
  };
  
  // Cargar biomas cuando cambia la posición, el zoom o se activa la visualización de biomas
  useEffect(() => {
    if (showBiomes) {
      loadVisibleBiomes();
    }
  }, [position, zoom, showBiomes, seed, version]);
  
  // Renderizar el mapa
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustar el tamaño del canvas al tamaño del contenedor
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Limpiar el evento al desmontar
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Efecto para renderizar el contenido del mapa
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  }, []);

  // Renderizar el mapa
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Si no estamos mostrando biomas, limpiar el canvas y dibujar el fondo
    if (!showBiomes) {
      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar el fondo con un color gris oscuro
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Si estamos cargando, mostrar un mensaje
    if (isLoading) {
      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Cargando...', canvas.width / 2, canvas.height / 2);
      return;
    }

    // Calcular el centro del canvas en coordenadas de pantalla
    const centerX = canvas.width / 2 + position.x;
    const centerZ = canvas.height / 2 + position.y;
    
    // Dibujar la cuadrícula solo si no estamos mostrando biomas (para evitar sobrecargar visualmente)
    if (!showBiomes) {
      const chunkSize = 16 * (zoom / 16);
      const offsetX = position.x % chunkSize;
      const offsetZ = position.y % chunkSize;

      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;

      // Líneas verticales
      for (let x = offsetX; x < canvas.width; x += chunkSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Líneas horizontales
      for (let z = offsetZ; z < canvas.height; z += chunkSize) {
        ctx.beginPath();
        ctx.moveTo(0, z);
        ctx.lineTo(canvas.width, z);
        ctx.stroke();
      }
    }
    
    // Dibujar el punto central (spawn)
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(centerX, centerZ, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Dibujar círculo alrededor del spawn para mejor visibilidad
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerZ, 7, 0, Math.PI * 2);
    ctx.stroke();

    // Dibujar las estructuras
    structures.forEach(structure => {
      // Verificar si la estructura está filtrada
      const isFiltered = filters.length > 0 && !filters.includes(structure.type);
      if (isFiltered) return;
      
      // Convertir coordenadas del mundo a coordenadas del canvas
      const x = centerX + (structure.x * zoom) / 16;
      const z = centerZ + (structure.z * zoom) / 16;
      
      // Verificar si la estructura está dentro del canvas
      if (x < -50 || x > canvas.width + 50 || z < -50 || z > canvas.height + 50) {
        return; // Ampliamos un poco el margen para no cortar estructuras parcialmente visibles
      }
      
      // Tamaño del icono ajustado por zoom
      const size = Math.max(16, 24 * (zoom / 16));
      
      // Dibujar un círculo de fondo para mejor visibilidad
      ctx.fillStyle = structureColors[structure.type] || '#FFFFFF';
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(x, z, size/2 + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      
      // Cargar y dibujar el icono SVG
      const img = new Image();
      img.src = `/icons/${structure.type}.svg`;
      
      // Dibujar el icono
      ctx.save();
      ctx.translate(x - size/2, z - size/2);
      ctx.drawImage(img, 0, 0, size, size);
      ctx.restore();
      
      // Si la estructura está seleccionada, dibujar un halo
      if (selectedStructure && structure.x === selectedStructure.x && structure.z === selectedStructure.z) {
        // Dibujar halo exterior
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, z, size/2 + 6, 0, Math.PI * 2);
        ctx.stroke();
        
        // Dibujar halo interior con el color de la estructura
        ctx.strokeStyle = structureColors[structure.type] || '#FFF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, z, size/2 + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
    
    // Dibujar tooltip para la estructura seleccionada
    if (selectedStructure) {
      const x = centerX + (selectedStructure.x * zoom) / 16;
      const z = centerZ + (selectedStructure.z * zoom) / 16;
      
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.strokeStyle = structureColors[selectedStructure.type] || '#FFFFFF';
      ctx.lineWidth = 1;
      
      // Configurar el texto del tooltip
      ctx.font = '12px Arial';
      const text = `${selectedStructure.type.charAt(0).toUpperCase() + selectedStructure.type.slice(1)} (${selectedStructure.x}, ${selectedStructure.z})`;
      const biomeText = `Bioma: ${selectedStructure.biome}`;
      const distanceText = `Distancia: ${Math.round(selectedStructure.distanceFromSpawn)} bloques`;
      
      const textMetrics = ctx.measureText(text);
      const biomeMetrics = ctx.measureText(biomeText);
      const distanceMetrics = ctx.measureText(distanceText);
      
      const maxWidth = Math.max(textMetrics.width, biomeMetrics.width, distanceMetrics.width);
      const padding = 5;
      const lineHeight = 16;
      
      // Dibujar el fondo del tooltip
      ctx.fillRect(x + 10, z - 20, maxWidth + padding * 2, lineHeight * 3 + padding);
      ctx.strokeRect(x + 10, z - 20, maxWidth + padding * 2, lineHeight * 3 + padding);
      
      // Dibujar el texto
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(text, x + 10 + padding, z - 5);
      ctx.fillText(biomeText, x + 10 + padding, z - 5 + lineHeight);
      ctx.fillText(distanceText, x + 10 + padding, z - 5 + lineHeight * 2);
    }
    
    // Dibujar información de escala
    const blockSize = zoom / 16;
    const scaleText = `Escala: 1px = ${(1/blockSize).toFixed(1)} bloques`;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(scaleText, 10, canvas.height - 10);
    
    // Dibujar coordenadas del centro
    const centerWorldX = Math.round(-position.x * 16 / zoom);
    const centerWorldZ = Math.round(-position.y * 16 / zoom);
    const coordsText = `Centro: X: ${centerWorldX}, Z: ${centerWorldZ}`;
    const coordsMetrics = ctx.measureText(coordsText);
    ctx.fillText(coordsText, canvas.width - coordsMetrics.width - 10, canvas.height - 10);
    
  }, [position, zoom, structures, filters, selectedStructure, showBiomes]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-900 rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        width={800}
        height={600}
        onClick={(e) => handleCanvasClick(e, structures, filters)}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
});

export default MapCanvas;
