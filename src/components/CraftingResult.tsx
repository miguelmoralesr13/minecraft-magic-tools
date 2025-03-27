
import React from "react";
import { OptimalCraftingResult, CraftingMaterial } from "@/types/craftingTypes";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ArrowRight, Layers } from "lucide-react";

interface CraftingResultProps {
  result: OptimalCraftingResult;
}

const CraftingResult: React.FC<CraftingResultProps> = ({ result }) => {
  // Format material quantity to display integers instead of decimals
  const formatQuantity = (num: number): string => {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };

  return (
    <div className="space-y-4">
      {/* Materials Summary */}
      <div>
        <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Materiales Necesarios
        </h3>
        <ScrollArea className="h-48">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.totalMaterials.map((material, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{material.icon}</span>
                      <span>{material.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{formatQuantity(material.count)}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <Separator />

      {/* Crafting Steps */}
      <div>
        <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          Pasos de Crafteo
        </h3>
        <Accordion type="single" collapsible className="w-full">
          {result.steps.map((step, index) => (
            <AccordionItem key={index} value={`step-${index}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Badge className="h-6 w-6 rounded-full flex items-center justify-center p-0">
                    {index + 1}
                  </Badge>
                  <span>{step.description}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-8 mt-2 space-y-4">
                  {/* Materials needed for this step */}
                  <div className="grid grid-cols-2 gap-2">
                    {step.materials.map((material, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                        <span className="text-xl">{material.icon}</span>
                        <div className="flex flex-col">
                          <span className="text-sm">{material.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatQuantity(material.count)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Result of this step */}
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-md">
                      <span className="text-xl">{step.result.item.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-sm">{step.result.item.name}</span>
                        <span className="text-xs text-muted-foreground">
                          x{step.result.count}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Crafting type */}
                  {step.result.item.craftingType !== "other" && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Usar: {getCraftingTypeName(step.result.item.craftingType)}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      {/* Optimal banner if calculation is optimal */}
      {result.isOptimal && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-md p-3 flex items-center gap-2 mt-4">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm">Este método de crafteo es óptimo y minimiza el uso de recursos</span>
        </div>
      )}
    </div>
  );
};

// Helper function to get readable crafting type names
function getCraftingTypeName(type: string): string {
  switch (type) {
    case "crafting_table": return "Mesa de Crafteo";
    case "furnace": return "Horno";
    case "smithing_table": return "Mesa de Herrería";
    case "stonecutter": return "Cortapiedras";
    default: return type;
  }
}

export default CraftingResult;
