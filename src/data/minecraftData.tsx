
import React from "react";
import { 
  Sword, 
  Pickaxe, 
  Bomb, 
  Trophy, 
  Rocket, 
  Cpu, 
  Map,
  Compass, 
  Boxes,
  Lightbulb,
  Clock,
  Zap
} from "lucide-react";

export const bedrockUtilities = [
  {
    title: "Comparador de Items",
    description: "Compara estadísticas entre diferentes items y herramientas de Minecraft Bedrock.",
    icon: <Sword className="h-6 w-6" />,
    color: "#ec4899",
    link: "/comparador-items"
  },
  {
    title: "Mapa de Semillas",
    description: "Explora estructuras, biomas y recursos en semillas de Minecraft Bedrock.",
    icon: <Map className="h-6 w-6" />,
    color: "#3b82f6",
    link: "/mapa-semillas"
  },
  {
    title: "Crafteos Óptimos",
    description: "Calcula la forma más eficiente de craftear items complejos en Minecraft Bedrock.",
    icon: <Pickaxe className="h-6 w-6" />,
    color: "#10b981",
    link: "#"
  },
  {
    title: "Calculadora de TNT",
    description: "Calcula el daño y el radio de explosión de la TNT en Minecraft Bedrock.",
    icon: <Bomb className="h-6 w-6" />,
    color: "#f97316",
    link: "#"
  },
  {
    title: "Guía de Logros",
    description: "Guía completa para conseguir todos los logros en Minecraft Bedrock.",
    icon: <Trophy className="h-6 w-6" />,
    color: "#facc15",
    link: "#"
  },
  {
    title: "Calculadora de Redstone",
    description: "Diseña y prueba circuitos de redstone para Minecraft Bedrock.",
    icon: <Cpu className="h-6 w-6" />,
    color: "#ef4444",
    link: "#"
  },
];

export const javaUtilities = [
  {
    title: "Comparador de Items",
    description: "Compara estadísticas entre diferentes items y herramientas de Minecraft Java.",
    icon: <Sword className="h-6 w-6" />,
    color: "#ec4899",
    link: "/comparador-items"
  },
  {
    title: "Mapa de Semillas",
    description: "Explora estructuras, biomas y recursos en semillas de Minecraft Java.",
    icon: <Map className="h-6 w-6" />,
    color: "#3b82f6",
    link: "/mapa-semillas"
  },
  {
    title: "Optimizador de Enchantments",
    description: "Calcula la mejor combinación de enchantments para tus herramientas en Minecraft Java.",
    icon: <Rocket className="h-6 w-6" />,
    color: "#8b5cf6",
    link: "#"
  },
  {
    title: "Crafteos Óptimos",
    description: "Calcula la forma más eficiente de craftear items complejos en Minecraft Java.",
    icon: <Pickaxe className="h-6 w-6" />,
    color: "#10b981",
    link: "#"
  },
  {
    title: "Guía de Estructuras",
    description: "Localiza y explora todas las estructuras en Minecraft Java.",
    icon: <Compass className="h-6 w-6" />,
    color: "#6366f1",
    link: "#"
  },
  {
    title: "Calculadora de Items",
    description: "Calcula cuántos recursos necesitas para construir grandes proyectos en Minecraft Java.",
    icon: <Boxes className="h-6 w-6" />,
    color: "#f59e0b",
    link: "#"
  },
];

// Add the utilities export that combines both versions
export const utilities = {
  bedrock: bedrockUtilities,
  java: javaUtilities
};

// Add the features export
export const features = [
  {
    title: "Actualizado Constantemente",
    description: "Nuestras herramientas se actualizan con cada nueva versión de Minecraft para asegurar compatibilidad.",
    icon: <Clock className="h-6 w-6" />
  },
  {
    title: "Preciso y Confiable",
    description: "Cálculos y datos verificados por la comunidad para garantizar precisión en todas nuestras herramientas.",
    icon: <Lightbulb className="h-6 w-6" />
  },
  {
    title: "Rápido y Eficiente",
    description: "Herramientas optimizadas para ofrecer resultados instantáneos sin importar la complejidad.",
    icon: <Zap className="h-6 w-6" />
  }
];

// Add the testimonials export
export const testimonials = [
  {
    name: "Carlos Mendez",
    role: "Constructor de Redstone",
    content: "La calculadora de redstone me ha ahorrado horas de prueba y error. Es increíblemente precisa y fácil de usar.",
    avatar: "https://i.pravatar.cc/100?img=1"
  },
  {
    name: "Laura Gómez",
    role: "Speedrunner",
    content: "El mapa de semillas es mi herramienta favorita. Me permite encontrar las estructuras que necesito rápidamente.",
    avatar: "https://i.pravatar.cc/100?img=2"
  },
  {
    name: "Miguel Santos",
    role: "Jugador Survival",
    content: "Uso el comparador de items todos los días. Me ayuda a decidir qué equipo craftear según mis necesidades.",
    avatar: "https://i.pravatar.cc/100?img=3"
  }
];
