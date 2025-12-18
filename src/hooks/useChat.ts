import { useState } from 'react';
import { useCopilotChatHeadless_c } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { ChatMessage } from '../types';
import { PERSONAS, PersonaKey } from '../constants/personas';

export const useChat = (initialPersona: PersonaKey = 'AZHAR', userName: string) => {
    const [selectedPersona, setSelectedPersona] = useState<PersonaKey>(initialPersona);
    
    // CopilotKit Headless Hook
    const { messages: copilotMessages, sendMessage, isLoading } = useCopilotChatHeadless_c({
        systemMessage: `
            Anda adalah ${PERSONAS[selectedPersona].name}, seorang ${PERSONAS[selectedPersona].role}. 
            Gaya bahasa anda ${PERSONAS[selectedPersona].style}. 
            Jawab dalam Bahasa Melayu yang baik.
            PERATURAN UTAMA:
            1.  **KEUTAMAAN:** Jawab berpandukan Al-Quran dan Hadith Sahih.
            2.  **DALIL:** Sertakan rujukan.
            3.  **KETIDAKPASTIAN:** Jika tiada dalil, jawab "Wallahu A'lam".
            4.  **PENAFIAN:** Di akhir jawapan sensitif: "Ini panduan umum AI. Rujuk asatizah untuk fatwa."
        `
    });

    const switchPersona = (persona: PersonaKey) => {
        setSelectedPersona(persona);
    };

    const handleSendMessage = (input: string) => {
        if (!input.trim()) return;
        
        sendMessage({
            role: "user" as Role, // Explicit cast if necessary
            content: input
        } as TextMessage);
    };

    // Transform Copilot messages to our ChatMessage type for UI
    const messages: ChatMessage[] = [
        // Welcome message (Manual)
        {
            id: 'welcome',
            role: 'assistant',
            content: `Assalamualaikum, ${userName}. Saya ${PERSONAS[selectedPersona].name}. Ada apa-apa yang boleh saya bantu mengenai agama hari ini?`,
            timestamp: Date.now()
        },
        // Mapped Copilot messages
        ...copilotMessages.map(m => ({
            id: m.id,
            role: m.role as 'user' | 'assistant' | 'system',
            content: m.content || "",
            timestamp: Date.now(), // Approximate
            render: (m as any).render // CopilotKit attaches the render function/node here
        }))
    ];

    return {
        messages,
        isThinking: isLoading,
        selectedPersona,
        switchPersona,
        sendMessage: handleSendMessage
    };
};