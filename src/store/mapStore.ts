import { create } from 'zustand';
import { toast } from 'sonner';

export interface MinecraftStructure {
  type: string;
  x: number;
  z: number;
  biome: number;
  distanceFromSpawn: number;
}

interface MapState {
  // Estado del mapa
  position: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  startDragPosition: { x: number; y: number };
  selectedStructure: MinecraftStructure | null;
  showBiomes: boolean;
  
  // Acciones
  setPosition: (position: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  setIsDragging: (isDragging: boolean) => void;
  setStartDragPosition: (position: { x: number; y: number }) => void;
  setSelectedStructure: (structure: MinecraftStructure | null) => void;
  setShowBiomes: (show: boolean) => void;
  
  // Funciones de interacción
  handleCanvasClick: (e: React.MouseEvent, structures: MinecraftStructure[], filters: string[]) => void;
  handleWheel: (e: React.WheelEvent) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleCenter: () => void;
  toggleBiomes: () => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  // Estado inicial
  position: { x: 0, y: 0 },
  zoom: 1,
  isDragging: false,
  startDragPosition: { x: 0, y: 0 },
  selectedStructure: null,
  showBiomes: false,
  
  // Setters
  setPosition: (position) => set({ position }),
  setZoom: (zoom) => set({ zoom }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setStartDragPosition: (startDragPosition) => set({ startDragPosition }),
  setSelectedStructure: (selectedStructure) => set({ selectedStructure }),
  setShowBiomes: (showBiomes) => set({ showBiomes }),
  
  // Funciones de interacción
  handleCanvasClick: (e, structures, filters) => {
    const canvas = e.currentTarget as HTMLCanvasElement;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    
    const { position, zoom } = get();
    
    // Convertir coordenadas del canvas a coordenadas del mundo
    const worldX = ((canvasX - canvas.width/2 - position.x) * 16) / zoom;
    const worldZ = ((canvasY - canvas.height/2 - position.y) * 16) / zoom;
    
    // Encontrar la estructura más cercana dentro de un radio
    const clickRadius = 30 / zoom; // Radio de detección en bloques
    let closestStructure = null;
    let minDistance = clickRadius;
    let closestFilteredStructure = null;
    let minFilteredDistance = clickRadius;
    
    structures.forEach(structure => {
      const distance = Math.sqrt(
        Math.pow(structure.x - worldX, 2) + 
        Math.pow(structure.z - worldZ, 2)
      );
      
      // Verificar si la estructura está dentro del radio de detección
      if (distance < clickRadius) {
        // Comprobar si la estructura está filtrada
        const isFiltered = filters.length > 0 && !filters.includes(structure.type);
        
        if (!isFiltered && distance < minDistance) {
          // Priorizar estructuras no filtradas
          minDistance = distance;
          closestStructure = structure;
        } else if (isFiltered && distance < minFilteredDistance) {
          // Guardar la estructura filtrada más cercana como respaldo
          minFilteredDistance = distance;
          closestFilteredStructure = structure;
        }
      }
    });
    
    // Si no hay una estructura no filtrada cercana, usar la filtrada más cercana
    if (!closestStructure && closestFilteredStructure) {
      closestStructure = closestFilteredStructure;
    }
    
    if (closestStructure) {
      set({ selectedStructure: closestStructure });
      
      // Mostrar toast con información
      toast.info(`${closestStructure.type.charAt(0).toUpperCase() + closestStructure.type.slice(1)}`, {
        description: `Coords: ${closestStructure.x}, ${closestStructure.z} | Bioma: ${closestStructure.biome} | Distancia al spawn: ${Math.floor(closestStructure.distanceFromSpawn)} bloques`
      });
    } else {
      set({ selectedStructure: null });
    }
  },
  
  handleWheel: (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const { zoom } = get();
    const newZoom = Math.max(0.5, Math.min(2, zoom + delta));
    set({ zoom: newZoom });
  },
  
  handleMouseDown: (e) => {
    const canvas = e.currentTarget as HTMLCanvasElement;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    set({
      isDragging: true,
      startDragPosition: { x: startX, y: startY }
    });
  },
  
  handleMouseMove: (e) => {
    const { isDragging, startDragPosition, position } = get();
    
    if (!isDragging) return;
    
    const canvas = e.currentTarget as HTMLCanvasElement;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const deltaX = currentX - startDragPosition.x;
    const deltaY = currentY - startDragPosition.y;
    
    set({
      position: {
        x: position.x + deltaX,
        y: position.y + deltaY
      },
      startDragPosition: { x: currentX, y: currentY }
    });
  },
  
  handleMouseUp: () => {
    set({ isDragging: false });
  },
  
  handleCenter: () => {
    set({
      position: { x: 0, y: 0 },
      zoom: 1
    });
    
    toast.info("Mapa centrado", {
      description: "Vista restablecida a la posición inicial"
    });
  },
  
  toggleBiomes: () => {
    const { showBiomes } = get();
    set({ showBiomes: !showBiomes });
    
    toast.info(showBiomes ? "Biomas ocultos" : "Biomas mostrados", {
      description: showBiomes 
        ? "Mostrando vista de cuadrícula" 
        : "Mostrando vista de biomas"
    });
  }
}));
