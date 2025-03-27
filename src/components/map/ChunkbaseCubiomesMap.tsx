
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { ChunkbaseCubiomesAdapter } from '@/utils/minecraft/ChunkbaseCubiomesAdapter';
import { structureColors, structureSizes } from '@/utils/minecraft/structureColors';
import { biomeColors } from '@/utils/minecraft/biomeColors';
import { MinecraftStructure } from '@/utils/minecraft/StructureGenerator';
import { toast } from 'sonner';
import { initCubiomes, isCubiomesLoaded } from '@/utils/minecraft/initCubiomes';

interface ChunkbaseCubiomesMapProps {
  seed: string;
  version: "java" | "bedrock";
  filters: string[];
  isLoading?: boolean;
  onLoadingChange?: (isLoading: boolean) => void;
}

export interface ChunkbaseCubiomesMapRef {
  downloadMap: () => void;
}

const ChunkbaseCubiomesMap = forwardRef<ChunkbaseCubiomesMapRef, ChunkbaseCubiomesMapProps>(({
  seed,
  version,
  filters,
  isLoading = false,
  onLoadingChange
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [adapter, setAdapter] = useState<ChunkbaseCubiomesAdapter | null>(null);
  const [structures, setStructures] = useState<MinecraftStructure[]>([]);
  const [hoveredStructure, setHoveredStructure] = useState<MinecraftStructure | null>(null);
  const [selectedStructure, setSelectedStructure] = useState<MinecraftStructure | null>(null);
  const [showBiomes, setShowBiomes] = useState<boolean>(false);
  const [mapLoading, setMapLoading] = useState<boolean>(isLoading);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  // Inicializar Cubiomes y el adaptador
  useEffect(() => {
    const initialize = async () => {
      try {
        // Inicializar Cubiomes si no está cargado
        if (!isCubiomesLoaded()) {
          setMapLoading(true);
          if (onLoadingChange) onLoadingChange(true);
          await initCubiomes();
        }
        
        // Crear el adaptador
        import('@/utils/minecraft/ChunkbaseCubiomesAdapter').then(async (module) => {
          const newAdapter = await module.createChunkbaseCubiomesAdapter(seed, version === "java" ? "1.20" : "1.20B");
          setAdapter(newAdapter);
          generateMap(newAdapter);
        });
      } catch (error) {
        console.error('Error al inicializar:', error);
        toast.error('Error al inicializar el generador de mapas');
        setMapLoading(false);
        if (onLoadingChange) onLoadingChange(false);
      }
    };
    
    initialize();
  }, []);
  
  // Regenerar el mapa cuando cambia la semilla o versión
  useEffect(() => {
    if (!adapter) return;
    
    adapter.setSeedAndVersion(seed, version === "java" ? "1.20" : "1.20B");
    generateMap(adapter);
  }, [seed, version, adapter]);
  
  // Actualizar el estado de carga
  useEffect(() => {
    if (isLoading !== mapLoading) {
      setMapLoading(isLoading);
    }
  }, [isLoading]);
  
  // Generar el mapa con estructuras
  const generateMap = async (mapAdapter: ChunkbaseCubiomesAdapter) => {
    if (!mapAdapter) return;
    
    try {
      setMapLoading(true);
      if (onLoadingChange) onLoadingChange(true);
      
      const result = await mapAdapter.generateMap({
        seed,
        version: version === "java" ? "1.20" : "1.20B",
        showBiomes
      });
      
      setStructures(result.structures);
      toast.success(`${result.structures.length} estructuras generadas para la semilla: ${seed}`);
    } catch (error) {
      console.error('Error al generar el mapa:', error);
      toast.error('Error al generar el mapa');
    } finally {
      setMapLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }
  };
  
  // Funcionalidad para descargar el mapa
  const downloadMap = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `minecraft-map-seed-${seed}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Mapa descargado correctamente');
  };
  
  // Exponer la función de descarga a través de ref
  useImperativeHandle(ref, () => ({
    downloadMap
  }));
  
  // Ajustar tamaño del canvas cuando cambia el contenedor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      canvas.width = width;
      canvas.height = height;
      setCanvasSize({ width, height });
      renderMap();
    });
    
    resizeObserver.observe(canvas.parentElement as Element);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  
  // Renderizar el mapa cuando cambian las estructuras o filtros
  useEffect(() => {
    renderMap();
  }, [structures, filters, position, zoom, hoveredStructure, selectedStructure, showBiomes]);
  
  // Renderizar el mapa
  const renderMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar el fondo
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calcular centro del canvas
    const centerX = canvas.width / 2 + position.x;
    const centerZ = canvas.height / 2 + position.y;
    
    // Dibujar cuadrícula
    const gridSize = 16 * zoom;
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;
    
    // Líneas verticales
    for (let x = centerX % gridSize; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Líneas horizontales
    for (let z = centerZ % gridSize; z < canvas.height; z += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, z);
      ctx.lineTo(canvas.width, z);
      ctx.stroke();
    }
    
    // Dibujar ejes
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1;
    
    // Eje X (Z=0)
    ctx.beginPath();
    ctx.moveTo(0, centerZ);
    ctx.lineTo(canvas.width, centerZ);
    ctx.stroke();
    
    // Eje Z (X=0)
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    
    // Dibujar punto de spawn
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerZ, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerZ, 7, 0, Math.PI * 2);
    ctx.stroke();
    
    // Dibujar estructuras
    structures.forEach(structure => {
      // Filtrar estructuras
      if (filters.length > 0 && !filters.includes(structure.type)) return;
      
      // Convertir coordenadas del mundo a coordenadas del canvas
      const x = centerX + (structure.x * zoom) / 16;
      const z = centerZ + (structure.z * zoom) / 16;
      
      // Verificar si está dentro del canvas (con margen)
      if (x < -50 || x > canvas.width + 50 || z < -50 || z > canvas.height + 50) {
        return;
      }
      
      // Determinar si está seleccionada o hover
      const isHovered = hoveredStructure === structure;
      const isSelected = selectedStructure === structure;
      const size = structureSizes[structure.type] || 20;
      const scaledSize = size * Math.max(0.5, Math.min(1.5, zoom / 1.5));
      
      // Dibujar fondo de la estructura
      ctx.fillStyle = structureColors[structure.type] || structureColors.unknown;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(x, z, scaledSize / 2 + (isSelected ? 6 : isHovered ? 4 : 2), 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      
      // Dibujar icono
      try {
        const img = new Image();
        img.src = `/icons/${structure.type}.svg`;
        ctx.drawImage(img, x - scaledSize / 2, z - scaledSize / 2, scaledSize, scaledSize);
      } catch (e) {
        // Fallback si no se encuentra el icono
        ctx.fillStyle = structureColors[structure.type] || structureColors.unknown;
        ctx.beginPath();
        ctx.arc(x, z, scaledSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Destacar estructura seleccionada
      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, z, scaledSize / 2 + 6, 0, Math.PI * 2);
        ctx.stroke();
        
        // Mostrar información de la estructura
        const infoX = x + scaledSize;
        const infoY = z - scaledSize;
        
        // Fondo de la información
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(infoX, infoY, 170, 80);
        
        // Texto de la información
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText(`Tipo: ${structure.type}`, infoX + 10, infoY + 20);
        ctx.fillText(`X: ${structure.x}, Z: ${structure.z}`, infoX + 10, infoY + 40);
        ctx.fillText(`Bioma: ${structure.biome}`, infoX + 10, infoY + 60);
      } else if (isHovered) {
        ctx.strokeStyle = structureColors[structure.type] || structureColors.unknown;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, z, scaledSize / 2 + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
    
    // Mostrar coordenadas actuales
    const worldX = Math.floor(-position.x * 16 / zoom);
    const worldZ = Math.floor(-position.y * 16 / zoom);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, canvas.height - 40, 180, 30);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText(`X: ${worldX}, Z: ${worldZ}, Zoom: ${zoom.toFixed(1)}x`, 15, canvas.height - 20);
  };
  
  // Manejo de eventos del mouse
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
    
    // Detectar estructura bajo el cursor
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const centerX = canvas.width / 2 + position.x;
    const centerZ = canvas.height / 2 + position.y;
    
    let found = false;
    
    for (const structure of structures) {
      if (filters.length > 0 && !filters.includes(structure.type)) continue;
      
      const x = centerX + (structure.x * zoom) / 16;
      const z = centerZ + (structure.z * zoom) / 16;
      const size = structureSizes[structure.type] || 20;
      const scaledSize = size * Math.max(0.5, Math.min(1.5, zoom / 1.5));
      
      const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - z, 2));
      
      if (distance <= scaledSize / 2 + 5) {
        setHoveredStructure(structure);
        found = true;
        break;
      }
    }
    
    if (!found) {
      setHoveredStructure(null);
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredStructure) {
      setSelectedStructure(hoveredStructure === selectedStructure ? null : hoveredStructure);
    } else {
      setSelectedStructure(null);
    }
  };
  
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(10, zoom * zoomFactor));
    
    setZoom(newZoom);
  };
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
      />
      
      {mapLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Generando mapa...</p>
          </div>
        </div>
      )}
      
      {selectedStructure && (
        <div className="absolute bottom-4 right-4 p-4 bg-background/90 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold capitalize">{selectedStructure.type.replace('_', ' ')}</h3>
          <p>Coordenadas: X: {selectedStructure.x}, Z: {selectedStructure.z}</p>
          <p>Bioma: {selectedStructure.biome}</p>
          <p>Distancia del spawn: {Math.round(selectedStructure.distanceFromSpawn)} bloques</p>
        </div>
      )}
      
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          className="p-2 bg-background/90 rounded-full hover:bg-background/80 transition-colors"
          onClick={() => setZoom(Math.min(10, zoom * 1.2))}
          title="Acercar"
        >
          +
        </button>
        <button
          className="p-2 bg-background/90 rounded-full hover:bg-background/80 transition-colors"
          onClick={() => setZoom(Math.max(0.1, zoom / 1.2))}
          title="Alejar"
        >
          -
        </button>
        <button
          className="p-2 bg-background/90 rounded-full hover:bg-background/80 transition-colors"
          onClick={() => {
            setPosition({ x: 0, y: 0 });
            setZoom(1);
          }}
          title="Reiniciar vista"
        >
          ↺
        </button>
      </div>
    </div>
  );
});

ChunkbaseCubiomesMap.displayName = "ChunkbaseCubiomesMap";

export default ChunkbaseCubiomesMap;
