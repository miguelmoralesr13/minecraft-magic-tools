# Cubiomes WebAssembly Integration

Este directorio contiene los archivos fuente de Cubiomes compilados a WebAssembly para la generación de biomas y estructuras de Minecraft.

## Estructura

- `src/`: Código fuente de Cubiomes
- `build/`: Archivos compilados (.wasm y .js)
- `scripts/`: Scripts de compilación

## Compilación

Para compilar el proyecto, necesitas tener instalado Emscripten. Luego, ejecuta:

```bash
npm run build:wasm
```

Esto generará los archivos necesarios en la carpeta `build/`.