import React, { useEffect, useRef, useState } from 'react';
import { useMapStore } from '@/store/mapStore';
import { toast } from 'sonner';
import CubiomesModule from '../../wasm/cubiomes/build/cubiomes.js';
import type { MinecraftStructure } from '@/store/mapStore';

// Definición de colores para los biomas
const biomeColors: Record<number, string> = {
  0: '#000000', // Unknown
  1: '#8DB360', // Plains
  2: '#F9E49A', // Desert
  3: '#056621', // Forest
  4: '#507A32', // Mountains
  5: '#2D6D77', // Swamp
  6: '#3F76E4', // Ocean
  7: '#0E4ECF', // River
  8: '#31554A', // Taiga
  9: '#DDD7A0', // Beach
  10: '#BBB050', // Savanna
  11: '#14B485', // Jungle
  12: '#D94515', // Badlands
  13: '#1E3B18', // Dark Forest
  14: '#FFFFFF', // Ice Plains
  15: '#8B6D5C', // Mushroom Island
};

// Definición de nombres para los biomas
const biomeNames: Record<number, string> = {
  0: 'Desconocido',
  1: 'Llanuras',
  2: 'Desierto',
  3: 'Bosque',
  4: 'Montañas',
  5: 'Pantano',
  6: 'Océano',
  7: 'Río',
  8: 'Taiga',
  9: 'Playa',
  10: 'Sabana',
  11: 'Jungla',
  12: 'Badlands',
  13: 'Bosque Oscuro',
  14: 'Llanuras Heladas',
  15: 'Isla de Hongos',
};

interface SeedMapCanvasProps {
  seed: string;
  version: string;
  activeStructures: string[];
  showBiomes: boolean;
}

const SeedMapCanvas: React.FC<SeedMapCanvasProps> = ({ 
  seed, 
  version, 
  activeStructures,
  showBiomes 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [structures, setStructures] = useState<MinecraftStructure[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [module, setModule] = useState<any>(null);
  const [hoveredBiome, setHoveredBiome] = useState<number | null>(null);
  const [hoveredCoords, setHoveredCoords] = useState<{x: number, z: number} | null>(null);
  
  const { 
    position, 
    zoom, 
    isDragging,
    selectedStructure,
    handleCanvasClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel
  } = useMapStore();

  // Cargar el módulo de Cubiomes
  useEffect(() => {
    const loadModule = async () => {
      try {
        const loadedModule = await CubiomesModule();
        setModule(loadedModule);
        console.log('Módulo Cubiomes cargado');
      } catch (error) {
        console.error('Error al cargar el módulo Cubiomes:', error);
        toast.error('Error al cargar el generador de biomas');
      }
    };
    
    loadModule();
  }, []);

  // Generar estructuras cuando cambia la semilla o versión
  useEffect(() => {
    if (!module || !seed) return;
    
    const generateStructures = async () => {
      setLoading(true);
      
      try {
        const newStructures: MinecraftStructure[] = [];
        
        // Para cada tipo de estructura activa
        for (const structureType of activeStructures) {
          // Llamar a la función de Cubiomes para obtener estructuras
          const seedPtr = module._malloc(seed.length + 1);
          const versionPtr = module._malloc(version.length + 1);
          const typePtr = module._malloc(structureType.length + 1);
          
          // Escribir las cadenas en la memoria
          for (let i = 0; i < seed.length; i++) {
            module.HEAPU8[seedPtr + i] = seed.charCodeAt(i);
          }
          module.HEAPU8[seedPtr + seed.length] = 0;
          
          for (let i = 0; i < version.length; i++) {
            module.HEAPU8[versionPtr + i] = version.charCodeAt(i);
          }
          module.HEAPU8[versionPtr + version.length] = 0;
          
          for (let i = 0; i < structureType.length; i++) {
            module.HEAPU8[typePtr + i] = structureType.charCodeAt(i);
          }
          module.HEAPU8[typePtr + structureType.length] = 0;
          
          // Reservar memoria para los resultados
          const resultSize = 100; // Máximo 100 estructuras
          const resultPtr = module._malloc(resultSize * 20); // 5 ints * 4 bytes por estructura
          
          // Llamar a la función
          const centerX = 0;
          const centerZ = 0;
          const radius = 4000; // Radio de búsqueda en bloques
          
          const count = module.ccall(
            'getStructuresNear',
            'number',
            ['number', 'number', 'number', 'number', 'number', 'number', 'number'],
            [seedPtr, centerX, centerZ, typePtr, radius, versionPtr, resultPtr]
          );
          
          // Procesar los resultados
          for (let i = 0; i < count; i++) {
            const offset = resultPtr + i * 20;
            const type = module.HEAP32[offset / 4];
            const x = module.HEAP32[(offset + 4) / 4];
            const z = module.HEAP32[(offset + 8) / 4];
            const biome = module.HEAP32[(offset + 12) / 4];
            const distance = module.HEAP32[(offset + 16) / 4];
            
            const typeNames = [
              'village', 'temple', 'stronghold', 'monument', 'mansion',
              'mineshaft', 'fortress', 'spawner', 'outpost', 'ruined_portal'
            ];
            
            newStructures.push({
              type: typeNames[type],
              x,
              z,
              biome,
              distanceFromSpawn: distance
            });
          }
          
          // Liberar memoria
          module._free(seedPtr);
          module._free(versionPtr);
          module._free(typePtr);
          module._free(resultPtr);
        }
        
        setStructures(newStructures);
        toast.success(`${newStructures.length} estructuras encontradas`);
      } catch (error) {
        console.error('Error al generar estructuras:', error);
        toast.error('Error al generar estructuras');
      } finally {
        setLoading(false);
      }
    };
    
    generateStructures();
  }, [module, seed, version, activeStructures]);

  // Obtener el bioma en una posición del mapa
  const getBiomeAt = (x: number, z: number): number => {
    if (!module || !seed) return 0;
    
    try {
      const seedPtr = module._malloc(seed.length + 1);
      const versionPtr = module._malloc(version.length + 1);
      
      // Escribir las cadenas en la memoria
      for (let i = 0; i < seed.length; i++) {
        module.HEAPU8[seedPtr + i] = seed.charCodeAt(i);
      }
      module.HEAPU8[seedPtr + seed.length] = 0;
      
      for (let i = 0; i < version.length; i++) {
        module.HEAPU8[versionPtr + i] = version.charCodeAt(i);
      }
      module.HEAPU8[versionPtr + version.length] = 0;
      
      // Llamar a la función
      const biome = module.ccall(
        'getBiomeAt',
        'number',
        ['number', 'number', 'number', 'number'],
        [seedPtr, x, z, versionPtr]
      );
      
      // Liberar memoria
      module._free(seedPtr);
      module._free(versionPtr);
      
      return biome;
    } catch (error) {
      console.error('Error al obtener bioma:', error);
      return 0;
    }
  };

  // Renderizar el mapa
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const renderMap = () => {
      // Obtener dimensiones del canvas
      const width = canvas.width;
      const height = canvas.height;
      
      // Limpiar el canvas
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, width, height);
      
      const chunkSize = 16 * zoom; // Tamaño de un chunk en píxeles
      const centerX = width / 2 + position.x;
      const centerZ = height / 2 + position.y;
      
      // Dibujar la cuadrícula y/o biomas
      const startChunkX = Math.floor((0 - centerX) / chunkSize);
      const startChunkZ = Math.floor((0 - centerZ) / chunkSize);
      const endChunkX = Math.ceil((width - centerX) / chunkSize);
      const endChunkZ = Math.ceil((height - centerZ) / chunkSize);
      
      // Dibujar biomas o cuadrícula
      for (let chunkZ = startChunkZ; chunkZ <= endChunkZ; chunkZ++) {
        for (let chunkX = startChunkX; chunkX <= endChunkX; chunkX++) {
          const x = centerX + chunkX * chunkSize;
          const z = centerZ + chunkZ * chunkSize;
          
          // Convertir coordenadas de chunk a coordenadas del mundo
          const worldX = chunkX * 16;
          const worldZ = chunkZ * 16;
          
          if (showBiomes) {
            // Obtener y dibujar el bioma
            const biome = getBiomeAt(worldX, worldZ);
            ctx.fillStyle = biomeColors[biome] || '#888888';
            ctx.fillRect(x, z, chunkSize, chunkSize);
          } else {
            // Dibujar la cuadrícula
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, z, chunkSize, chunkSize);
            
            // Borde de la cuadrícula
            ctx.strokeStyle = '#dddddd';
            ctx.strokeRect(x, z, chunkSize, chunkSize);
            
            // Coordenadas cada 4 chunks (64 bloques)
            if (chunkX % 4 === 0 && chunkZ % 4 === 0 && zoom > 0.8) {
              ctx.fillStyle = '#888888';
              ctx.font = '10px Arial';
              ctx.fillText(`${worldX},${worldZ}`, x + 2, z + 10);
            }
          }
        }
      }
      
      // Dibujar las líneas de coordenadas principales
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 1;
      
      // Eje X (Z=0)
      ctx.beginPath();
      ctx.moveTo(0, centerZ);
      ctx.lineTo(width, centerZ);
      ctx.stroke();
      
      // Eje Z (X=0)
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();
      
      // Restaurar ancho de línea
      ctx.lineWidth = 1;
      
      // Dibujar las estructuras
      for (const structure of structures) {
        // Filtrar estructuras no activas
        if (!activeStructures.includes(structure.type)) continue;
        
        // Convertir coordenadas del mundo a coordenadas del canvas
        const canvasX = centerX + (structure.x / 16) * chunkSize;
        const canvasZ = centerZ + (structure.z / 16) * chunkSize;
        
        // Verificar si la estructura está dentro del canvas
        if (canvasX < -20 || canvasX > width + 20 || canvasZ < -20 || canvasZ > height + 20) {
          continue;
        }
        
        // Dibujar la estructura
        const isSelected = selectedStructure?.x === structure.x && selectedStructure?.z === structure.z;
        
        ctx.save();
        // Sombra para mejorar visibilidad
        if (isSelected) {
          ctx.shadowColor = '#000000';
          ctx.shadowBlur = 15;
        }
        
        const img = new Image();
        img.src = `/icons/${structure.type}.svg`;
        
        const size = isSelected ? 24 : 20;
        ctx.drawImage(img, canvasX - size/2, canvasZ - size/2, size, size);
        
        if (isSelected) {
          ctx.strokeStyle = '#ff0000';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(canvasX, canvasZ, 15, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        ctx.restore();
      }
      
      // Dibujar información de hover
      if (hoveredBiome !== null && hoveredCoords !== null) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 250, 70);
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.fillText(`Coordenadas: ${hoveredCoords.x}, ${hoveredCoords.z}`, 20, 30);
        ctx.fillText(`Bioma: ${biomeNames[hoveredBiome] || 'Desconocido'}`, 20, 50);
        
        const biomeColor = biomeColors[hoveredBiome] || '#888888';
        ctx.fillStyle = biomeColor;
        ctx.fillRect(20, 60, 15, 15);
      }
    };
    
    renderMap();
    
    // Event listener para el hover
    const handleHover = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const canvasX = e.clientX - rect.left;
      const canvasZ = e.clientY - rect.top;
      
      const width = canvas.width;
      const height = canvas.height;
      
      const chunkSize = 16 * zoom;
      const centerX = width / 2 + position.x;
      const centerZ = height / 2 + position.y;
      
      // Convertir coordenadas del canvas a coordenadas del mundo
      const worldX = Math.floor(((canvasX - centerX) / chunkSize) * 16);
      const worldZ = Math.floor(((canvasZ - centerZ) / chunkSize) * 16);
      
      const biome = getBiomeAt(worldX, worldZ);
      setHoveredBiome(biome);
      setHoveredCoords({x: worldX, z: worldZ});
    };
    
    canvas.addEventListener('mousemove', handleHover);
    
    return () => {
      canvas.removeEventListener('mousemove', handleHover);
    };
  }, [position, zoom, structures, module, seed, version, selectedStructure, showBiomes, activeStructures]);

  // Ajustar el tamaño del canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
      }
    });
    
    resizeObserver.observe(canvas.parentElement as Element);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onClick={(e) => handleCanvasClick(e, structures, activeStructures)}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-white rounded-full mb-2"></div>
            <p>Generando estructuras...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeedMapCanvas;
