
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

// Updated biome colors to match more closely to Chunkbase style
const chunkbaseColors: Record<BiomeType, string> = {
  plains: '#8DB360',      // Light green
  desert: '#FA9418',      // Sandy orange
  forest: '#056621',      // Deep green
  mountains: '#606060',   // Grey
  swamp: '#07F9B2',       // Cyan-ish
  ocean: '#0000AA',       // Deep blue
  river: '#3030FF',       // Brighter blue
  taiga: '#0B6659',       // Dark teal
  beach: '#FADE55',       // Yellow sand
  savanna: '#BDB25F',     // Tan
  jungle: '#537B09',      // Dense green
  badlands: '#D94515',    // Reddish orange
  dark_forest: '#40511A', // Very dark green
  ice_plains: '#FFFFFF',  // White
  mushroom_island: '#FF55FF' // Pink/purple
};

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

  // Get coordinates from mouse position
  const getWorldCoordinates = (x: number, y: number, canvas: HTMLCanvasElement) => {
    const worldX = Math.floor((x - position.x - canvas.width/2) / zoom * 16);
    const worldZ = Math.floor((y - position.y - canvas.height/2) / zoom * 16);
    return { worldX, worldZ };
  };

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
      const cellSize = Math.max(5, 10 * zoom); // Smaller cells for more detail
      
      // Draw in a grid for better performance
      for (let x = 0; x < canvas.width; x += cellSize) {
        for (let y = 0; y < canvas.height; y += cellSize) {
          // Convert canvas coordinates to world coordinates
          const { worldX, worldZ } = getWorldCoordinates(x, y, canvas);
          
          // Get the actual biome at this location using BiomeGenerator
          const biome = biomeGenerator.getBiomeAt(worldX, worldZ);
          
          // Use Chunkbase-style colors
          ctx.fillStyle = chunkbaseColors[biome];
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    } else {
      // Draw the normal background if not showing biomes
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
    
    // Draw coordinate indicators (x and z axes)
    const originX = canvas.width / 2 + position.x;
    const originY = canvas.height / 2 + position.y;
    
    // Draw X and Z axis labels like in Chunkbase
    if (zoom > 0.3) {
      // Calculate visible range
      const { worldX: leftX } = getWorldCoordinates(0, 0, canvas);
      const { worldX: rightX } = getWorldCoordinates(canvas.width, 0, canvas);
      const { worldZ: topZ } = getWorldCoordinates(0, 0, canvas);
      const { worldZ: bottomZ } = getWorldCoordinates(0, canvas.height, canvas);
      
      // Round to multiples of 48 blocks (3 chunks)
      const stepSize = 48;
      const startX = Math.floor(leftX / stepSize) * stepSize;
      const endX = Math.ceil(rightX / stepSize) * stepSize;
      const startZ = Math.floor(topZ / stepSize) * stepSize;
      const endZ = Math.ceil(bottomZ / stepSize) * stepSize;
      
      // Draw X axis markers on top
      ctx.fillStyle = "#000000";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      
      for (let x = startX; x <= endX; x += stepSize) {
        const screenX = (x / 16) * zoom + canvas.width / 2 + position.x;
        if (screenX >= 0 && screenX <= canvas.width) {
          ctx.fillText(x.toString(), screenX, 15);
          
          // Draw tick mark
          ctx.beginPath();
          ctx.moveTo(screenX, 16);
          ctx.lineTo(screenX, 20);
          ctx.stroke();
        }
      }
      
      // Draw Z axis markers on left side
      ctx.textAlign = "right";
      for (let z = startZ; z <= endZ; z += stepSize) {
        const screenY = (z / 16) * zoom + canvas.height / 2 + position.y;
        if (screenY >= 0 && screenY <= canvas.height) {
          ctx.fillText(z.toString(), 20, screenY + 4);
          
          // Draw tick mark
          ctx.beginPath();
          ctx.moveTo(21, screenY);
          ctx.lineTo(25, screenY);
          ctx.stroke();
        }
      }
    }
    
    // Draw the origin point (less prominent now)
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.arc(originX, originY, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw the structures
    structures.forEach(structure => {
      // Only draw if there are no filters or if the type is in the filters
      if (filters.length === 0 || filters.includes(structure.type)) {
        const x = canvas.width / 2 + (structure.x * zoom) / 16 + position.x;
        const y = canvas.height / 2 + (structure.z * zoom) / 16 + position.y;
        
        // Draw the structure icon
        const isSelected = selectedStructure?.x === structure.x && selectedStructure?.z === structure.z;
        const iconSize = isSelected ? 10 : 6;
        
        // Draw circle with border for better visibility on various biomes
        ctx.fillStyle = getColorForType(structure.type);
        ctx.beginPath();
        ctx.arc(x, y, iconSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Add white border for better visibility
        ctx.strokeStyle = isSelected ? "#FF0000" : "#FFFFFF";
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.beginPath();
        ctx.arc(x, y, iconSize, 0, Math.PI * 2);
        ctx.stroke();
        
        // If selected, show the name with better styling
        if (isSelected) {
          // Draw info box similar to Chunkbase
          const structureName = structure.type.charAt(0).toUpperCase() + structure.type.slice(1);
          const infoText = `${structureName} (${structure.x}, ${structure.z})`;
          
          const padding = 8;
          const textWidth = ctx.measureText(infoText).width;
          const boxWidth = textWidth + padding * 2;
          const boxHeight = 24;
          
          // Information box with shadow
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.beginPath();
          ctx.roundRect(x - boxWidth / 2, y - boxHeight - 10, boxWidth, boxHeight, 4);
          ctx.fill();
          
          // Reset shadow
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          
          // Structure name and coordinates
          ctx.fillStyle = "#000000";
          ctx.font = "bold 12px Arial";
          ctx.textAlign = "center";
          ctx.fillText(infoText, x, y - boxHeight + 16);
        }
      }
    });
    
    // If biomes are showing, draw biome info at bottom
    if (showBiomes && canvasRef.current) {
      // Draw a chunkbase-style biome indicator at the mouse position or center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const { worldX, worldZ } = getWorldCoordinates(centerX, centerY, canvas);
      const biome = biomeGenerator.getBiomeAt(worldX, worldZ);
      const biomeName = biome.charAt(0).toUpperCase() + biome.slice(1).replace('_', ' ');
      
      // Draw info at bottom of canvas
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
      
      ctx.fillStyle = "#000000";
      ctx.font = "12px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`X: ${worldX}, Z: ${worldZ}`, 10, canvas.height - 10);
      
      ctx.textAlign = "right";
      ctx.fillText(`Biome: ${biomeName}`, canvas.width - 10, canvas.height - 10);
    }
    
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
