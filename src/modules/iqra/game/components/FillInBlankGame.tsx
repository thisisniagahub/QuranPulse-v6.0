import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FillInBlankProps {
    data: {
        text: string;
        options: string[];
        answer: string;
    };
    onComplete: () => void;
}

const FillInBlankGame: React.FC<FillInBlankProps> = ({ data, onComplete }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [isWrong, setIsWrong] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSelect = (option: string) => {
        if (option === data.answer) {
            setSelected(option);
            setIsSuccess(true);
            setTimeout(onComplete, 1500);
        } else {
            setSelected(option);
            setIsWrong(true);
            setTimeout(() => {
                setIsWrong(false);
                setSelected(null);
            }, 800);
        }
    };

    // Split text by placeholder (assuming "____")
    const parts = data.text.split('____');

    return (
        <div className="space-y-12 p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
            <div className="text-center">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Lengkapkan Kalimah</h3>
                <p className="text-slate-400 text-sm">Pilih perkataan yang tepat untuk mengisi tempat kosong.</p>
            </div>

            <div className="text-4xl text-white text-center font-arabic leading-loose flex flex-wrap justify-center items-center gap-4">
                <span>{parts[0]}</span>
                <motion.div
                    animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
                    className={`min-w-[120px] h-14 border-b-4 flex items-center justify-center transition-colors ${isSuccess ? 'border-green-500 text-green-400' :
                            isWrong ? 'border-red-500 text-red-400' : 'border-raudhah-teal/50 text-raudhah-teal'
                        }`}
                >
                    {selected || '...'}
                </motion.div>
                <span>{parts[1]}</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {data.options.map((option, idx) => (
                    <motion.button
                        key={idx}
                        whileHover={{ scale: 1.05, translateY: -4 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isSuccess}
                        onClick={() => handleSelect(option)}
                        className={`py-4 px-2 rounded-2xl border-2 transition-all font-arabic text-2xl ${selected === option && isSuccess
                                ? 'bg-green-500/20 border-green-500 text-green-100'
                                : selected === option && isWrong
                                    ? 'bg-red-500/20 border-red-500 text-red-100'
                                    : 'bg-black/60 border-white/10 text-slate-300 hover:border-raudhah-teal/50 hover:text-white'
                            }`}
                    >
                        {option}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default FillInBlankGame;
