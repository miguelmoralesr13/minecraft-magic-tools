
// Este archivo ha sido reemplazado por el store de Zustand en /src/store/mapStore.ts
// Se mantiene temporalmente para compatibilidad con versiones anteriores

import { useMapStore } from "@/store/mapStore";
import { useState, useCallback } from "react";
import { MinecraftStructure } from "@/utils/minecraft/StructureGenerator";
import { toast } from "sonner";

export const useMapInteraction = (structures: MinecraftStructure[], filters: string[]) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedStructure, setSelectedStructure] = useState<MinecraftStructure | null>(null);
  const [showBiomes, setShowBiomes] = useState(false);
  
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    const canvas = e.currentTarget as HTMLCanvasElement;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    
    // Convert canvas coordinates to world coordinates
    const worldX = ((canvasX - canvas.width/2 - position.x) * 16) / zoom;
    const worldZ = ((canvasY - canvas.height/2 - position.y) * 16) / zoom;
    
    // Find the closest structure within a radius
    const clickRadius = 30 / zoom; // Detection radius in blocks
    let closestStructure = null;
    let minDistance = clickRadius;
    
    structures.forEach(structure => {
      // Only consider if there are no filters or if the type is in the filters
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
      
      // Show toast with information
      toast.info(`${closestStructure.type.charAt(0).toUpperCase() + closestStructure.type.slice(1)}`, {
        description: `Coords: ${closestStructure.x}, ${closestStructure.z} | Bioma: ${closestStructure.biome} | Distancia al spawn: ${Math.floor(closestStructure.distanceFromSpawn)} bloques`
      });
    } else {
      setSelectedStructure(null);
    }
  }, [structures, filters, position, zoom]);

  // Handle zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.5, Math.min(2, zoom + delta));
    setZoom(newZoom);
  }, [zoom]);

  // Handle drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartDragPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startDragPosition.x,
        y: e.clientY - startDragPosition.y
      });
    }
  }, [isDragging, startDragPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Center the map
  const handleCenter = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setZoom(1);
    toast.info("Mapa centrado", {
      description: "Posición y zoom restablecidos"
    });
  }, []);

  // Toggle biome display
  const toggleBiomes = useCallback(() => {
    setShowBiomes(prev => !prev);
    toast.info(showBiomes ? "Biomas ocultos" : "Biomas mostrados", {
      description: showBiomes ? "Mostrando vista de cuadrícula" : "Mostrando mapa de biomas"
    });
  }, [showBiomes]);

  return {
    scale,
    position,
    isDragging,
    zoom,
    selectedStructure,
    showBiomes,
    handleCanvasClick,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCenter,
    toggleBiomes
  };
};
