import React from 'react';
import { motion } from 'framer-motion';
import { PERSONAS, PersonaKey } from '../../constants/personas';

interface UstazAvatarProps {
  persona: PersonaKey;
  isThinking: boolean;
  isSpeaking?: boolean;
}

const UstazAvatar: React.FC<UstazAvatarProps> = ({ persona, isThinking, isSpeaking }) => {
  const currentPersona = PERSONAS[persona];
  const color = currentPersona?.color || 'cyan'; // 'cyan', 'emerald', 'pink'

  // Map color names to Tailwind classes dynamically-ish or switch
  const getColorClass = (type: 'text' | 'border' | 'bg' | 'shadow') => {
      // Simple mapping for the 3 personas
      if (persona === 'AZHAR') return type === 'text' ? 'text-cyan-400' : type === 'border' ? 'border-cyan-400' : type === 'bg' ? 'bg-cyan-500/20' : 'shadow-cyan-500/20';
      if (persona === 'AIMAN') return type === 'text' ? 'text-emerald-400' : type === 'border' ? 'border-emerald-400' : type === 'bg' ? 'bg-emerald-500/20' : 'shadow-emerald-500/20';
      if (persona === 'AISHAH') return type === 'text' ? 'text-pink-400' : type === 'border' ? 'border-pink-400' : type === 'bg' ? 'bg-pink-500/20' : 'shadow-pink-500/20';
      return type === 'text' ? 'text-cyan-400' : type === 'border' ? 'border-cyan-400' : type === 'bg' ? 'bg-cyan-500/20' : 'shadow-cyan-500/20';
  };

  return (
    <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center mx-auto mb-6">
      {/* Outer Pulse Ring */}
      <motion.div
        className={`absolute inset-0 rounded-full border-2 ${isThinking ? 'border-amber-500' : getColorClass('border')} opacity-30`}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: isThinking ? 1 : 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Inner Glow Field */}
      <motion.div
        className={`absolute inset-2 rounded-full blur-xl ${isThinking ? 'bg-amber-500/20' : getColorClass('bg')}`}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Main Avatar Circle */}
      <div className={`relative w-full h-full rounded-full bg-slate-900 border-2 ${isThinking ? 'border-amber-400' : getColorClass('border')} flex items-center justify-center overflow-hidden shadow-2xl ${getColorClass('shadow')}`}>
        
        {/* Holographic Scanlines */}
        <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/26tn33aiTi1jkl6hW/giphy.gif')] opacity-10 mix-blend-screen pointer-events-none"></div>

        {/* Ustaz Icon / Image */}
        <div className="relative z-10 text-center">
            <motion.i 
                className={`fa-solid ${persona === 'AZHAR' ? 'fa-user-graduate' : persona === 'AISHAH' ? 'fa-user-nurse' : 'fa-user-astronaut'} text-4xl sm:text-5xl ${isThinking ? 'text-amber-400' : getColorClass('text')}`}
                animate={isThinking ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            ></motion.i>
            {isSpeaking && (
                 <motion.div 
                    className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"
                    animate={{ scale: [1, 1.5, 1] }}
                 />
            )}
        </div>
      </div>

      {/* Connection Nodes */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {[1,2,3].map(i => (
              <motion.div 
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${isThinking ? 'bg-amber-400' : getColorClass('text').replace('text', 'bg')}`}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
              />
          ))}
      </div>
    </div>
  );
};

export default UstazAvatar;
