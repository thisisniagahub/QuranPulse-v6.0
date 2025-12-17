import { useState } from 'react';
import { askUstazAI, ChatMessage } from '../services/aiService';
import { PERSONAS, PersonaKey } from '../constants/personas';

export const useChat = (initialPersona: PersonaKey = 'AZHAR', userName: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            content: `Assalamualaikum, ${userName}. Saya ${PERSONAS[initialPersona].name}. Ada apa-apa yang boleh saya bantu mengenai agama hari ini?`
        }
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState<PersonaKey>(initialPersona);

    const switchPersona = (persona: PersonaKey) => {
        setSelectedPersona(persona);
        // Optional: Add a system message or greeting from new persona? 
        // For now, just switching context for future messages.
    };

    const sendMessage = async (input: string) => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = {
            role: 'user',
            content: input.trim()
        };

        // Optimistic update
        setMessages(prev => [...prev, userMsg]);
        setIsThinking(true);

        try {
            // Build system prompt with persona context
            const personaSystemPrompt = `Anda adalah ${PERSONAS[selectedPersona].name}, seorang ${PERSONAS[selectedPersona].role}. Gaya bahasa anda ${PERSONAS[selectedPersona].style}. Jawab dalam Bahasa Melayu yang baik.`;
            
            // Prepare messages for AI (with system prompt)
            // Note: askUstazAI might handle system prompt prepending if not present, 
            // but providing it explicitly as the first message or a dedicated system message is safer/cleaner
            // if the service supports it. 
            // Based on aiService.ts refactor, askUstazAI calls callGeminiFlash which prepends THEOLOGICAL prompt.
            // We should combine them or let the service handle the base theological prompt and we provide persona context.
            
            // Let's create a temporary array for the AI call that includes the persona context.
            const contextMessages: ChatMessage[] = [
                { role: 'system', content: personaSystemPrompt },
                ...messages.slice(-10), // Context window
                userMsg
            ];

            const responseText = await askUstazAI(contextMessages);

            const aiMsg: ChatMessage = {
                role: 'assistant',
                content: responseText
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("AI Error:", error);
            const errorMsg: ChatMessage = {
                role: 'assistant',
                content: "Maaf, saya mengalami masalah teknikal sebentar. Sila cuba lagi."
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsThinking(false);
        }
    };

    return {
        messages,
        isThinking,
        selectedPersona,
        switchPersona,
        sendMessage
    };
};
