/**
 * mapUtils.ts
 * Utilidades para el mapa de Minecraft
 */

import { MinecraftStructure } from './StructureGenerator';

/**
 * Calcula los límites del área visible en el mapa
 * @param position Posición actual del mapa
 * @param zoom Nivel de zoom actual
 * @param width Ancho del canvas
 * @param height Alto del canvas
 * @returns Límites del área visible (minX, minZ, maxX, maxZ)
 */
export const calculateViewBounds = (
  position: { x: number; y: number },
  zoom: number,
  width: number,
  height: number
): { minX: number; minZ: number; maxX: number; maxZ: number } => {
  // Calcular el centro del mapa en coordenadas del mundo
  const centerX = -position.x * 16 / zoom;
  const centerZ = -position.y * 16 / zoom;
  
  // Calcular los límites del área visible
  const halfWidthBlocks = (width / 2) * 16 / zoom;
  const halfHeightBlocks = (height / 2) * 16 / zoom;
  
  return {
    minX: Math.floor(centerX - halfWidthBlocks),
    minZ: Math.floor(centerZ - halfHeightBlocks),
    maxX: Math.ceil(centerX + halfWidthBlocks),
    maxZ: Math.ceil(centerZ + halfHeightBlocks)
  };
};

/**
 * Filtra las estructuras visibles dentro de los límites del mapa
 * @param structures Lista de estructuras
 * @param bounds Límites del área visible
 * @returns Lista de estructuras visibles
 */
export const filterVisibleStructures = (
  structures: MinecraftStructure[],
  bounds: { minX: number; minZ: number; maxX: number; maxZ: number }
): MinecraftStructure[] => {
  return structures.filter(structure => 
    structure.x >= bounds.minX &&
    structure.x <= bounds.maxX &&
    structure.z >= bounds.minZ &&
    structure.z <= bounds.maxZ
  );
};

/**
 * Calcula la posición de una estructura en el canvas
 * @param structure Estructura de Minecraft
 * @param zoom Nivel de zoom actual
 * @param position Posición actual del mapa
 * @returns Coordenadas x, y en el canvas
 */
export const calculateStructurePosition = (
  structure: MinecraftStructure,
  zoom: number,
  position: { x: number; y: number }
): { x: number; y: number } => {
  // Convertir coordenadas del mundo a coordenadas del canvas
  const x = (structure.x * zoom) / 16 + position.x;
  const y = (structure.z * zoom) / 16 + position.y;
  
  return { x, y };
};

/**
 * Convierte coordenadas del canvas a coordenadas del mundo
 * @param canvasX Coordenada X en el canvas
 * @param canvasY Coordenada Y en el canvas
 * @param canvasWidth Ancho del canvas
 * @param canvasHeight Alto del canvas
 * @param position Posición actual del mapa
 * @param zoom Nivel de zoom actual
 * @returns Coordenadas x, z en el mundo
 */
export const canvasToWorldCoordinates = (
  canvasX: number,
  canvasY: number,
  canvasWidth: number,
  canvasHeight: number,
  position: { x: number; y: number },
  zoom: number
): { x: number; z: number } => {
  // Calcular las coordenadas relativas al centro del canvas
  const relativeX = canvasX - canvasWidth / 2;
  const relativeY = canvasY - canvasHeight / 2;
  
  // Convertir a coordenadas del mundo
  const worldX = Math.floor(((relativeX - position.x) * 16) / zoom);
  const worldZ = Math.floor(((relativeY - position.y) * 16) / zoom);
  
  return { x: worldX, z: worldZ };
};

/**
 * Calcula la distancia entre dos puntos en el mundo
 * @param x1 Coordenada X del primer punto
 * @param z1 Coordenada Z del primer punto
 * @param x2 Coordenada X del segundo punto
 * @param z2 Coordenada Z del segundo punto
 * @returns Distancia en bloques
 */
export const calculateDistance = (
  x1: number,
  z1: number,
  x2: number,
  z2: number
): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
};

/**
 * Formatea coordenadas para mostrar
 * @param x Coordenada X
 * @param z Coordenada Z
 * @returns Cadena formateada
 */
export const formatCoordinates = (x: number, z: number): string => {
  return `X: ${x.toLocaleString()}, Z: ${z.toLocaleString()}`;
};