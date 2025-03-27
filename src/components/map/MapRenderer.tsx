
/**
 * MapRenderer.tsx
 * Componente para renderizar mapas de Minecraft usando técnicas avanzadas de canvas
 * Implementa un enfoque similar a Chunkbase con ImageData para máxima eficiencia
 */

import React, { useEffect, useRef, useState } from 'react';
import { useMapStore, MinecraftStructure } from '@/store/mapStore';
import { biomeColors, biomeNames } from '@/utils/minecraft/biomeColors';
import { getBiomeAt } from '@/utils/minecraft/initCubiomes';
import { renderBiomeMap } from '@/utils/minecraft/BiomeMapRenderer';
import { toast } from 'sonner';

interface MapRendererProps {
  seed: string;
  version: string;
  structures: MinecraftStructure[];
  activeFilters: string[];
  showBiomes: boolean;
  onHoveredBiome?: (biome: number, coords: {x: number, z: number}) => void;
}

const MapRenderer: React.FC<MapRendererProps> = ({
  seed,
  version,
  structures,
  activeFilters,
  showBiomes,
  onHoveredBiome
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredBiome, setHoveredBiome] = useState<number | null>(null);
  const [hoveredCoords, setHoveredCoords] = useState<{x: number, z: number} | null>(null);
  const [renderTime, setRenderTime] = useState<number>(0);
  const [biomeCache, setBiomeCache] = useState<Record<string, number>>({});
  
  const { 
    position, 
    zoom, 
    isDragging,
    selectedStructure,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleCanvasClick
  } = useMapStore();
  
  // Obtener un bioma con caché
  const getBiomeCached = async (x: number, z: number): Promise<number> => {
    const key = `${x},${z}`;
    
    if (biomeCache[key] !== undefined) {
      return biomeCache[key];
    }
    
    try {
      const biome = await getBiomeAt(seed, x, z, version);
      setBiomeCache(prev => ({...prev, [key]: biome}));
      return biome;
    } catch (error) {
      console.error(`Error al obtener bioma en (${x}, ${z}):`, error);
      return 0;
    }
  };
  
  // Renderizar el mapa con técnica de ImageData
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const render = async () => {
      const startTime = performance.now();
      
      const width = canvas.width;
      const height = canvas.height;
      
      // Centro del mundo en coordenadas de bloques
      const centerX = -position.x / zoom;
      const centerZ = -position.y / zoom;
      
      // Renderizar el mapa base con biomas
      await renderBiomeMap({
        canvas,
        seed,
        version,
        centerX,
        centerZ,
        zoom,
        width,
        height,
        showBiomes
      });
      
      // Dibujar las estructuras
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Centro del canvas en píxeles
        const canvasCenterX = width / 2 + position.x;
        const canvasCenterZ = height / 2 + position.y;
        const chunkSize = 16 * zoom;
        
        ctx.save();
        
        // Dibujar cada estructura
        for (const structure of structures) {
          // Filtrar por tipos activos
          if (!activeFilters.includes(structure.type)) continue;
          
          // Convertir coordenadas del mundo a coordenadas del canvas
          const structX = canvasCenterX + (structure.x / 16) * chunkSize;
          const structZ = canvasCenterZ + (structure.z / 16) * chunkSize;
          
          // Si está fuera del canvas, saltarla
          if (structX < -20 || structX > width + 20 || 
              structZ < -20 || structZ > height + 20) {
            continue;
          }
          
          // Calcular tamaño basado en zoom
          const size = Math.max(8, 12 * zoom);
          
          // Comprobar si está seleccionada
          const isSelected = selectedStructure && 
              selectedStructure.x === structure.x && 
              selectedStructure.z === structure.z;
          
          // Dibujar marcador
          ctx.beginPath();
          ctx.arc(structX, structZ, size/2, 0, Math.PI * 2);
          
          // Color basado en el bioma
          ctx.fillStyle = biomeColors[structure.biome] || '#888';
          ctx.fill();
          
          // Borde
          ctx.lineWidth = isSelected ? 2 : 1;
          ctx.strokeStyle = isSelected ? '#ff0' : '#fff';
          ctx.stroke();
          
          // Letra inicial del tipo
          ctx.fillStyle = '#000';
          ctx.font = `bold ${size * 0.7}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(structure.type[0].toUpperCase(), structX, structZ);
          
          // Información si está seleccionada
          if (isSelected) {
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(structX + 10, structZ - 10, 150, 80);
            
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            
            const biomeName = biomeNames[structure.biome] || 'Desconocido';
            
            ctx.fillText(`${structure.type}`, structX + 15, structZ - 5);
            ctx.fillText(`X: ${structure.x}, Z: ${structure.z}`, structX + 15, structZ + 15);
            ctx.fillText(`Bioma: ${biomeName}`, structX + 15, structZ + 35);
            ctx.fillText(`Dist: ${Math.round(structure.distanceFromSpawn)}`, structX + 15, structZ + 55);
          }
        }
        
        ctx.restore();
      }
      
      // Mostrar información del bioma al hacer hover
      if (hoveredBiome !== null && hoveredCoords !== null && ctx) {
        ctx.save();
        
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(10, 10, 200, 60);
        
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        ctx.fillText(`X: ${hoveredCoords.x}, Z: ${hoveredCoords.z}`, 20, 20);
        ctx.fillText(`Bioma: ${biomeNames[hoveredBiome] || 'Desconocido'}`, 20, 40);
        
        // Muestra de color
        const biomeColor = biomeColors[hoveredBiome] || '#888';
        ctx.fillStyle = biomeColor;
        ctx.fillRect(160, 25, 20, 20);
        
        ctx.restore();
      }
      
      // Medir tiempo de renderizado
      const endTime = performance.now();
      setRenderTime(endTime - startTime);
    };
    
    render();
  }, [position, zoom, structures, activeFilters, selectedStructure, showBiomes, seed, version]);
  
  // Ajustar tamaño del canvas cuando cambia el contenedor
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    
    resizeCanvas();
    
    const resizeObserver = new ResizeObserver(resizeCanvas);
    const canvas = canvasRef.current;
    if (canvas && canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  // Manejar movimiento del mouse
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Llamar al manejador de arrastre
    handleMouseMove(e);
    
    // Si no está arrastrando, obtener información del bioma
    if (!isDragging) {
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;
      
      const chunkSize = 16 * zoom;
      const centerX = canvas.width / 2 + position.x;
      const centerZ = canvas.height / 2 + position.y;
      
      // Convertir coordenadas del canvas a coordenadas del mundo
      const worldX = Math.floor(((canvasX - centerX) / chunkSize) * 16);
      const worldZ = Math.floor(((canvasY - centerZ) / chunkSize) * 16);
      
      // Obtener el bioma
      getBiomeCached(worldX, worldZ).then(biome => {
        setHoveredBiome(biome);
        setHoveredCoords({x: worldX, z: worldZ});
        
        if (onHoveredBiome) {
          onHoveredBiome(biome, {x: worldX, z: worldZ});
        }
      });
    }
  };
  
  // Manejar clic en el canvas
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Usar el store para detectar clics en estructuras
    const structure = handleCanvasClick(e, structures, activeFilters);
    
    // Si no se seleccionó ninguna estructura, mostrar info del bioma
    if (structure === null && hoveredBiome !== null && hoveredCoords !== null) {
      toast.info(`Bioma: ${biomeNames[hoveredBiome] || 'Desconocido'}`, {
        description: `Coordenadas: X=${hoveredCoords.x}, Z=${hoveredCoords.z}`
      });
    }
  };
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
      />
      
      {/* Información de rendimiento */}
      <div className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-50 p-1 rounded">
        Render: {renderTime.toFixed(0)}ms | Zoom: {zoom.toFixed(2)}x
      </div>
    </div>
  );
};

export default MapRenderer;
