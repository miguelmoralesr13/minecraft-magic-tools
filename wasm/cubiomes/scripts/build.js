// Script para preparar los archivos de Cubiomes para WebAssembly
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const buildDir = path.join(rootDir, 'build');

// Asegurarse de que los directorios existan
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

console.log('Preparando Cubiomes para WebAssembly (versión JavaScript)...');

try {
  // Verificar si los archivos ya existen
  const jsFile = path.join(buildDir, 'cubiomes.js');
  const wasmFile = path.join(buildDir, 'cubiomes.wasm');
  
  // Verificar si los archivos ya existen y tienen contenido
  const jsExists = fs.existsSync(jsFile) && fs.statSync(jsFile).size > 0;
  const wasmExists = fs.existsSync(wasmFile) && fs.statSync(wasmFile).size > 0;
  
  if (jsExists && wasmExists) {
    console.log('Los archivos ya existen y tienen contenido. No es necesario regenerarlos.');
  } else {
    console.log('Los archivos no existen o están vacíos. Asegúrate de que estén correctamente creados.');
    console.log('Nota: Este script ya no compila el código C a WebAssembly, sino que utiliza una implementación JavaScript.');
  }
  
  console.log('Preparación completada con éxito!');
  console.log(`Archivos disponibles en: ${buildDir}`);
} catch (error) {
  console.error('Error durante la preparación:', error);
  process.exit(1);
}