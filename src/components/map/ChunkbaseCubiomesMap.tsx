
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
    
    // Renderizar el mapa
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const render = async () => {
        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar el fondo
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calcular el tamaño del chunk y coordenadas centrales
        const chunkSize = 16 * zoom;
        const centerX = canvas.width / 2 + position.x;
        const centerZ = canvas.height / 2 + position.y;
        
        // Calcular el rango de chunks a dibujar
        const startChunkX = Math.floor((0 - centerX) / chunkSize);
        const startChunkZ = Math.floor((0 - centerZ) / chunkSize);
        const endChunkX = Math.ceil((canvas.width - centerX) / chunkSize);
        const endChunkZ = Math.ceil((canvas.height - centerZ) / chunkSize);
        
        // Limitar el número de chunks a dibujar para mejor rendimiento
        const maxChunks = 30;
        const rangeX = Math.min(endChunkX - startChunkX, maxChunks);
        const rangeZ = Math.min(endChunkZ - startChunkZ, maxChunks);
        
        // Centrar el rango
        const offsetX = Math.floor(rangeX / 2);
        const offsetZ = Math.floor(rangeZ / 2);
        const centerChunkX = Math.floor(-position.x / chunkSize);
        const centerChunkZ = Math.floor(-position.y / chunkSize);
        
        // Dibujar los chunks
        for (let dz = -offsetZ; dz <= offsetZ; dz++) {
          for (let dx = -offsetX; dx <= offsetX; dx++) {
            const chunkX = centerChunkX + dx;
            const chunkZ = centerChunkZ + dz;
            
            const x = centerX + chunkX * chunkSize;
            const z = centerZ + chunkZ * chunkSize;
            
            // Coordenadas del mundo
            const worldX = chunkX * 16;
            const worldZ = chunkZ * 16;
            
            if (showBiomes) {
              // Obtener y dibujar el bioma
              const biome = await getBiomeAtCached(worldX, worldZ);
              ctx.fillStyle = biomeColors[biome] || '#000';
              ctx.fillRect(x, z, chunkSize, chunkSize);
            } else {
              // Dibujar cuadrícula
              ctx.fillStyle = '#222';
              ctx.fillRect(x, z, chunkSize, chunkSize);
              ctx.strokeStyle = '#333';
              ctx.strokeRect(x, z, chunkSize, chunkSize);
            }
            
            // Dibujar coordenadas cada 4 chunks si el zoom es suficiente
            if ((chunkX % 4 === 0 && chunkZ % 4 === 0) && zoom > 0.8) {
              ctx.fillStyle = '#ffffff80';
              ctx.font = '10px Arial';
              ctx.fillText(`${worldX},${worldZ}`, x + 2, z + 10);
            }
          }
        }
        
        // Dibujar ejes de coordenadas
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 1;
        
        // Eje X
        ctx.beginPath();
        ctx.moveTo(0, centerZ);
        ctx.lineTo(canvas.width, centerZ);
        ctx.stroke();
        
        // Eje Z
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvas.height);
        ctx.stroke();
        
        // Dibujar el punto de spawn
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(centerX, centerZ, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Dibujar estructuras
        for (const structure of structures) {
          // Filtrar por tipo
          if (!filters.includes(structure.type)) continue;
          
          // Calcular posición en el canvas
          const structX = centerX + (structure.x / 16) * chunkSize;
          const structZ = centerZ + (structure.z / 16) * chunkSize;
          
          // Si está fuera del canvas, saltarla
          if (structX < -20 || structX > canvas.width + 20 || 
              structZ < -20 || structZ > canvas.height + 20) {
            continue;
          }
          
          // Tamaño según zoom
          const size = Math.max(8, 12 * zoom);
          
          // Dibujar icono
          ctx.fillStyle = biomeColors[structure.biome] || '#888';
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1;
          
          // Si está seleccionada, destacarla
          if (selectedStructure && 
              selectedStructure.x === structure.x && 
              selectedStructure.z === structure.z) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ff0';
          }
          
          // Dibujar el marcador
          ctx.beginPath();
          ctx.arc(structX, structZ, size/2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          
          // Tipo de estructura (primera letra)
          ctx.fillStyle = '#fff';
          ctx.font = `bold ${size}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(structure.type[0].toUpperCase(), structX, structZ);
        }
        
        // Mostrar información del bioma
        if (hoveredBiome !== null && hoveredCoords !== null) {
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.fillRect(10, 10, 200, 60);
          
          ctx.fillStyle = '#fff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(`X: ${hoveredCoords.x}, Z: ${hoveredCoords.z}`, 20, 30);
          ctx.fillText(`Bioma: ${biomeNames[hoveredBiome] || 'Desconocido'}`, 20, 50);
        }
        
        // Mostrar información de la estructura seleccionada
        if (selectedStructure) {
          const structX = centerX + (selectedStructure.x / 16) * chunkSize;
          const structZ = centerZ + (selectedStructure.z / 16) * chunkSize;
          
          ctx.fillStyle = 'rgba(0,0,0,0.8)';
          ctx.fillRect(structX + 10, structZ - 10, 150, 70);
          
          ctx.fillStyle = '#fff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'left';
          
          const biomeName = biomeNames[selectedStructure.biome] || 'Desconocido';
          
          ctx.fillText(`${selectedStructure.type}`, structX + 15, structZ);
          ctx.fillText(`X: ${selectedStructure.x}, Z: ${selectedStructure.z}`, structX + 15, structZ + 15);
          ctx.fillText(`Bioma: ${biomeName}`, structX + 15, structZ + 30);
          ctx.fillText(`Distancia: ${selectedStructure.distanceFromSpawn}`, structX + 15, structZ + 45);
        }
      };
      
      render();
    }, [position, zoom, structures, filters, selectedStructure, showBiomes, biomeCache]);
    
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
    
    // Manejar clic en el canvas
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;
      
      // Buscar estructuras cerca del clic
      const selected = useMapStore.getState().handleCanvasClick(e, structures, filters);
      
      // Si no se seleccionó nada y hoveredBiome está disponible, mostrar información
      if (!selected && hoveredBiome !== null && hoveredCoords !== null) {
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
      </div>
    );
  }
);

ChunkbaseCubiomesMap.displayName = 'ChunkbaseCubiomesMap';

export default ChunkbaseCubiomesMap;
