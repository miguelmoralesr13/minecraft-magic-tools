
import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Map, 
  Search, 
  Castle, 
  Home, 
  Skull, 
  Trees, 
  Mountain, 
  Building, 
  AlertCircle,
  ChevronsUp,
  Anchor,
  Building2,
  Axe,
  Radar,
  Workflow,
  Landmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StructureType, MinecraftStructure } from "@/utils/minecraft/StructureGenerator";
import { BiomeType, biomeColors } from "@/utils/minecraft/BiomeGenerator";

interface MapComponentProps {
  seed: string;
  filters: string[];
  version: "bedrock" | "java";
  structures: MinecraftStructure[];
}

const MapComponent: React.FC<MapComponentProps> = ({ seed, filters, version, structures }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedStructure, setSelectedStructure] = useState<MinecraftStructure | null>(null);
  const [showBiomes, setShowBiomes] = useState(false);
  
  // Función para obtener el icono según el tipo
  const getIconForType = (type: StructureType) => {
    switch (type) {
      case "village": return <Home className="h-4 w-4" />;
      case "temple": return <Landmark className="h-4 w-4" />;
      case "spawner": return <Skull className="h-4 w-4" />;
      case "stronghold": return <Building className="h-4 w-4" />;
      case "monument": return <Anchor className="h-4 w-4" />;
      case "mansion": return <Building2 className="h-4 w-4" />;
      case "mineshaft": return <Axe className="h-4 w-4" />;
      case "fortress": return <Castle className="h-4 w-4" />;
      case "outpost": return <Radar className="h-4 w-4" />;
      case "ruined_portal": return <Workflow className="h-4 w-4" />;
      default: return <Map className="h-4 w-4" />;
    }
  };

  // Obtener color según el tipo de estructura
  const getColorForType = (type: StructureType): string => {
    switch (type) {
      case "village": return "#3b82f6"; // Azul
      case "temple": return "#facc15"; // Amarillo
      case "spawner": return "#dc2626"; // Rojo
      case "stronghold": return "#10b981"; // Verde
      case "monument": return "#6366f1"; // Índigo
      case "mansion": return "#8b5cf6"; // Violeta
      case "mineshaft": return "#d97706"; // Naranja
      case "fortress": return "#ef4444"; // Rojo brillante
      case "outpost": return "#f59e0b"; // Amber
      case "ruined_portal": return "#6b7280"; // Gris
      default: return "#000000"; // Negro
    }
  };

  // Dibujar el mapa
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar el fondo según si estamos mostrando biomas o no
    if (showBiomes) {
      // Si mostramos biomas, creamos un efecto de mosaico de color
      const cellSize = 20 * zoom;
      const offsetX = position.x % cellSize;
      const offsetY = position.y % cellSize;
      
      for (let x = 0; x < canvas.width; x += cellSize) {
        for (let y = 0; y < canvas.height; y += cellSize) {
          // Convertir coordenadas del canvas a coordenadas del mundo
          const worldX = Math.floor((x - position.x - canvas.width/2) / zoom);
          const worldZ = Math.floor((y - position.y - canvas.height/2) / zoom);
          
          // Simulamos biomas para este ejemplo (en realidad deberíamos usar el BiomeGenerator)
          // Esto es solo para visualización, no es preciso
          const noiseX = Math.sin(worldX * 0.01) * Math.cos(worldZ * 0.01);
          const noiseZ = Math.sin(worldZ * 0.02) * Math.cos(worldX * 0.02);
          const biomeValue = (noiseX + noiseZ + 2) / 4; // Normalizado entre 0 y 1
          
          let biome: BiomeType;
          if (biomeValue < 0.1) biome = 'ice_plains';
          else if (biomeValue < 0.3) biome = 'plains';
          else if (biomeValue < 0.5) biome = 'forest';
          else if (biomeValue < 0.6) biome = 'desert';
          else if (biomeValue < 0.7) biome = 'mountains';
          else if (biomeValue < 0.8) biome = 'jungle';
          else if (biomeValue < 0.9) biome = 'swamp';
          else biome = 'ocean';
          
          ctx.fillStyle = biomeColors[biome];
          ctx.fillRect(x + offsetX, y + offsetY, cellSize, cellSize);
        }
      }
    } else {
      // Dibujar el fondo normal
      ctx.fillStyle = "#f3f4f6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar la cuadrícula
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      
      const gridSize = 50 * zoom;
      const offsetX = position.x % gridSize;
      const offsetY = position.y % gridSize;
      
      for (let x = offsetX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = offsetY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
    
    // Dibujar el origen (0,0)
    const originX = canvas.width / 2 + position.x;
    const originY = canvas.height / 2 + position.y;
    
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(originX, originY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.fillText("(0,0)", originX + 10, originY - 10);
    
    // Dibujar las estructuras
    structures.forEach(structure => {
      // Solo dibujar si no hay filtros o si el tipo está en los filtros
      if (filters.length === 0 || filters.includes(structure.type)) {
        const x = canvas.width / 2 + (structure.x * zoom) / 16 + position.x;
        const y = canvas.height / 2 + (structure.z * zoom) / 16 + position.y;
        
        // Dibujar el punto
        ctx.fillStyle = selectedStructure?.x === structure.x && selectedStructure?.z === structure.z 
          ? "#ff0000" 
          : getColorForType(structure.type);
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Si está seleccionado o cercano al ratón, mostrar el nombre
        if (selectedStructure?.x === structure.x && selectedStructure?.z === structure.z) {
          ctx.fillStyle = "#000000";
          ctx.font = "12px Arial";
          ctx.fillText(
            `${structure.type.charAt(0).toUpperCase() + structure.type.slice(1)} (${structure.x}, ${structure.z})`, 
            x + 10, 
            y - 10
          );
        }
      }
    });
    
  }, [structures, position, zoom, selectedStructure, filters, showBiomes]);

  // Detectar estructura bajo el cursor
  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    
    // Convertir coordenadas del canvas a coordenadas del mundo
    const worldX = ((canvasX - canvas.width/2 - position.x) * 16) / zoom;
    const worldZ = ((canvasY - canvas.height/2 - position.y) * 16) / zoom;
    
    // Buscar la estructura más cercana dentro de un radio
    const clickRadius = 30 / zoom; // Radio de detección en bloques
    let closestStructure = null;
    let minDistance = clickRadius;
    
    structures.forEach(structure => {
      // Solo considerar si no hay filtros o si el tipo está en los filtros
      if (filters.length === 0 || filters.includes(structure.type)) {
        const distance = Math.sqrt(
          Math.pow(structure.x - worldX, 2) + 
          Math.pow(structure.z - worldZ, 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestStructure = structure;
        }
      }
    });
    
    if (closestStructure) {
      setSelectedStructure(closestStructure);
      
      // Mostrar toast con información
      toast.info(`${closestStructure.type.charAt(0).toUpperCase() + closestStructure.type.slice(1)}`, {
        description: `Coords: ${closestStructure.x}, ${closestStructure.z} | Bioma: ${closestStructure.biome} | Distancia al spawn: ${Math.floor(closestStructure.distanceFromSpawn)} bloques`
      });
    } else {
      setSelectedStructure(null);
    }
  };

  // Manejar el zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.5, Math.min(2, zoom + delta));
    setZoom(newZoom);
  };

  // Manejar el arrastre
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartDragPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startDragPosition.x,
        y: e.clientY - startDragPosition.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Centrar el mapa
  const handleCenter = () => {
    setPosition({ x: 0, y: 0 });
    setZoom(1);
    toast.info("Mapa centrado", {
      description: "Posición y zoom restablecidos"
    });
  };

  // Alternar visualización de biomas
  const toggleBiomes = () => {
    setShowBiomes(!showBiomes);
    toast.info(showBiomes ? "Biomas ocultos" : "Biomas mostrados", {
      description: showBiomes ? "Mostrando vista de cuadrícula" : "Mostrando mapa de biomas"
    });
  };

  return (
    <Card className="p-4 h-[600px] relative overflow-hidden">
      {!seed && (
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-background/80 z-10">
          <Map className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold">Ingresa una semilla para comenzar</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Ingresa una semilla en el panel de la izquierda para ver qué puedes encontrar en ese mundo.
          </p>
        </div>
      )}
      
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleBiomes}
          disabled={!seed}
        >
          <Trees className="h-4 w-4 mr-2" />
          {showBiomes ? "Ocultar Biomas" : "Mostrar Biomas"}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCenter}
          disabled={!seed}
        >
          <Map className="h-4 w-4 mr-2" />
          Centrar
        </Button>
      </div>
      
      <div className="absolute bottom-4 left-4 z-10">
        <div className="text-xs text-muted-foreground">
          Zoom: {(zoom * 100).toFixed(0)}% | Escala: 1 chunk = {zoom < 1 ? `${(1/zoom).toFixed(1)} píxeles` : `${zoom.toFixed(1)} píxeles`}
        </div>
      </div>
      
      {selectedStructure && (
        <div className="absolute bottom-4 right-4 z-10 bg-background/80 p-2 rounded-md border border-border">
          <h4 className="text-sm font-semibold flex items-center gap-1">
            {getIconForType(selectedStructure.type)}
            {selectedStructure.type.charAt(0).toUpperCase() + selectedStructure.type.slice(1)}
          </h4>
          <div className="text-xs text-muted-foreground">
            <p>Coordenadas: X: {selectedStructure.x}, Z: {selectedStructure.z}</p>
            <p>Bioma: {selectedStructure.biome}</p>
            <p>Distancia al spawn: {Math.floor(selectedStructure.distanceFromSpawn)} bloques</p>
          </div>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
      
      {structures.length === 0 && seed && (
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-background/80 z-10">
          <AlertCircle className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold">No se encontraron estructuras</h3>
          <p className="text-muted-foreground text-center max-w-md">
            No se encontraron estructuras con los filtros actuales. Prueba con otros filtros o una semilla diferente.
          </p>
        </div>
      )}
    </Card>
  );
};

export default MapComponent;
