
import React from "react";
import { motion } from "framer-motion";

interface UtilityCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

const UtilityCard: React.FC<UtilityCardProps> = ({ 
  title, 
  description, 
  icon,
  color,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5,
        delay: delay * 0.1,
        ease: [0.19, 1, 0.22, 1]
      }}
      whileHover={{ y: -5 }}
      className="glass-panel rounded-xl p-6 transition-all duration-300 hover:shadow-xl"
    >
      <div 
        className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-white`}
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      
      <p className="text-muted-foreground text-sm">{description}</p>
      
      <div className="mt-4 pt-4 border-t border-border">
        <button className="text-sm font-medium text-primary hover:underline">
          Explorar &rarr;
        </button>
      </div>
    </motion.div>
  );
};

export default UtilityCard;
