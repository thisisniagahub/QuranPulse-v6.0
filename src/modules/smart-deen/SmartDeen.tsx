import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { convertToJawi, getHadithByTopic, askUstazAI } from '../../services/aiService';
import { geminiCliService } from '../../services/geminiCliService';
import { ollamaAiService } from '../../services/ollamaAiService';
import { motion } from "framer-motion";
import UstazAvatar from './UstazAvatar';
import NeuralTyping from './NeuralTyping';
import SuggestionChips from './SuggestionChips';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import KhatamPlanner from './components/KhatamPlanner';

interface SmartDeenProps {
    userName?: string;
    hasBottomNav?: boolean;
}

const SmartDeen: React.FC<SmartDeenProps> = ({ userName, hasBottomNav = false }) => {
    const { user } = useAuth();
    const displayName = userName || user?.name || "Sahabat";
    const [activeTab, setActiveTab] = useState<'CHAT' | 'JAWI' | 'HADITH' | 'PLANNER'>('CHAT');
    const [selectedPersona, setSelectedPersona] = useState<'AZHAR' | 'AISHAH' | 'AIMAN'>('AZHAR');        

    // ... (personas object same as before)

  // --- Text Chat State ---
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Assalamualaikum, ${displayName}. Saya Ustaz AI (Powered by Ollama). Pilih persona dan tanya soalan anda.`,
      timestamp: Date.now()
    }
  ]);
  
  // ... (rest of state same as before)

  // ... (useEffect for scroll same as before)

  // ... (handleSend, handleSpeak, etc. same as before)

  return (
    <div className="flex flex-col h-full relative bg-[#020617]">
      {/* ... (Header same as before) */}

      {/* --- CHAT TAB --- */}
      {activeTab === 'CHAT' && (
          <>
            <div ref={scrollRef} className={`flex-1 overflow-y-auto p-4 space-y-6 ${hasBottomNav ? 'pb-48' : 'pb-32'}`}>

                {/* ... (Avatar, Welcome, Messages same as before) */}

            </div>

            <div className={`absolute inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20 ${hasBottomNav ? 'bottom-[88px]' : 'bottom-0'}`}>
                <div className={`flex gap-2 items-end bg-slate-900/80 p-2 rounded-2xl border transition-all backdrop-blur-xl shadow-2xl ${useThinking ? 'border-amber-500/30 shadow-amber-900/20 focus-within:border-amber-500/50' : 'border-cyan-500/30 shadow-cyan-900/20 focus-within:border-cyan-500/50'}`}>
                {/* ... (Textarea and buttons same as before) */}
                </div>
            </div>
          </>
      )}

      {/* --- OTHER TABS --- */}
      {/* Adjust padding for other tabs too if needed, but they scroll so it's less critical, mostly pb-24 is enough */}
      {/* ... (Jawi, Hadith, Planner same as before) */}
    </div>
  );
};


export default SmartDeen;
