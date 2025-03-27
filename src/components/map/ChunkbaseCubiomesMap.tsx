
/**
 * ChunkbaseCubiomesMap.tsx
 * Componente para mostrar un mapa de Minecraft con biomas y estructuras
 * usando la API de Cubiomes
 */

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useMapStore, MinecraftStructure } from '@/store/mapStore';
import { toast } from 'sonner';
import { getBiomeAt } from '@/utils/minecraft/initCubiomes';
import { biomeColors, biomeNames } from '@/utils/minecraft/biomeColors';
import { generateStructures } from '@/utils/minecraft/StructureGenerator';
import { renderBiomeMap } from '@/utils/minecraft/BiomeMapRenderer';

// Interfaz para la referencia expuesta
export interface ChunkbaseCubiomesMapRef {
  downloadMap: () => void;
}

interface ChunkbaseCubiomesMapProps {
  seed: string;
  version: string;
  filters: string[];
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
}

const ChunkbaseCubiomesMap = forwardRef<ChunkbaseCubiomesMapRef, ChunkbaseCubiomesMapProps>(
  ({ seed, version, filters, isLoading, onLoadingChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [structures, setStructures] = useState<MinecraftStructure[]>([]);
    const [hoveredBiome, setHoveredBiome] = useState<number | null>(null);
    const [hoveredCoords, setHoveredCoords] = useState<{x: number, z: number} | null>(null);
    const [biomeCache, setBiomeCache] = useState<Record<string, number>>({});
    const [renderTime, setRenderTime] = useState<number>(0);
    
    const { 
      position, 
      zoom, 
      isDragging,
      showBiomes,
      selectedStructure,
      setSelectedStructure,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleWheel
    } = useMapStore();
    
    // Exponer la función de descarga
    useImperativeHandle(ref, () => ({
      downloadMap: () => {
        if (!canvasRef.current) return;
        
        try {
          // Convertir el canvas a una imagen PNG
          const dataUrl = canvasRef.current.toDataURL('image/png');
          
          // Crear un enlace para descargar
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `minecraft-seed-${seed}.png`;
          
          // Simular un clic para iniciar la descarga
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast.success('Mapa descargado correctamente');
        } catch (error) {
          console.error('Error al descargar el mapa:', error);
          toast.error('Error al descargar el mapa');
        }
      }
    }));
    
    // Cargar estructuras cuando cambia la semilla o versión
    useEffect(() => {
      const loadStructures = async () => {
        try {
          onLoadingChange(true);
          
          console.log(`Cargando estructuras para semilla ${seed}, versión ${version}`);
          const newStructures = await generateStructures(seed, version, filters);
          
          setStructures(newStructures);
          console.log(`Se encontraron ${newStructures.length} estructuras`);
          
          // Limpiar el caché de biomas al cambiar de semilla
          setBiomeCache({});
        } catch (error) {
          console.error('Error al cargar estructuras:', error);
          toast.error('Error al cargar estructuras');
        } finally {
          onLoadingChange(false);
        }
      };
      
      loadStructures();
    }, [seed, version, filters]);
    
    // Obtener el bioma en una posición (usando caché)
    const getBiomeAtCached = async (x: number, z: number): Promise<number> => {
      const key = `${x},${z}`;
      
      // Si ya está en caché, devolverlo
      if (biomeCache[key] !== undefined) {
        return biomeCache[key];
      }
      
      try {
        // Obtener el bioma
        const biome = await getBiomeAt(seed, x, z, version);
        
        // Guardar en caché
        setBiomeCache(prev => ({...prev, [key]: biome}));
        
        return biome;
      } catch (error) {
        console.error(`Error al obtener bioma en (${x}, ${z}):`, error);
        return 0; // Bioma desconocido
      }
    };
    
    // Renderizar el mapa usando el método de ImageData (estilo Chunkbase)
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const render = async () => {
        const startTime = performance.now();
        
        // Obtener dimensiones del canvas
        const width = canvas.width;
        const height = canvas.height;
        
        // Centro del mundo en el canvas
        const centerX = -position.x / zoom;
        const centerZ = -position.y / zoom;
        
        // Renderizar el mapa de manera eficiente
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
        
        // Calcular el tamaño del chunk
        const chunkSize = 16 * zoom;
        
        // Punto central del canvas
        const canvasCenterX = width / 2 + position.x;
        const canvasCenterZ = height / 2 + position.y;
        
        // Renderizar las estructuras
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.save();
          
          // Dibujar las estructuras
          for (const structure of structures) {
            // Filtrar por tipo activo
            if (!filters.includes(structure.type)) continue;
            
            // Convertir coordenadas del mundo a coordenadas del canvas
            const structX = canvasCenterX + (structure.x / 16) * chunkSize;
            const structZ = canvasCenterZ + (structure.z / 16) * chunkSize;
            
            // Si está fuera del canvas, saltarla
            if (structX < -20 || structX > width + 20 || 
                structZ < -20 || structZ > height + 20) {
              continue;
            }
            
            // Tamaño según zoom
            const size = Math.max(8, 12 * zoom);
            
            // Si está seleccionada, destacarla
            const isSelected = selectedStructure && 
                selectedStructure.x === structure.x && 
                selectedStructure.z === structure.z;
            
            // Crear un icono para la estructura
            ctx.beginPath();
            ctx.arc(structX, structZ, size/2, 0, Math.PI * 2);
            
            // Color basado en el bioma
            ctx.fillStyle = biomeColors[structure.biome] || '#888';
            ctx.fill();
            
            // Borde blanco o amarillo si está seleccionada
            ctx.lineWidth = isSelected ? 2 : 1;
            ctx.strokeStyle = isSelected ? '#ff0' : '#fff';
            ctx.stroke();
            
            // Tipo de estructura (primera letra)
            ctx.fillStyle = '#000';
            ctx.font = `bold ${size * 0.7}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(structure.type[0].toUpperCase(), structX, structZ);
            
            // Si está seleccionada, mostrar información
            if (isSelected) {
              // Mostrar información detallada
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
        
        // Información del bioma al hacer hover
        if (hoveredBiome !== null && hoveredCoords !== null) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
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
        }
        
        // Medir tiempo de renderizado
        const endTime = performance.now();
        setRenderTime(endTime - startTime);
      };
      
      render();
    }, [position, zoom, structures, filters, selectedStructure, showBiomes, seed, version, biomeCache]);
    
    // Ajustar el tamaño del canvas al contenedor
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
      window.addEventListener('resize', resizeCanvas);
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }, []);
    
    // Manejo de eventos del canvas
    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Llamar al manejador de arrastre
      handleMouseMove(e);
      
      // Si no está arrastrando, mostrar información del bioma
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
        getBiomeAtCached(worldX, worldZ).then(biome => {
          setHoveredBiome(biome);
          setHoveredCoords({x: worldX, z: worldZ});
        });
      }
    };
    
    // Handle canvas click - fix for line 359
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;
      
      // Usar el store directamente para el click del canvas
      const selectedStructure = useMapStore.getState().handleCanvasClick(e, structures, filters);
      
      // Si no se seleccionó ninguna estructura y hay información de bioma, mostrarla
      if (selectedStructure === null && hoveredBiome !== null && hoveredCoords !== null) {
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
          onClick={handleCanvasClick}
          onWheel={handleWheel}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Stats for debugging */}
        <div className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-50 p-1 rounded">
          Render: {renderTime.toFixed(0)}ms | Zoom: {zoom.toFixed(2)}x
        </div>
      </div>
    );
  }
);

ChunkbaseCubiomesMap.displayName = 'ChunkbaseCubiomesMap';

export default ChunkbaseCubiomesMap;
