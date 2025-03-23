
import React, { useEffect, useRef, useState } from "react";
import { MinecraftStructure } from "@/utils/minecraft/StructureGenerator";
import { useMapStore } from "@/store/mapStore";
import { getColorForType, getIconForType } from "./StructureIcon";

interface MapCanvasProps {
  structures?: MinecraftStructure[];
  filters?: string[];
  seed?: string;
}

// Tamaño de cada sección del grid para renderizado optimizado
const GRID_SECTION_SIZE = 256; // en bloques

const MapCanvas: React.FC<MapCanvasProps> = ({ structures = [], filters = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [visibleStructures, setVisibleStructures] = useState<MinecraftStructure[]>([]);
  const {
    position,
    zoom,
    isDragging,
    handleCanvasClick,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    showBiomes,
    selectedStructure
  } = useMapStore();
  
  // Función para determinar qué estructuras son visibles en el viewport actual
  const calculateVisibleStructures = () => {
    if (!canvasRef.current || structures.length === 0) return [];
    
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    
    // Calcular los límites del viewport en coordenadas del mundo
    const centerX = width / 2 + position.x;
    const centerY = height / 2 + position.y;
    
    // Convertir los límites del canvas a coordenadas del mundo (en bloques)
    const worldLeft = ((0 - centerX) * 16) / zoom;
    const worldTop = ((0 - centerY) * 16) / zoom;
    const worldRight = (((width) - centerX) * 16) / zoom;
    const worldBottom = (((height) - centerY) * 16) / zoom;
    
    // Añadir un margen para evitar pop-in durante el desplazamiento
    const margin = GRID_SECTION_SIZE;
    
    // Filtrar estructuras visibles (ahora incluimos todas las estructuras en el viewport,
    // independientemente del filtro, y añadimos una propiedad para indicar si está filtrada)
    const visible = structures.filter(structure => {
      // Comprobar si la estructura está dentro del viewport con margen
      return (
        structure.x >= worldLeft - margin &&
        structure.x <= worldRight + margin &&
        structure.z >= worldTop - margin &&
        structure.z <= worldBottom + margin
      );
    }).map(structure => ({
      ...structure,
      // Marcar si la estructura está filtrada (no está en los filtros activos)
      filtered: filters.length > 0 && !filters.includes(structure.type)
    }));
    
    return visible;
  };
  
  // Función para dibujar el mapa
  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    setIsRendering(true);
    
    // Usar requestAnimationFrame para no bloquear la UI
    requestAnimationFrame(() => {
      try {
        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar el fondo
        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar la cuadrícula de chunks
        drawChunkGrid(ctx, canvas.width, canvas.height);
        
        // Dibujar el punto de spawn (0,0)
        drawSpawnPoint(ctx, canvas.width, canvas.height);
        
        // Dibujar las estructuras visibles
        if (visibleStructures.length > 0) {
          drawStructures(ctx, canvas.width, canvas.height, visibleStructures);
        }
        
        // Dibujar indicador de coordenadas
        drawCoordinatesIndicator(ctx, canvas.width, canvas.height);
      } finally {
        setIsRendering(false);
      }
    });
  };
  
  // Función para dibujar la cuadrícula de chunks
  const drawChunkGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const chunkSize = 16 * zoom; // 16 bloques por chunk
    const centerX = width / 2 + position.x;
    const centerY = height / 2 + position.y;
    
    // Calcular los límites de la cuadrícula visible
    const startX = Math.floor((0 - centerX) / chunkSize) * chunkSize + centerX;
    const startY = Math.floor((0 - centerY) / chunkSize) * chunkSize + centerY;
    
    // Dibujar cuadrícula de chunks (líneas más claras)
    ctx.strokeStyle = "#e5e5e5";
    ctx.lineWidth = 0.5;
    
    // Dibujar líneas verticales
    for (let x = startX; x < width; x += chunkSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      
      // Añadir coordenada X cada 4 chunks si el zoom es suficiente
      if (zoom > 0.8 && Math.abs(x - centerX) % (chunkSize * 4) < 2) {
        const chunkX = Math.floor(((x - centerX) / zoom) / 16);
        ctx.fillStyle = "#999";
        ctx.font = `${10 * zoom}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(`${chunkX}`, x, centerY - 5);
      }
    }
    
    // Dibujar líneas horizontales
    for (let y = startY; y < height; y += chunkSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      // Añadir coordenada Z cada 4 chunks si el zoom es suficiente
      if (zoom > 0.8 && Math.abs(y - centerY) % (chunkSize * 4) < 2) {
        const chunkZ = Math.floor(((y - centerY) / zoom) / 16);
        ctx.fillStyle = "#999";
        ctx.font = `${10 * zoom}px Arial`;
        ctx.textAlign = "right";
        ctx.fillText(`${chunkZ}`, centerX - 5, y + 10);
      }
    }
    
    // Dibujar ejes principales con colores más destacados y mayor grosor
    // Eje X (Z=0)
    ctx.strokeStyle = "#3b82f6"; // Azul
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Eje Z (X=0)
    ctx.strokeStyle = "#ef4444"; // Rojo
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    
    // Añadir etiquetas a los ejes principales con fondo para mejor visibilidad
    ctx.font = `bold ${14 * zoom}px Arial`;
    
    // Etiqueta para eje X con fondo
    const xLabelText = "Eje X (Oeste → Este)";
    const xLabelWidth = ctx.measureText(xLabelText).width;
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(width - xLabelWidth - 15, centerY - 25, xLabelWidth + 10, 20 * zoom);
    
    ctx.fillStyle = "#3b82f6";
    ctx.textAlign = "right";
    ctx.fillText(xLabelText, width - 10, centerY - 10);
    
    // Etiqueta para eje Z con fondo
    const zLabelText = "Eje Z (Norte → Sur)";
    const zLabelWidth = ctx.measureText(zLabelText).width;
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(centerX + 5, 5, zLabelWidth + 10, 20 * zoom);
    
    ctx.fillStyle = "#ef4444";
    ctx.textAlign = "left";
    ctx.fillText(zLabelText, centerX + 10, 20);
    
    // Añadir marcadores de coordenadas en los ejes principales
    const markerInterval = 16 * 8 * zoom; // Cada 8 chunks
    
    // Marcadores en eje X
    for (let x = centerX + markerInterval; x < width; x += markerInterval) {
      const worldX = Math.floor(((x - centerX) / zoom) * 16);
      
      // Dibujar línea de marcador
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, centerY - 6);
      ctx.lineTo(x, centerY + 6);
      ctx.stroke();
      
      // Dibujar texto de coordenada con fondo
      const coordText = `${worldX}`;
      const textWidth = ctx.measureText(coordText).width;
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillRect(x - textWidth/2 - 3, centerY - 25, textWidth + 6, 15 * zoom);
      
      ctx.fillStyle = "#3b82f6";
      ctx.font = `bold ${11 * zoom}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(coordText, x, centerY - 10);
    }
    
    for (let x = centerX - markerInterval; x > 0; x -= markerInterval) {
      const worldX = Math.floor(((x - centerX) / zoom) * 16);
      
      // Dibujar línea de marcador
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, centerY - 6);
      ctx.lineTo(x, centerY + 6);
      ctx.stroke();
      
      // Dibujar texto de coordenada con fondo
      const coordText = `${worldX}`;
      const textWidth = ctx.measureText(coordText).width;
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillRect(x - textWidth/2 - 3, centerY - 25, textWidth + 6, 15 * zoom);
      
      ctx.fillStyle = "#3b82f6";
      ctx.font = `bold ${11 * zoom}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(coordText, x, centerY - 10);
    }
    
    // Marcadores en eje Z
    for (let y = centerY + markerInterval; y < height; y += markerInterval) {
      const worldZ = Math.floor(((y - centerY) / zoom) * 16);
      
      // Dibujar línea de marcador
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 6, y);
      ctx.lineTo(centerX + 6, y);
      ctx.stroke();
      
      // Dibujar texto de coordenada con fondo
      const coordText = `${worldZ}`;
      const textWidth = ctx.measureText(coordText).width;
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillRect(centerX + 10, y - 8, textWidth + 6, 15 * zoom);
      
      ctx.fillStyle = "#ef4444";
      ctx.font = `bold ${11 * zoom}px Arial`;
      ctx.textAlign = "left";
      ctx.fillText(coordText, centerX + 12, y + 4);
    }
    
    for (let y = centerY - markerInterval; y > 0; y -= markerInterval) {
      const worldZ = Math.floor(((y - centerY) / zoom) * 16);
      
      // Dibujar línea de marcador
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 6, y);
      ctx.lineTo(centerX + 6, y);
      ctx.stroke();
      
      // Dibujar texto de coordenada con fondo
      const coordText = `${worldZ}`;
      const textWidth = ctx.measureText(coordText).width;
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillRect(centerX + 10, y - 8, textWidth + 6, 15 * zoom);
      
      ctx.fillStyle = "#ef4444";
      ctx.font = `bold ${11 * zoom}px Arial`;
      ctx.textAlign = "left";
      ctx.fillText(coordText, centerX + 12, y + 4);
    }
    
    // Dibujar coordenadas de chunks principales (cada 16 chunks = región)
    if (zoom > 0.5) {
      const regionSize = 16 * 16 * zoom; // 16x16 chunks = 1 región
      ctx.font = `${10 * zoom}px Arial`;
      ctx.fillStyle = "#6b7280";
      ctx.textAlign = "left";
      
      for (let x = Math.floor(startX / regionSize) * regionSize; x < width; x += regionSize) {
        for (let y = Math.floor(startY / regionSize) * regionSize; y < height; y += regionSize) {
          const worldX = Math.floor(((x - centerX) / zoom) * 16 / 256);
          const worldZ = Math.floor(((y - centerY) / zoom) * 16 / 256);
          
          // Dibujar un rectángulo semitransparente para la región
          ctx.fillStyle = "rgba(229, 231, 235, 0.2)";
          ctx.fillRect(x, y, regionSize, regionSize);
          
          // Dibujar borde de región
          ctx.strokeStyle = "rgba(107, 114, 128, 0.3)";
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, regionSize, regionSize);
          
          // Dibujar etiqueta de región con fondo
          const regionText = `r.${worldX},${worldZ}`;
          const textWidth = ctx.measureText(regionText).width;
          
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.fillRect(x + 2, y + 2, textWidth + 6, 12 * zoom);
          
          ctx.fillStyle = "#6b7280";
          ctx.fillText(regionText, x + 5, y + 10 * zoom);
        }
      }
    }
    
    // Dibujar indicadores de escala en la esquina inferior derecha con diseño mejorado
    const scaleLength = 100 * zoom; // Longitud de la barra de escala en píxeles
    const blocksRepresented = Math.round((scaleLength / zoom) * 16); // Bloques representados
    
    // Posición de la barra de escala
    const scaleX = width - 140;
    const scaleY = height - 30;
    
    // Dibujar fondo semitransparente con borde redondeado
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.beginPath();
    ctx.roundRect(scaleX - 10, scaleY - 25, 140, 40, 5);
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Dibujar barra de escala con segmentos alternos
    const segmentSize = scaleLength / 5;
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#000" : "#fff";
      ctx.fillRect(scaleX + i * segmentSize, scaleY, segmentSize, 5);
      ctx.strokeRect(scaleX + i * segmentSize, scaleY, segmentSize, 5);
    }
    
    // Dibujar marcas en los extremos
    ctx.beginPath();
    ctx.moveTo(scaleX, scaleY - 5);
    ctx.lineTo(scaleX, scaleY + 10);
    ctx.moveTo(scaleX + scaleLength, scaleY - 5);
    ctx.lineTo(scaleX + scaleLength, scaleY + 10);
    ctx.stroke();
    
    // Dibujar texto de escala
    ctx.fillStyle = "#000";
    ctx.font = "bold 11px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${blocksRepresented} bloques`, scaleX + scaleLength/2, scaleY - 10);
    
    // Añadir información de zoom
    const pixelToBlockRatio = 16 / zoom;
    const zoomPercentage = Math.round(zoom * 100);
    ctx.font = "10px Arial";
    ctx.fillText(`Zoom: ${zoomPercentage}%, 1px = ${pixelToBlockRatio.toFixed(1)} bloques`, scaleX + scaleLength/2, scaleY + 20);
  };
  
  // Función para dibujar el punto de spawn
  const drawSpawnPoint = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2 + position.x;
    const centerY = height / 2 + position.y;
    
    // Dibujar círculo exterior para el spawn con efecto de resplandor
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, 20 * zoom
    );
    gradient.addColorStop(0, "rgba(255, 0, 0, 0.5)");
    gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20 * zoom, 0, Math.PI * 2);
    ctx.fill();
    
    // Dibujar círculo interior para el spawn
    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6 * zoom, 0, Math.PI * 2);
    ctx.fill();
    
    // Dibujar borde del círculo
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2 * zoom;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6 * zoom, 0, Math.PI * 2);
    ctx.stroke();
    
    // Dibujar líneas de referencia (cruz)
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 1.5 * zoom;
    
    // Línea horizontal
    ctx.beginPath();
    ctx.moveTo(centerX - 25 * zoom, centerY);
    ctx.lineTo(centerX + 25 * zoom, centerY);
    ctx.stroke();
    
    // Línea vertical
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 25 * zoom);
    ctx.lineTo(centerX, centerY + 25 * zoom);
    ctx.stroke();
    
    // Dibujar texto "SPAWN (0,0)" con fondo para mejor visibilidad
    const spawnText = "SPAWN (0,0)";
    ctx.font = `bold ${12 * zoom}px Arial`;
    const textWidth = ctx.measureText(spawnText).width;
    
    // Fondo del texto con borde redondeado
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.roundRect(centerX - textWidth/2 - 5, centerY - 32 * zoom, textWidth + 10, 16 * zoom, 4);
    ctx.fill();
    
    // Borde del fondo
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 1 * zoom;
    ctx.stroke();
    
    // Dibujar el texto sobre el fondo
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText(spawnText, centerX, centerY - 20 * zoom);
    
    // Añadir coordenadas exactas debajo del spawn
    const coordText = "X: 0, Z: 0";
    ctx.font = `${10 * zoom}px Arial`;
    const coordWidth = ctx.measureText(coordText).width;
    
    // Fondo para las coordenadas
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.roundRect(centerX - coordWidth/2 - 5, centerY + 15 * zoom, coordWidth + 10, 14 * zoom, 4);
    ctx.fill();
    
    // Borde del fondo
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 0.5 * zoom;
    ctx.stroke();
    
    // Dibujar texto de coordenadas
    ctx.fillStyle = "#000000";
    ctx.fillText(coordText, centerX, centerY + 25 * zoom);
  };
  
  // Función para dibujar las estructuras
  const drawStructures = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    structures: MinecraftStructure[]
  ) => {
    const centerX = width / 2 + position.x;
    const centerY = height / 2 + position.y;
    
    // Dibujar cada estructura
    structures.forEach(structure => {
      // Convertir coordenadas del mundo a coordenadas del canvas
      const canvasX = centerX + (structure.x / 16) * zoom;
      const canvasY = centerY + (structure.z / 16) * zoom;
      
      // Verificar si está dentro del canvas con un pequeño margen
      if (canvasX < -20 || canvasX > width + 20 || canvasY < -20 || canvasY > height + 20) {
        return; // No dibujar si está fuera del canvas
      }
      
      // Determinar si es la estructura seleccionada
      const isSelected = selectedStructure && 
        selectedStructure.x === structure.x && 
        selectedStructure.z === structure.z &&
        selectedStructure.type === structure.type;
      
      // Verificar si la estructura está filtrada
      const isFiltered = (structure as any).filtered;
      
      // Tamaño base y tamaño para estructura seleccionada
      const baseSize = 8 * zoom;
      const selectedSize = 12 * zoom;
      const currentSize = isSelected ? selectedSize : baseSize;
      
      // Establecer opacidad según si está filtrada o no
      ctx.globalAlpha = isFiltered ? 0.3 : 1.0;
      
      // Dibujar círculo de fondo con efecto de resplandor para estructuras seleccionadas
      if (isSelected) {
        // Crear un gradiente para el efecto de resplandor
        const gradient = ctx.createRadialGradient(
          canvasX, canvasY, 0,
          canvasX, canvasY, currentSize * 1.5
        );
        gradient.addColorStop(0, getColorForType(structure.type));
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, currentSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Dibujar círculo principal de la estructura
      ctx.fillStyle = getColorForType(structure.type);
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, currentSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Si está seleccionada, dibujar un borde
      if (isSelected) {
        // Borde exterior
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2 * zoom;
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, currentSize, 0, Math.PI * 2);
        ctx.stroke();
        
        // Borde interior
        ctx.strokeStyle = getColorForType(structure.type);
        ctx.lineWidth = 1 * zoom;
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, currentSize * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        
        // Mostrar información de coordenadas para la estructura seleccionada
        const infoText = `${structure.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`;
        const coordText = `X: ${structure.x}, Z: ${structure.z}`;
        const biomeText = structure.biome.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        // Calcular dimensiones del cuadro de información
        ctx.font = `bold ${11 * zoom}px Arial`;
        const infoWidth = ctx.measureText(infoText).width;
        ctx.font = `${10 * zoom}px Arial`;
        const coordWidth = ctx.measureText(coordText).width;
        const biomeWidth = ctx.measureText(biomeText).width;
        const maxWidth = Math.max(infoWidth, coordWidth, biomeWidth) + 20 * zoom;
        
        // Posición del cuadro de información (ajustada para evitar salirse del canvas)
        let boxX = canvasX + currentSize + 5 * zoom;
        let boxY = canvasY - 30 * zoom;
        
        // Ajustar si se sale por la derecha
        if (boxX + maxWidth > width) {
          boxX = canvasX - maxWidth - currentSize - 5 * zoom;
        }
        
        // Ajustar si se sale por arriba
        if (boxY < 10) {
          boxY = 10;
        }
        
        // Dibujar fondo del cuadro de información
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, maxWidth, 65 * zoom, 5);
        ctx.fill();
        
        // Borde del cuadro
        ctx.strokeStyle = getColorForType(structure.type);
        ctx.lineWidth = 1.5 * zoom;
        ctx.stroke();
        
        // Dibujar textos
        ctx.textAlign = "left";
        
        // Nombre de la estructura
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${11 * zoom}px Arial`;
        ctx.fillText(infoText, boxX + 10 * zoom, boxY + 15 * zoom);
        
        // Coordenadas
        ctx.font = `${10 * zoom}px Arial`;
        ctx.fillText(coordText, boxX + 10 * zoom, boxY + 30 * zoom);
        
        // Bioma
        ctx.fillText(biomeText, boxX + 10 * zoom, boxY + 45 * zoom);
        
        // Distancia al spawn
        ctx.fillText(`Distancia: ${Math.floor(structure.distanceFromSpawn)} bloques`, boxX + 10 * zoom, boxY + 60 * zoom);
      }
      
      // Restaurar opacidad predeterminada
      ctx.globalAlpha = 1.0;
    });
  };
  
  // Función para dibujar el indicador de coordenadas
  const drawCoordinatesIndicator = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2 + position.x;
    const centerY = height / 2 + position.y;
    
    // Calcular coordenadas del centro de la pantalla en bloques
    const worldX = Math.floor(((width/2 - centerX) / zoom) * 16);
    const worldZ = Math.floor(((height/2 - centerY) / zoom) * 16);
    
    // Calcular coordenadas en chunks
    const chunkX = Math.floor(worldX / 16);
    const chunkZ = Math.floor(worldZ / 16);
    
    // Calcular región
    const regionX = Math.floor(chunkX / 32);
    const regionZ = Math.floor(chunkZ / 32);
    
    // Calcular la escala actual (1px = N bloques)
    const pixelToBlockRatio = 16 / zoom;
    const zoomPercentage = Math.round(zoom * 100);
    
    // Crear panel de información con diseño mejorado
    const panelWidth = 240;
    const panelHeight = 120;
    const panelX = 10;
    const panelY = height - panelHeight - 10;
    
    // Dibujar fondo del panel con borde redondeado
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 8);
    ctx.fill();
    
    // Borde del panel
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Dibujar título del panel
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Información de Coordenadas", panelX + 12, panelY + 22);
    
    // Dibujar línea separadora
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.moveTo(panelX + 12, panelY + 30);
    ctx.lineTo(panelX + panelWidth - 12, panelY + 30);
    ctx.stroke();
    
    // Dibujar información de coordenadas con iconos
    ctx.font = "12px Arial";
    
    // Coordenadas en bloques
    ctx.fillStyle = "#3b82f6"; // Azul para X
    ctx.fillText("X:", panelX + 15, panelY + 50);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${worldX}`, panelX + 35, panelY + 50);
    
    ctx.fillStyle = "#ef4444"; // Rojo para Z
    ctx.fillText("Z:", panelX + 120, panelY + 50);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${worldZ}`, panelX + 140, panelY + 50);
    
    // Etiqueta de bloques
    ctx.fillStyle = "#9ca3af";
    ctx.font = "10px Arial";
    ctx.fillText("(bloques)", panelX + 180, panelY + 50);
    
    // Coordenadas en chunks
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Arial";
    ctx.fillText(`Chunks: X: ${chunkX}, Z: ${chunkZ}`, panelX + 15, panelY + 70);
    
    // Coordenadas de región
    ctx.fillText(`Región: r.${regionX}.${regionZ}.mca`, panelX + 15, panelY + 90);
    
    // Dibujar información de escala con diseño mejorado
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.moveTo(panelX + 12, panelY + 98);
    ctx.lineTo(panelX + panelWidth - 12, panelY + 98);
    ctx.stroke();
    
    // Información de zoom y escala
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px Arial";
    ctx.fillText(`Zoom: ${zoomPercentage}%`, panelX + 15, panelY + 115);
    
    // Escala en píxeles a bloques
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Arial";
    ctx.fillText(`1px = ${pixelToBlockRatio.toFixed(1)} bloques`, panelX + 120, panelY + 115);
  };
  
  // Efecto para calcular las estructuras visibles cuando cambian las dependencias
  useEffect(() => {
    const visible = calculateVisibleStructures();
    setVisibleStructures(visible);
  }, [position, zoom, structures, filters]);
  
  // Efecto para redibujar el mapa cuando cambian las estructuras visibles
  useEffect(() => {
    if (!isRendering) {
      drawMap();
    }
  }, [visibleStructures, position, zoom, showBiomes, selectedStructure]);
  
  // Efecto para ajustar el tamaño del canvas cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
          drawMap();
        }
      }
    };
    
    // Establecer tamaño inicial
    handleResize();
    
    // Añadir listener para cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onClick={(e) => handleCanvasClick(e, structures, filters)}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      {isRendering && (
        <div className="absolute bottom-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded text-xs">
          Renderizando...
        </div>
      )}
    </>
  );
};

export default MapCanvas;
