
import React from "react";
import { motion } from "framer-motion";

interface VersionToggleProps {
  version: "bedrock" | "java";
  setVersion: (version: "bedrock" | "java") => void;
}

const VersionToggle: React.FC<VersionToggleProps> = ({ version, setVersion }) => {
  return (
    <div className="flex justify-center my-12">
      <div className="relative flex bg-secondary rounded-full p-1 w-64">
        <motion.div 
          className="absolute h-full top-0 rounded-full"
          animate={{
            left: version === "bedrock" ? "0%" : "50%",
            backgroundColor: version === "bedrock" ? "#4080ff" : "#ff6b40",
          }}
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ width: "50%" }}
        />
        
        <button
          className={`relative z-10 w-1/2 py-2 rounded-full text-sm font-medium transition-colors ${
            version === "bedrock" ? "text-white" : "text-foreground/70"
          }`}
          onClick={() => setVersion("bedrock")}
        >
          Bedrock
        </button>
        
        <button
          className={`relative z-10 w-1/2 py-2 rounded-full text-sm font-medium transition-colors ${
            version === "java" ? "text-white" : "text-foreground/70"
          }`}
          onClick={() => setVersion("java")}
        >
          Java
        </button>
      </div>
    </div>
  );
};

export default VersionToggle;
