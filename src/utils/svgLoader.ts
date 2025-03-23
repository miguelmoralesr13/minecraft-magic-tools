/**
 * Utility for loading SVG icons as Image objects for canvas rendering
 */

import { StructureType } from "./minecraft/StructureGenerator";

// Cache for loaded SVG images
const svgCache: Record<string, HTMLImageElement> = {};

/**
 * Loads an SVG file as an Image object
 * @param path Path to the SVG file
 * @returns Promise that resolves to an HTMLImageElement
 */
export const loadSvg = (path: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    // Check if already in cache
    if (svgCache[path]) {
      resolve(svgCache[path]);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      svgCache[path] = img;
      resolve(img);
    };
    img.onerror = (err) => reject(err);
    img.src = path;
  });
};

/**
 * Gets the SVG icon path for a structure type
 * @param type Structure type
 * @returns Path to the SVG icon
 */
export const getSvgPathForType = (type: StructureType): string => {
  return `/icons/${type}.svg`;
};

/**
 * Preloads all structure SVG icons
 * @returns Promise that resolves when all icons are loaded
 */
export const preloadStructureIcons = async (): Promise<void> => {
  const structureTypes: StructureType[] = [
    'village',
    'temple',
    'stronghold',
    'monument',
    'mansion',
    'mineshaft',
    'fortress',
    'spawner',
    'outpost',
    'ruined_portal'
  ];
  
  await Promise.all(structureTypes.map(type => {
    return loadSvg(getSvgPathForType(type)).catch(err => {
      console.error(`Failed to load icon for ${type}:`, err);
      return null;
    });
  }));
};