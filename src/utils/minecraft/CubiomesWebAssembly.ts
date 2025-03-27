
/**
 * CubiomesWebAssembly.ts
 * Inicialización y gestión del módulo WebAssembly de Cubiomes
 */

// Variable para almacenar la instancia del módulo una vez cargado
let cubiomesModuleInstance: any = null;

// Función para inicializar el módulo WebAssembly de Cubiomes
export const initCubiomesWasm = async (): Promise<any> => {
  // Si ya está inicializado, devolver la instancia
  if (cubiomesModuleInstance) {
    return cubiomesModuleInstance;
  }
  
  try {
    // En un entorno real, cargaríamos el módulo WebAssembly compilado
    // Pero para este proyecto, utilizaremos la versión mock
    const CubiomesModule = (await import('../../../wasm/cubiomes/build/cubiomes.js')).default;
    
    // Inicializar el módulo
    cubiomesModuleInstance = await CubiomesModule();
    console.log('Módulo Cubiomes WebAssembly inicializado correctamente');
    
    return cubiomesModuleInstance;
  } catch (error) {
    console.error('Error al inicializar el módulo Cubiomes WebAssembly:', error);
    throw new Error('No se pudo inicializar el módulo Cubiomes');
  }
};

// Función para liberar recursos del módulo
export const cleanupCubiomesWasm = (): void => {
  if (cubiomesModuleInstance) {
    // Limpiar recursos si es necesario
    cubiomesModuleInstance = null;
  }
};
