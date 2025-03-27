
/**
 * CubiomesWebAssembly.ts
 * Inicialización y gestión del módulo WebAssembly para Cubiomes
 */

let cubiomesWasmModule: any = null;
let isModuleLoaded = false;
let loadPromise: Promise<any> | null = null;

// Función para inicializar el módulo WebAssembly
export const initCubiomesWasm = async (): Promise<any> => {
  if (isModuleLoaded) {
    return cubiomesWasmModule;
  }
  
  if (loadPromise) {
    return loadPromise;
  }
  
  loadPromise = new Promise(async (resolve, reject) => {
    try {
      // Importar el módulo dinámicamente
      const CubiomesModule = await import('../../wasm/cubiomes/build/cubiomes.js');
      
      // Inicializar el módulo
      cubiomesWasmModule = await CubiomesModule.default();
      isModuleLoaded = true;
      
      console.log('Módulo Cubiomes WebAssembly cargado correctamente');
      resolve(cubiomesWasmModule);
    } catch (error) {
      console.error('Error al cargar el módulo Cubiomes WebAssembly:', error);
      reject(error);
    }
  });
  
  return loadPromise;
};

// Función para verificar si el módulo está cargado
export const isCubiomesWasmLoaded = (): boolean => {
  return isModuleLoaded;
};

// Función para obtener el módulo (si ya está cargado)
export const getCubiomesWasmModule = (): any => {
  if (!isModuleLoaded) {
    throw new Error('El módulo Cubiomes WebAssembly no está cargado. Llama a initCubiomesWasm primero.');
  }
  return cubiomesWasmModule;
};
