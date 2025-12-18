import { useState } from 'react';
import { useCopilotChatHeadless_c } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { ChatMessage } from '../types';
import { PERSONAS, PersonaKey } from '../constants/personas';

export const useChat = (initialPersona: PersonaKey = 'AZHAR', userName: string) => {
    const [selectedPersona, setSelectedPersona] = useState<PersonaKey>(initialPersona);
    
    // CopilotKit Headless Hook
    // Removed invalid 'systemMessage' property based on TS error
    const { messages: copilotMessages, sendMessage, isLoading } = useCopilotChatHeadless_c({
    });

    const switchPersona = (persona: PersonaKey) => {
        setSelectedPersona(persona);
    };

    const handleSendMessage = (input: string) => {
        if (!input.trim()) return;
        
        // Correctly type the message for CopilotKit
        sendMessage({
            role: "user",
            content: input
        });
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
            role: (m.role === "user" ? "user" : "assistant") as 'user' | 'assistant' | 'system',
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