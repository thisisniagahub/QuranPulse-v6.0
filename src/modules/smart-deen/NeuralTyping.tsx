import React from 'react';
import { motion } from 'framer-motion';

const NeuralTyping: React.FC = () => {
    return (
        <div className="flex items-center gap-1.5 h-6 px-3">
            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={i}
                    className={`w-1.5 rounded-full ${i % 2 === 0 ? 'bg-raudhah-gold' : 'bg-raudhah-teal'}`}
                    initial={{ height: 4 }}
                    animate={{
                        height: [4, 18, 4],
                        opacity: [0.4, 1, 0.4]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

export default NeuralTyping;
