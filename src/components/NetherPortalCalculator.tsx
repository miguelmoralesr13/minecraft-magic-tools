
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Flame, Calculator, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const NetherPortalCalculator: React.FC = () => {
  const [overworldX, setOverworldX] = useState<string>("");
  const [overworldZ, setOverworldZ] = useState<string>("");
  const [netherX, setNetherX] = useState<string>("");
  const [netherZ, setNetherZ] = useState<string>("");
  const [calculationDirection, setCalculationDirection] = useState<"overworld_to_nether" | "nether_to_overworld">("overworld_to_nether");

  // Calculate Nether coordinates from Overworld coordinates
  const calculateNetherCoords = () => {
    if (!overworldX || !overworldZ) {
      toast.error("Ingresa las coordenadas del Overworld");
      return;
    }

    const xNum = parseFloat(overworldX);
    const zNum = parseFloat(overworldZ);

    if (isNaN(xNum) || isNaN(zNum)) {
      toast.error("Las coordenadas deben ser números válidos");
      return;
    }

    // In Minecraft, Nether coordinates are Overworld / 8
    const netherXCoord = (xNum / 8).toFixed(1);
    const netherZCoord = (zNum / 8).toFixed(1);

    setNetherX(netherXCoord);
    setNetherZ(netherZCoord);

    toast.success("Coordenadas calculadas correctamente", {
      description: `Overworld (${xNum}, ${zNum}) → Nether (${netherXCoord}, ${netherZCoord})`
    });
  };

  // Calculate Overworld coordinates from Nether coordinates
  const calculateOverworldCoords = () => {
    if (!netherX || !netherZ) {
      toast.error("Ingresa las coordenadas del Nether");
      return;
    }

    const xNum = parseFloat(netherX);
    const zNum = parseFloat(netherZ);

    if (isNaN(xNum) || isNaN(zNum)) {
      toast.error("Las coordenadas deben ser números válidos");
      return;
    }

    // In Minecraft, Overworld coordinates are Nether * 8
    const overworldXCoord = (xNum * 8).toFixed(1);
    const overworldZCoord = (zNum * 8).toFixed(1);

    setOverworldX(overworldXCoord);
    setOverworldZ(overworldZCoord);

    toast.success("Coordenadas calculadas correctamente", {
      description: `Nether (${xNum}, ${zNum}) → Overworld (${overworldXCoord}, ${overworldZCoord})`
    });
  };

  // Reset all input fields
  const handleReset = () => {
    setOverworldX("");
    setOverworldZ("");
    setNetherX("");
    setNetherZ("");
    toast.info("Valores restablecidos");
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-8"
      >
        <h2 className="text-3xl font-bold text-center mb-2">Calculadora de Portales</h2>
        <p className="text-muted-foreground text-center">
          Convierte coordenadas entre el Overworld y el Nether en Minecraft
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overworld to Nether */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 h-full overflow-hidden relative bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-900">
            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-green-200/50 dark:bg-green-900/30 blur-2xl" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50">
                <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold">Overworld → Nether</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="overworld-x" className="text-sm font-medium">
                    Coordenada X
                  </label>
                  <Input
                    id="overworld-x"
                    placeholder="X en Overworld"
                    value={overworldX}
                    onChange={(e) => setOverworldX(e.target.value)}
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="overworld-z" className="text-sm font-medium">
                    Coordenada Z
                  </label>
                  <Input
                    id="overworld-z"
                    placeholder="Z en Overworld"
                    value={overworldZ}
                    onChange={(e) => setOverworldZ(e.target.value)}
                    type="number"
                  />
                </div>
              </div>

              <Button
                onClick={calculateNetherCoords}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Calculator className="mr-2 h-4 w-4" /> Calcular Coordenadas del Nether
              </Button>

              {netherX && netherZ && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border rounded-md bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                >
                  <p className="text-sm font-medium mb-1">Coordenadas en el Nether:</p>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-lg">
                      X: {netherX}, Z: {netherZ}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`X: ${netherX}, Z: ${netherZ}`);
                        toast.success("Coordenadas copiadas al portapapeles");
                      }}
                    >
                      Copiar
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Nether to Overworld */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6 h-full overflow-hidden relative bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-900">
            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-orange-200/50 dark:bg-orange-900/30 blur-2xl" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/50">
                <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold">Nether → Overworld</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nether-x" className="text-sm font-medium">
                    Coordenada X
                  </label>
                  <Input
                    id="nether-x"
                    placeholder="X en Nether"
                    value={netherX}
                    onChange={(e) => setNetherX(e.target.value)}
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="nether-z" className="text-sm font-medium">
                    Coordenada Z
                  </label>
                  <Input
                    id="nether-z"
                    placeholder="Z en Nether"
                    value={netherZ}
                    onChange={(e) => setNetherZ(e.target.value)}
                    type="number"
                  />
                </div>
              </div>

              <Button
                onClick={calculateOverworldCoords}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Calculator className="mr-2 h-4 w-4" /> Calcular Coordenadas del Overworld
              </Button>

              {overworldX && overworldZ && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border rounded-md bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                >
                  <p className="text-sm font-medium mb-1">Coordenadas en el Overworld:</p>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-lg">
                      X: {overworldX}, Z: {overworldZ}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`X: ${overworldX}, Z: ${overworldZ}`);
                        toast.success("Coordenadas copiadas al portapapeles");
                      }}
                    >
                      Copiar
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          variant="outline"
          onClick={handleReset}
          className="gap-2"
        >
          <Undo className="h-4 w-4" /> Reiniciar Valores
        </Button>
      </div>
    </div>
  );
};

export default NetherPortalCalculator;
