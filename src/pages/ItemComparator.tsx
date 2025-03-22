
import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight, Search, X } from "lucide-react";

// Define types for Minecraft items
interface MinecraftItem {
  id: string;
  name: string;
  type: string;
  durability?: number;
  damage?: number;
  protection?: number;
  efficiency?: number;
  speed?: number;
  imageUrl: string;
  version: "bedrock" | "java" | "both";
}

// Sample data for Minecraft items
const itemsData: MinecraftItem[] = [
  // Tools
  {
    id: "diamond_pickaxe",
    name: "Pico de Diamante",
    type: "herramienta",
    durability: 1561,
    damage: 5,
    efficiency: 8,
    imageUrl: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e7/Diamond_Pickaxe_JE3_BE3.png",
    version: "both"
  },
  {
    id: "iron_pickaxe",
    name: "Pico de Hierro",
    type: "herramienta",
    durability: 250,
    damage: 4,
    efficiency: 6,
    imageUrl: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/d/d1/Iron_Pickaxe_JE3_BE3.png",
    version: "both"
  },
  {
    id: "golden_pickaxe",
    name: "Pico de Oro",
    type: "herramienta",
    durability: 32,
    damage: 2,
    efficiency: 12,
    imageUrl: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/08/Golden_Pickaxe_JE3_BE3.png",
    version: "both"
  },
  
  // Weapons
  {
    id: "diamond_sword",
    name: "Espada de Diamante",
    type: "arma",
    durability: 1561,
    damage: 7,
    imageUrl: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/4/44/Diamond_Sword_JE3_BE3.png",
    version: "both"
  },
  {
    id: "iron_sword",
    name: "Espada de Hierro",
    type: "arma",
    durability: 250,
    damage: 6,
    imageUrl: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/8/8e/Iron_Sword_JE3_BE3.png",
    version: "both"
  },
  {
    id: "netherite_sword",
    name: "Espada de Netherita",
    type: "arma",
    durability: 2031,
    damage: 8,
    imageUrl: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/25/Netherite_Sword_JE2_BE2.png",
    version: "both"
  },
  
  // Armor
  {
    id: "diamond_chestplate",
    name: "Peto de Diamante",
    type: "armadura",
    durability: 528,
    protection: 8,
    imageUrl: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e0/Diamond_Chestplate_JE4_BE2.png",
    version: "both"
  },
  {
    id: "iron_chestplate",
    name: "Peto de Hierro",
    type: "armadura",
    durability: 240,
    protection: 6,
    imageUrl: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/25/Iron_Chestplate_JE3_BE2.png",
    version: "both"
  },
  {
    id: "netherite_chestplate",
    name: "Peto de Netherita",
    type: "armadura",
    durability: 592,
    protection: 8,
    imageUrl: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/a2/Netherite_Chestplate_JE2_BE1.png",
    version: "both"
  }
];

const ItemComparator: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<MinecraftItem[]>([]);
  const [version, setVersion] = useState<"bedrock" | "java" | "both">("both");
  
  // Filter items based on search term and version
  const filteredItems = itemsData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVersion = version === "both" || item.version === "both" || item.version === version;
    return matchesSearch && matchesVersion;
  });
  
  const addItemToCompare = (item: MinecraftItem) => {
    if (selectedItems.length < 3 && !selectedItems.some(i => i.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };
  
  const removeItemFromCompare = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };
  
  // Get all stats to compare
  const getAllStats = () => {
    const stats: string[] = [];
    selectedItems.forEach(item => {
      Object.keys(item).forEach(key => {
        if (!["id", "name", "type", "imageUrl", "version"].includes(key) && !stats.includes(key)) {
          stats.push(key);
        }
      });
    });
    return stats;
  };
  
  const statTranslations: Record<string, string> = {
    durability: "Durabilidad",
    damage: "Daño",
    protection: "Protección",
    efficiency: "Eficiencia",
    speed: "Velocidad"
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Comparador de Items</h1>
          
          {/* Version toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-secondary rounded-full p-1 flex">
              <button
                className={`px-4 py-2 rounded-full text-sm ${version === "both" ? "bg-primary text-white" : ""}`}
                onClick={() => setVersion("both")}
              >
                Todos
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm ${version === "bedrock" ? "bg-blue-500 text-white" : ""}`}
                onClick={() => setVersion("bedrock")}
              >
                Bedrock
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm ${version === "java" ? "bg-orange-500 text-white" : ""}`}
                onClick={() => setVersion("java")}
              >
                Java
              </button>
            </div>
          </div>
          
          {/* Selected items for comparison */}
          {selectedItems.length > 0 && (
            <Card className="mb-8">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <ArrowLeftRight className="mr-2" size={20} /> 
                  Comparación de Items
                </CardTitle>
                <CardDescription>
                  Comparando {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estadística</TableHead>
                      {selectedItems.map(item => (
                        <TableHead key={item.id} className="text-center">
                          <div className="flex flex-col items-center">
                            <div className="relative mb-2">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-12 h-12 object-contain mx-auto"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://via.placeholder.com/48?text=Error';
                                }}
                              />
                              <button
                                onClick={() => removeItemFromCompare(item.id)}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            {item.name}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Tipo</TableCell>
                      {selectedItems.map(item => (
                        <TableCell key={item.id} className="text-center capitalize">
                          {item.type}
                        </TableCell>
                      ))}
                    </TableRow>
                    {getAllStats().map(stat => (
                      <TableRow key={stat}>
                        <TableCell className="font-medium">{statTranslations[stat] || stat}</TableCell>
                        {selectedItems.map(item => (
                          <TableCell key={item.id} className="text-center">
                            {item[stat as keyof MinecraftItem] !== undefined 
                              ? item[stat as keyof MinecraftItem] 
                              : "-"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
          
          {/* Search and item list */}
          <div className="mb-8">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="glass-panel rounded-xl p-4 cursor-pointer"
                  onClick={() => addItemToCompare(item)}
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-12 h-12 object-contain" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/48?text=Error';
                      }}
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full"
                    disabled={selectedItems.some(i => i.id === item.id) || selectedItems.length >= 3}
                  >
                    {selectedItems.some(i => i.id === item.id) 
                      ? "Añadido" 
                      : selectedItems.length >= 3 
                        ? "Límite alcanzado" 
                        : "Comparar"}
                  </Button>
                </motion.div>
              ))}
              
              {filteredItems.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No se encontraron items que coincidan con tu búsqueda.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ItemComparator;
