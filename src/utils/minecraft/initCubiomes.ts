
/**
 * initCubiomes.ts
 * Función para inicializar el módulo Cubiomes WebAssembly
 */

import { initCubiomesWasm } from './CubiomesWebAssembly';

// Función para inicializar el módulo Cubiomes WebAssembly
export const initCubiomes = async (): Promise<void> => {
  try {
    // Inicializar el módulo
    await initCubiomesWasm();
    console.log('Módulo Cubiomes inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar Cubiomes:', error);
    throw new Error('No se pudo inicializar el módulo Cubiomes WebAssembly');
  }
};

// Función para obtener el bioma en una posición
export const getBiomeAt = async (seed: string, x: number, z: number, version: string = "java"): Promise<number> => {
  // Inicializar el módulo si no está cargado
  const cubiomesModule = await initCubiomesWasm();
  
  try {
    // Convertir los parámetros a punteros para WebAssembly
    const seedPtr = cubiomesModule._malloc(seed.length + 1);
    const versionPtr = cubiomesModule._malloc(version.length + 1);
    
    // Copiar las cadenas a la memoria
    for (let i = 0; i < seed.length; i++) {
      cubiomesModule.HEAPU8[seedPtr + i] = seed.charCodeAt(i);
    }
    cubiomesModule.HEAPU8[seedPtr + seed.length] = 0;
    
    for (let i = 0; i < version.length; i++) {
      cubiomesModule.HEAPU8[versionPtr + i] = version.charCodeAt(i);
    }
    cubiomesModule.HEAPU8[versionPtr + version.length] = 0;
    
    // Llamar a la función de WebAssembly
    const biome = cubiomesModule.ccall(
      'getBiomeAt',
      'number',
      ['number', 'number', 'number', 'number'],
      [seedPtr, x, z, versionPtr]
    );
    
    // Liberar memoria
    cubiomesModule._free(seedPtr);
    cubiomesModule._free(versionPtr);
    
    return biome;
  } catch (error) {
    console.error('Error al obtener el bioma:', error);
    return 0; // Bioma desconocido
  }
};

// Función para encontrar estructuras cercanas
export const findStructures = async (
  seed: string,
  structureType: string,
  centerX: number = 0,
  centerZ: number = 0,
  radius: number = 2000,
  version: string = "java"
): Promise<any[]> => {
  // Inicializar el módulo si no está cargado
  const cubiomesModule = await initCubiomesWasm();
  
  try {
    // Convertir los parámetros a punteros para WebAssembly
    const seedPtr = cubiomesModule._malloc(seed.length + 1);
    const typePtr = cubiomesModule._malloc(structureType.length + 1);
    const versionPtr = cubiomesModule._malloc(version.length + 1);
    
    // Copiar las cadenas a la memoria
    for (let i = 0; i < seed.length; i++) {
      cubiomesModule.HEAPU8[seedPtr + i] = seed.charCodeAt(i);
    }
    cubiomesModule.HEAPU8[seedPtr + seed.length] = 0;
    
    for (let i = 0; i < structureType.length; i++) {
      cubiomesModule.HEAPU8[typePtr + i] = structureType.charCodeAt(i);
    }
    cubiomesModule.HEAPU8[typePtr + structureType.length] = 0;
    
    for (let i = 0; i < version.length; i++) {
      cubiomesModule.HEAPU8[versionPtr + i] = version.charCodeAt(i);
    }
    cubiomesModule.HEAPU8[versionPtr + version.length] = 0;
    
    // Reservar memoria para los resultados
    const maxStructures = 100;
    const resultPtr = cubiomesModule._malloc(maxStructures * 20); // 5 enteros de 4 bytes
    
    // Llamar a la función de WebAssembly
    const count = cubiomesModule.ccall(
      'getStructuresNear',
      'number',
      ['number', 'number', 'number', 'number', 'number', 'number', 'number'],
      [seedPtr, centerX, centerZ, typePtr, radius, versionPtr, resultPtr]
    );
    
    // Leer los resultados
    const structures = [];
    for (let i = 0; i < count; i++) {
      const offset = resultPtr + i * 20; // 5 enteros de 4 bytes
      
      // Leer los valores
      const type = cubiomesModule.HEAP32[offset / 4];
      const x = cubiomesModule.HEAP32[(offset + 4) / 4];
      const z = cubiomesModule.HEAP32[(offset + 8) / 4];
      const biome = cubiomesModule.HEAP32[(offset + 12) / 4];
      const distance = cubiomesModule.HEAP32[(offset + 16) / 4];
      
      // Mapear el tipo numérico a una cadena
      const typeNames = [
        'village', 'temple', 'stronghold', 'monument', 'mansion',
        'mineshaft', 'fortress', 'spawner', 'outpost', 'ruined_portal'
      ];
      
      structures.push({
        type: typeNames[type] || 'unknown',
        x,
        z,
        biome,
        distanceFromSpawn: distance,
        version
      });
    }
    
    // Liberar memoria
    cubiomesModule._free(seedPtr);
    cubiomesModule._free(typePtr);
    cubiomesModule._free(versionPtr);
    cubiomesModule._free(resultPtr);
    
    return structures;
  } catch (error) {
    console.error('Error al buscar estructuras:', error);
    return [];
  }
};
