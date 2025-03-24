
import React, { useEffect, useRef, useState } from 'react';
import { useCanvasControls } from '@/hooks/useCanvasControls';
import CubiomesModule from '../../wasm/cubiomes/build/cubiomes.js';
import { toast } from 'sonner';
import StructureMarkers from './StructureMarkers';
import { MinecraftStructure } from '@/store/mapStore';

// Colores por bioma - paleta mejorada
const biomeColors: Record<number, string> = {
  0: '#000000', // Unknown
  1: '#91BD59', // Plains
  2: '#F2B52B', // Desert
  3: '#59C93C', // Forest
  4: '#606060', // Mountains
  5: '#2C4205', // Swamp
  6: '#0000FF', // Ocean
  7: '#3F76E4', // River
  8: '#88BB67', // Taiga
  9: '#E9D6AF', // Beach
  10: '#BFAE48', // Savanna
  11: '#1EBC5F', // Jungle
  12: '#D97611', // Badlands
  13: '#29471F', // Dark Forest
  14: '#80B497', // Ice Plains
  15: '#AC5B57', // Mushroom Island
};

// Nombres de biomas para mostrar
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

interface MapCanvasProps {
  seed: string;
  version: string;
  activeFilters: string[];
  width?: number;
  height?: number;
  onSelectBiome?: (biome: number, coords: { x: number, z: number }) => void;
  onSelectStructure?: (structure: MinecraftStructure) => void;
}

const MapCanvas: React.FC<MapCanvasProps> = ({
  seed,
  version,
  activeFilters,
  width = 800,
  height = 600,
  onSelectBiome,
  onSelectStructure
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cubiomesModule, setCubiomesModule] = useState<any>(null);
  const [hoveredBiome, setHoveredBiome] = useState<number | null>(null);
  const [hoveredCoords, setHoveredCoords] = useState<{x: number, z: number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [selectedStructure, setSelectedStructure] = useState<MinecraftStructure | null>(null);
  
  // Usar el hook personalizado para controles del canvas
  const {
    position,
    zoom,
    isDragging,
    startDrag,
    drag,
    endDrag,
    handleWheel
  } = useCanvasControls();

  // Cargar el módulo de Cubiomes
  useEffect(() => {
    const loadModule = async () => {
      try {
        const module = await CubiomesModule();
        setCubiomesModule(module);
        console.log('Módulo Cubiomes cargado correctamente');
      } catch (error) {
        console.error('Error al cargar el módulo Cubiomes:', error);
        toast.error('No se pudo cargar el generador de biomas');
      }
    };
    
    loadModule();
  }, []);

  // Obtener el bioma en una posición específica
  const getBiomeAt = (x: number, z: number): number => {
    if (!cubiomesModule || !seed) return 0;
    
    try {
      const seedPtr = cubiomesModule._malloc(seed.length + 1);
      const versionPtr = cubiomesModule._malloc(version.length + 1);
      
      // Escribir las cadenas en la memoria
      for (let i = 0; i < seed.length; i++) {
        cubiomesModule.HEAPU8[seedPtr + i] = seed.charCodeAt(i);
      }
      cubiomesModule.HEAPU8[seedPtr + seed.length] = 0;
      
      for (let i = 0; i < version.length; i++) {
        cubiomesModule.HEAPU8[versionPtr + i] = version.charCodeAt(i);
      }
      cubiomesModule.HEAPU8[versionPtr + version.length] = 0;
      
      // Llamar a la función
      const biome = cubiomesModule.ccall(
        'getBiomeAt',
        'number',
        ['number', 'number', 'number', 'number'],
        [seedPtr, x, z, versionPtr]
      );
      
      // Liberar memoria
      cubiomesModule._free(seedPtr);
      cubiomesModule._free(versionPtr);
      
      return biome;
    } catch (error) {
      console.error('Error al obtener bioma:', error);
      return 0;
    }
  };

  // Handle structure selection
  const handleStructureSelect = (structure: MinecraftStructure) => {
    setSelectedStructure(structure);
    if (onSelectStructure) {
      onSelectStructure(structure);
    }
  };

  // Renderizar el mapa
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !cubiomesModule) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsLoading(true);
    
    // Función para renderizar el mapa
    const renderMap = () => {
      // Dimensiones del canvas
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      // Update canvas size state
      setCanvasSize({ width: canvasWidth, height: canvasHeight });
      
      // Limpiar el canvas
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Tamaño de un chunk en píxeles
      const chunkSize = 16 * zoom;
      
      // Posición central del canvas
      const centerX = canvasWidth / 2 + position.x;
      const centerZ = canvasHeight / 2 + position.y;
      
      // Calcular chunks visibles
      const startChunkX = Math.floor((0 - centerX) / chunkSize);
      const startChunkZ = Math.floor((0 - centerZ) / chunkSize);
      const endChunkX = Math.ceil((canvasWidth - centerX) / chunkSize);
      const endChunkZ = Math.ceil((canvasHeight - centerZ) / chunkSize);
      
      // Dibujar los chunks visibles
      for (let chunkZ = startChunkZ; chunkZ <= endChunkZ; chunkZ++) {
        for (let chunkX = startChunkX; chunkX <= endChunkX; chunkX++) {
          // Coordenadas del chunk en el canvas
          const x = centerX + chunkX * chunkSize;
          const z = centerZ + chunkZ * chunkSize;
          
          // Coordenadas del chunk en el mundo
          const worldX = chunkX * 16;
          const worldZ = chunkZ * 16;
          
          // Obtener el bioma en esta posición
          const biome = getBiomeAt(worldX, worldZ);
          
          // Dibujar el chunk con el color del bioma
          ctx.fillStyle = biomeColors[biome] || '#888888';
          ctx.fillRect(x, z, chunkSize, chunkSize);
          
          // Si el zoom es suficiente, dibujar bordes y coordenadas
          if (zoom > 0.8) {
            // Borde del chunk
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.strokeRect(x, z, chunkSize, chunkSize);
            
            // Coordenadas cada 4 chunks (64 bloques)
            if (chunkX % 4 === 0 && chunkZ % 4 === 0) {
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              ctx.font = '10px Arial';
              ctx.fillText(`${worldX},${worldZ}`, x + 2, z + 10);
            }
          }
        }
      }
      
      // Dibujar ejes principales
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 1;
      
      // Eje X (Z=0)
      ctx.beginPath();
      ctx.moveTo(0, centerZ);
      ctx.lineTo(canvasWidth, centerZ);
      ctx.stroke();
      
      // Eje Z (X=0)
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, canvasHeight);
      ctx.stroke();
      
      // Restaurar ancho de línea
      ctx.lineWidth = 1;
      
      // Información de hover
      if (hoveredBiome !== null && hoveredCoords !== null) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 250, 70);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.fillText(`Coordenadas: ${hoveredCoords.x}, ${hoveredCoords.z}`, 20, 30);
        ctx.fillText(`Bioma: ${biomeNames[hoveredBiome] || 'Desconocido'}`, 20, 50);
        
        // Muestra de color del bioma
        const biomeColor = biomeColors[hoveredBiome] || '#888888';
        ctx.fillStyle = biomeColor;
        ctx.fillRect(20, 60, 15, 15);
      }

      setIsLoading(false);
    };
    
    // Ejecutar la renderización
    const timerId = setTimeout(renderMap, 50);
    
    return () => {
      clearTimeout(timerId);
    };
  }, [cubiomesModule, position, zoom, seed, version, activeFilters]);

  // Manejar eventos del mouse
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    startDrag(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    
    // Actualizar arrastre si está activo
    drag(canvasX, canvasY);
    
    // Calcular la posición en el mundo para mostrar información de bioma
    if (cubiomesModule && seed) {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const centerX = canvasWidth / 2 + position.x;
      const centerZ = canvasHeight / 2 + position.y;
      const chunkSize = 16 * zoom;
      
      // Convertir coordenadas del canvas a coordenadas del mundo
      const worldX = Math.floor(((canvasX - centerX) / chunkSize) * 16);
      const worldZ = Math.floor(((canvasY - centerZ) / chunkSize) * 16);
      
      const biome = getBiomeAt(worldX, worldZ);
      setHoveredBiome(biome);
      setHoveredCoords({x: worldX, z: worldZ});
      
      // Llamar al callback si existe
      if (onSelectBiome && e.shiftKey) {
        onSelectBiome(biome, {x: worldX, z: worldZ});
      }
    }
  };

  const handleMouseUp = () => {
    endDrag();
  };

  // Ajustar el tamaño del canvas cuando cambia el contenedor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      } else {
        canvas.width = width;
        canvas.height = height;
      }
    };
    
    resizeCanvas();
    
    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [width, height]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      
      {/* Overlay for structure markers */}
      <StructureMarkers
        seed={seed}
        version={version}
        activeStructures={activeFilters}
        position={position}
        zoom={zoom}
        canvasWidth={canvasSize.width}
        canvasHeight={canvasSize.height}
        onSelectStructure={handleStructureSelect}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-white rounded-full mb-2"></div>
            <p>Generando mapa...</p>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 text-xs text-gray-600">
        <p>Semilla: {seed} | Versión: {version} | Zoom: {zoom.toFixed(1)}x</p>
        <p>Shift + Click para seleccionar bioma</p>
      </div>
    </div>
  );
};

export default MapCanvas;
