
import React from "react";
import UtilityCard from "./UtilityCard";

interface Utility {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  link: string;
}

interface UtilitiesGridProps {
  utilities: Utility[];
  version: "bedrock" | "java";
}

const UtilitiesGrid: React.FC<UtilitiesGridProps> = ({ utilities, version }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Utilidades para Minecraft {version === "bedrock" ? "Bedrock" : "Java"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {utilities.map((utility, index) => (
            <UtilityCard
              key={utility.title}
              title={utility.title}
              description={utility.description}
              icon={utility.icon}
              color={utility.color}
              delay={index}
              link={utility.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UtilitiesGrid;
