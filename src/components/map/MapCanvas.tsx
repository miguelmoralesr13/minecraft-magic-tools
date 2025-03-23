
import React, { useEffect, useRef, useMemo } from "react";
import { MinecraftStructure } from "@/utils/minecraft/StructureGenerator";
import { BiomeType, biomeColors, BiomeGenerator } from "@/utils/minecraft/BiomeGenerator";
import { getColorForType } from "./StructureIcon";

interface MapCanvasProps {
  structures: MinecraftStructure[];
  filters: string[];
  position: { x: number; y: number };
  zoom: number;
  showBiomes: boolean;
  selectedStructure: MinecraftStructure | null;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onClick: (e: React.MouseEvent) => void;
  onWheel: (e: React.WheelEvent) => void;
  seed?: string;
}

const MapCanvas: React.FC<MapCanvasProps> = ({
  structures,
  filters,
  position,
  zoom,
  showBiomes,
  selectedStructure,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onClick,
  onWheel,
  seed = "minecraft"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Create a BiomeGenerator instance with the current seed
  const biomeGenerator = useMemo(() => new BiomeGenerator(seed, 1024), [seed]);

  // Draw the map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the background according to whether we're showing biomes or not
    if (showBiomes) {
      // Use actual biome data with real BiomeGenerator
      const cellSize = 20 * zoom;
      
      for (let x = 0; x < canvas.width; x += cellSize) {
        for (let y = 0; y < canvas.height; y += cellSize) {
          // Convert canvas coordinates to world coordinates
          const worldX = Math.floor((x - position.x - canvas.width/2) / zoom);
          const worldZ = Math.floor((y - position.y - canvas.height/2) / zoom);
          
          // Get the actual biome at this location using BiomeGenerator
          const biome = biomeGenerator.getBiomeAt(worldX, worldZ);
          
          ctx.fillStyle = biomeColors[biome];
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    } else {
      // Draw the normal background
      ctx.fillStyle = "#f3f4f6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the grid
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
    
    // Draw the origin (0,0)
    const originX = canvas.width / 2 + position.x;
    const originY = canvas.height / 2 + position.y;
    
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(originX, originY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.fillText("(0,0)", originX + 10, originY - 10);
    
    // Draw the structures
    structures.forEach(structure => {
      // Only draw if there are no filters or if the type is in the filters
      if (filters.length === 0 || filters.includes(structure.type)) {
        const x = canvas.width / 2 + (structure.x * zoom) / 16 + position.x;
        const y = canvas.height / 2 + (structure.z * zoom) / 16 + position.y;
        
        // Draw the point
        ctx.fillStyle = selectedStructure?.x === structure.x && selectedStructure?.z === structure.z 
          ? "#ff0000" 
          : getColorForType(structure.type);
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // If selected or close to the mouse, show the name
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
    
  }, [structures, position, zoom, selectedStructure, filters, showBiomes, biomeGenerator]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    />
  );
};

export default MapCanvas;
