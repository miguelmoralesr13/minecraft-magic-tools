
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  RefreshCw, 
  Download, 
  Layers, 
  Map, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import FilterPanel from '@/components/FilterPanel';
import { useMapStore } from '@/store/mapStore';

interface MapControlsProps {
  onRegenerate?: () => void;
  onDownloadMap?: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  onRegenerate,
  onDownloadMap
}) => {
  const { 
    showBiomes, 
    setShowBiomes,
    showControls,
    setShowControls,
    activeStructures,
    setActiveStructures
  } = useMapStore();

  // Función para alternar todos los filtros
  const toggleAllFilters = (enable: boolean) => {
    if (enable) {
      // Habilitar todos los filtros disponibles
      setActiveStructures([
        'village', 
        'fortress', 
        'stronghold', 
        'monument', 
        'mansion', 
        'temple', 
        'mineshaft', 
        'ruined_portal', 
        'outpost', 
        'spawner'
      ]);
    } else {
      // Deshabilitar todos los filtros
      setActiveStructures([]);
    }
  };

  return (
    <div className="relative z-10">
      {/* Botón de alternar controles */}
      <Button
        variant="outline"
        size="sm"
        className="absolute right-4 -top-10"
        onClick={() => setShowControls(!showControls)}
      >
        {showControls ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        {showControls ? 'Ocultar controles' : 'Mostrar controles'}
      </Button>
      
      {showControls && (
        <Card className="p-4 mb-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <h3 className="font-medium mb-2 flex items-center">
              <Layers className="w-4 h-4 mr-2" />
              Capas
            </h3>
            <div className="flex items-center space-x-2 mb-2">
              <Switch 
                id="showBiomes" 
                checked={showBiomes} 
                onCheckedChange={setShowBiomes} 
              />
              <Label htmlFor="showBiomes">Mostrar biomas</Label>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toggleAllFilters(true)}
              >
                Seleccionar todo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toggleAllFilters(false)}
              >
                Deseleccionar todo
              </Button>
            </div>
          </div>
          
          <div className="flex-1 min-w-[250px]">
            <FilterPanel />
          </div>
          
          <div className="flex-none w-full md:w-auto flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={onRegenerate}
              className="flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerar
            </Button>
            
            <Button
              variant="outline"
              onClick={onDownloadMap}
              className="flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MapControls;
