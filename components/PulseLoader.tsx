
import React from 'react';
import { motion } from "framer-motion";

interface PulseLoaderProps {
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const PulseLoader: React.FC<PulseLoaderProps> = ({ icon = "fa-microphone", size = 'lg', active = true }) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-xl',
    md: 'w-24 h-24 text-3xl',
    lg: 'w-32 h-32 text-4xl'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]}`}>
      {/* Outer Ripples - Only when active */}
      {active && [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute border border-primary/30 rounded-full box-border bg-primary/5"
          initial={{ width: "100%", height: "100%", opacity: 0 }}
          animate={{
            width: ["100%", "250%"],
            height: ["100%", "250%"],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut",
          }}
        />
      ))}
      
      {/* Core Button */}
      <motion.div
        animate={active ? {
          scale: [1, 1.1, 1],
          boxShadow: [
            "0px 0px 0px rgba(0, 191, 165, 0)",
            "0px 0px 30px rgba(0, 191, 165, 0.6)",
            "0px 0px 0px rgba(0, 191, 165, 0)"
          ]
        } : { scale: 1 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`w-full h-full rounded-full flex items-center justify-center relative z-10 text-black shadow-lg shadow-primary/30 border-4 border-islamic-dark ${active ? 'bg-primary' : 'bg-slate-700 text-slate-400'}`}
      >
        <i className={`fa-solid ${icon} ${sizeClasses[size].split(' ')[2]}`}></i>
      </motion.div>
    </div>
  );
};
