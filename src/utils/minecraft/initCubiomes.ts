
/**
 * initCubiomes.ts
 * Inicializa el módulo Cubiomes WebAssembly al cargar la aplicación
 */

import { initCubiomesWasm, isCubiomesWasmLoaded } from './CubiomesWebAssembly';

/**
 * Inicializa el módulo Cubiomes
 * Esta función debe llamarse al inicio de la aplicación
 */
export const initCubiomes = async (): Promise<void> => {
  try {
    console.log('Inicializando módulo Cubiomes...');
    await initCubiomesWasm();
    console.log('Módulo Cubiomes inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar el módulo Cubiomes:', error);
    throw new Error('No se pudo inicializar el módulo Cubiomes');
  }
};

// Exportar una función para verificar si el módulo está cargado
export const isCubiomesLoaded = (): boolean => {
  return isCubiomesWasmLoaded();
};
