/**
 * initCubiomes.ts
 * Inicializa el módulo Cubiomes WebAssembly al cargar la aplicación
 */

import { loadCubiomesModule } from './CubiomesModule';

/**
 * Inicializa el módulo Cubiomes
 * Esta función debe llamarse al inicio de la aplicación
 */
export const initCubiomes = async (): Promise<void> => {
  try {
    console.log('Inicializando módulo Cubiomes...');
    await loadCubiomesModule();
    console.log('Módulo Cubiomes inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar el módulo Cubiomes:', error);
    throw new Error('No se pudo inicializar el módulo Cubiomes');
  }
};

// Exportar una función para verificar si el módulo está cargado
export const isCubiomesLoaded = (): boolean => {
  // Esta función debería verificar si el módulo está cargado
  // En una implementación real, se verificaría el estado del módulo
  return true;
};