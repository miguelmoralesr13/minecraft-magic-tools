import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMapStore } from "@/store/mapStore";

interface SeedControlsProps {
  version: "java" | "bedrock";
  setVersion: (version: "java" | "bedrock") => void;
  seed: string;
  onSeedChange: (seed: string) => void;
  onGenerate?: () => void;
}

const SeedControls = ({ version, setVersion, seed, onSeedChange, onGenerate }: SeedControlsProps) => {

  return (
    <Card className="p-4 mb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="seed" className="block text-sm font-medium mb-2">
            Semilla
          </label>
          <Input
            id="seed"
            type="text"
            placeholder="Ingresa una semilla"
            value={seed}
            onChange={(e) => onSeedChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={version === "java" ? "default" : "outline"}
            onClick={() => setVersion("java")}
          >
            Java
          </Button>
          <Button
            variant={version === "bedrock" ? "default" : "outline"}
            onClick={() => setVersion("bedrock")}
          >
            Bedrock
          </Button>
        </div>
        <Button onClick={onGenerate || (() => onSeedChange(seed))} className="w-full sm:w-auto">
          Generar Mapa
        </Button>
      </div>
    </Card>
  );
};

export default SeedControls;