import React from "react";
import { AlertCircle, Map, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoDataOverlayProps {
  noSeed?: boolean;
  noStructures?: boolean;
  onRandomSeed?: () => void;
}

const NoDataOverlay: React.FC<NoDataOverlayProps> = ({ 
  noSeed = false, 
  noStructures = false,
  onRandomSeed
}) => {
  if (!noSeed && !noStructures) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-background/80 z-10">
      {noSeed ? (
        <>
          <Map className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold">Ingresa una semilla para comenzar</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Ingresa una semilla en el panel de la izquierda para ver qué puedes encontrar en ese mundo.
          </p>
          {onRandomSeed && (
            <Button 
              onClick={onRandomSeed}
              className="mt-2"
              variant="outline"
            >
              <Search className="h-4 w-4 mr-2" />
              Generar semilla aleatoria
            </Button>
          )}
        </>
      ) : (
        <>
          <AlertCircle className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold">No se encontraron estructuras</h3>
          <p className="text-muted-foreground text-center max-w-md">
            No se encontraron estructuras con los filtros actuales. Prueba con otros filtros o una semilla diferente.
          </p>
        </>
      )}
    </div>
  );
};

export default NoDataOverlay;