import React from 'react';
import { motion } from 'framer-motion';

const NeuralTyping: React.FC = () => {
    return (
        <div className="flex items-center gap-1 h-6 px-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-cyan-500 rounded-full"
                    initial={{ height: 4 }}
                    animate={{ height: [4, 16, 4] }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

export default NeuralTyping;
