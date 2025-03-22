
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
  Pencil
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MapComponentProps {
  seed: string;
  filters: string[];
  version: "bedrock" | "java";
}

interface MapLocation {
  id: string;
  type: string;
  x: number;
  z: number;
  name: string;
  icon: React.ReactNode;
}

const MapComponent: React.FC<MapComponentProps> = ({ seed, filters, version }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapData, setMapData] = useState<MapLocation[]>([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  
  // Función para obtener el icono según el tipo
  const getIconForType = (type: string) => {
    switch (type) {
      case "village": return <Home className="h-4 w-4" />;
      case "temple": return <Castle className="h-4 w-4" />;
      case "spawner": return <Skull className="h-4 w-4" />;
      case "forest": return <Trees className="h-4 w-4" />;
      case "mountain": return <Mountain className="h-4 w-4" />;
      case "stronghold": return <Building className="h-4 w-4" />;
      default: return <Map className="h-4 w-4" />;
    }
  };

  // Simulación de datos según la semilla (en un proyecto real, esto vendría de una API)
  useEffect(() => {
    if (!seed) {
      setMapData([]);
      return;
    }

    // Generar datos aleatorios basados en la semilla
    const seedNumber = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (min: number, max: number) => Math.floor((seedNumber % 100) / 100 * (max - min) + min);
    
    const types = ["village", "temple", "spawner", "forest", "mountain", "stronghold"];
    const newMapData: MapLocation[] = [];
    
    // Generar 15 ubicaciones aleatorias
    for (let i = 0; i < 15; i++) {
      const type = types[i % types.length];
      if (filters.length === 0 || filters.includes(type)) {
        newMapData.push({
          id: `location-${i}`,
          type,
          x: random(-1000, 1000),
          z: random(-1000, 1000),
          name: `${type.charAt(0).toUpperCase() + type.slice(1)} #${i+1}`,
          icon: getIconForType(type)
        });
      }
    }
    
    setMapData(newMapData);
    
    // Notificar al usuario
    toast.success(`Semilla cargada: ${seed}`, {
      description: `${newMapData.length} ubicaciones encontradas`
    });
    
  }, [seed, filters]);

  // Dibujar el mapa
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar el fondo
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
    
    // Dibujar las ubicaciones
    mapData.forEach(location => {
      const x = canvas.width / 2 + (location.x * zoom) + position.x;
      const y = canvas.height / 2 + (location.z * zoom) + position.y;
      
      // Dibujar el punto
      ctx.fillStyle = selectedLocation?.id === location.id ? "#ff0000" : "#3b82f6";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Dibujar el nombre
      ctx.fillStyle = "#000000";
      ctx.font = "12px Arial";
      ctx.fillText(`${location.name} (${location.x}, ${location.z})`, x + 10, y - 10);
    });
    
  }, [mapData, position, zoom, selectedLocation]);

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
          onClick={handleCenter}
          disabled={!seed}
        >
          <Map className="h-4 w-4 mr-2" />
          Centrar
        </Button>
      </div>
      
      <div className="absolute bottom-4 left-4 z-10">
        <div className="text-xs text-muted-foreground">
          Zoom: {(zoom * 100).toFixed(0)}% | Escala: 1 bloque = {zoom < 1 ? `${(1/zoom).toFixed(1)} píxeles` : `${zoom.toFixed(1)} píxeles`}
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </Card>
  );
};

export default MapComponent;
