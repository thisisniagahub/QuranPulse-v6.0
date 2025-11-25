import { GoogleGenAI, GenerateContentResponse, Modality, Type } from "@google/genai";
import { AI_PERSONAS, SYARIAH_BLACKLIST } from "../constants";
import { SyariahCheckResult } from "../types";

// Initialize Gemini Client
// NOTE: process.env.API_KEY is handled by Vite define in vite.config.ts
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// --- Syariah Guard (Local Filter) ---
export const checkSyariahCompliance = (text: string): SyariahCheckResult => {
  const normalized = text.toLowerCase();
  for (const word of SYARIAH_BLACKLIST) {
    if (normalized.includes(word)) {
      return { safe: false, flaggedTerm: word };
    }
  }
  return { safe: true };
};

// --- Smart Deen (Ustaz AI) ---
export const askUstazAI = async (userPrompt: string, enableThinking: boolean = false): Promise<string> => {
  try {
    const compliance = checkSyariahCompliance(userPrompt);
    if (!compliance.safe) {
      return `⚠️ **Syariah Alert**: I cannot answer questions related to prohibited topics (${compliance.flaggedTerm}). Please ask about something beneficial to your Deen.`;
    }

    // Use gemini-2.5-flash for both modes, leveraging thinkingConfig when enabled
    const model = "gemini-2.5-flash";
    
    let systemInstruction = AI_PERSONAS.USTAZ_SYARIAH;

    if (enableThinking) {
      systemInstruction += `
      
      **DEEP REASONING MODE ACTIVATED:**
      1. **Detailed Fiqh Analysis**: Provide a comprehensive explanation citing specific classical texts of the Syafi'i Mazhab.
      2. **Malaysian Context**: Explicitly reference relevant Malaysian Fatwa Council decisions.
      3. **Structure**: Break down complex rulings into clear points (Hukum, Dalil, Huraian).
      `;
    }

    const config: any = {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    };

    if (enableThinking) {
      config.thinkingConfig = { thinkingBudget: 4096 }; 
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: [
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: config,
    });

    return response.text || "Afwan, I could not generate a response at this time.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, the Ustaz is currently unavailable (Network Error). Please try again.";
  }
};

// --- Verse Context Chat (Quran Module) ---
export const chatWithVerseContext = async (verseKey: string, verseText: string, userQuestion: string): Promise<string> => {
    try {
        const prompt = `
            CONTEXT: The user is asking about Quran Verse ${verseKey}.
            VERSE TEXT: "${verseText}"
            USER QUESTION: "${userQuestion}"
            INSTRUCTIONS: Use the Persona of 'Ustaz AI'. Provide Tafsir references if relevant.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
            config: { systemInstruction: AI_PERSONAS.USTAZ_SYARIAH }
        });

        return response.text || "I apologize, I could not process your question about this verse.";
    } catch (error) {
        return "Connection error. Please try again.";
    }
};

// --- Verse Connections (Related Topics/Verses) ---
export const getVerseConnections = async (verseKey: string, verseText: string): Promise<any> => {
    try {
        const prompt = `
            Analyze this Quran verse: [${verseKey}] "${verseText}".
            Identify 3-4 Key Topics and 2-3 Related Verses.
            Output JSON only.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                        related_verses: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    ref: { type: Type.STRING },
                                    text: { type: Type.STRING },
                                    reason: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        return JSON.parse(response.text || "{}");
    } catch (e) {
        return null;
    }
};

// --- Verse Tafsir & Reflection ---
export const getVerseTafsir = async (surahName: string, verseKey: string, verseText: string): Promise<any> => {
  try {
    const prompt = `Analyze ${surahName} ${verseKey}: "${verseText}". Provide Tafsir summary, Reflection, and 3 Keywords. Output JSON.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tafsir: { type: Type.STRING },
            reflection: { type: Type.STRING },
            keywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { term: { type: Type.STRING }, meaning: { type: Type.STRING } }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) { return null; }
};

// --- Morphology Analysis ---
export const analyzeMorphology = async (word: string, verseContext: string): Promise<any> => {
  try {
    const prompt = `Analyze Arabic word "${word}" in context "${verseContext}". Output JSON with root, type, grammar, translation, usage_context.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            root: { type: Type.STRING },
            type: { type: Type.STRING },
            grammar: { type: Type.STRING },
            translation: { type: Type.STRING },
            usage_context: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) { return null; }
};

// --- Semantic Search (Enhanced for Dual Language) ---
export const getSemanticQuranSearch = async (query: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: query }] }],
      config: {
        systemInstruction: `
          You are a Quranic Search Engine. 
          Task: Find 3 most relevant verses for the user's query.
          Output JSON. Ensure 'translation_ms' provides a Bahasa Melayu translation.
        `,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                results: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            surah: { type: Type.STRING },
                            ayah: { type: Type.INTEGER },
                            arabic: { type: Type.STRING },
                            translation_en: { type: Type.STRING },
                            translation_ms: { type: Type.STRING },
                            explanation: { type: Type.STRING }
                        }
                    }
                }
            }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) { return null; }
};

// --- Jawi Converter ---
export const convertToJawi = async (rumiText: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: rumiText }] }],
      config: { systemInstruction: AI_PERSONAS.JAWI_CONVERTER }
    });
    return response.text?.trim() || "";
  } catch (e) { return ""; }
};

// --- Hadith Retrieval ---
export const getHadithByTopic = async (topic: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: topic }] }],
      config: {
        systemInstruction: AI_PERSONAS.HADITH_LIBRARIAN,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                source: { type: Type.STRING },
                number: { type: Type.STRING },
                arabic: { type: Type.STRING },
                translation: { type: Type.STRING },
                explanation: { type: Type.STRING }
            }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) { return null; }
};

// --- Learning Planner ---
export const generateLearningPlan = async (goal: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: goal }] }],
      config: {
        systemInstruction: AI_PERSONAS.LEARNING_PLANNER,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                planName: { type: Type.STRING },
                duration: { type: Type.STRING },
                schedule: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { day: { type: Type.STRING }, task: { type: Type.STRING } }
                    }
                }
            }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) { return null; }
};

// --- Doa Generator ---
export const generateDoaCard = async (name: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: `Name: ${name}` }] }],
      config: { systemInstruction: AI_PERSONAS.DOA_GENERATOR }
    });
    return response.text || "";
  } catch (e) { return "May Allah bless you and your family."; }
};

// --- ADMIN ASSISTANT ---
export const askAdminAssistant = async (summaryData: any, userPrompt: string): Promise<string> => {
  try {
    const systemPrompt = `
      You are 'Jarvis', the AI Administrator for the Quran Pulse SuperApp.
      You have access to the following real-time system data:
      ${JSON.stringify(summaryData)}

      Your job is to help the admin manage the app.
      - If asked about sales, analyze the 'revenue' and 'recent_orders'.
      - If asked about stock, check 'low_stock_items'.
      - If asked to write an announcement, draft a professional one based on the context.
      - If asked about users, analyze 'total_users' and 'active_users'.
      - Keep answers professional, concise, and helpful.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt
      }
    });

    return response.text || "I am unable to analyze the data right now.";
  } catch (e) {
    return "Error connecting to AI Admin Brain.";
  }
};

export const generateAnnouncementDraft = async (topic: string): Promise<string> => {
    try {
        const prompt = `Write a short, professional, and Islamic-themed in-app announcement about: "${topic}". keep it under 20 words.`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }]
        });
        return response.text?.trim() || topic;
    } catch (e) {
        return topic;
    }
};

// --- NEW ADVANCED ADMIN TOOLS (V6.8) ---

export const generateContentFromIdea = async (type: 'KHUTBAH' | 'QUIZ' | 'MARKETING', topic: string): Promise<string> => {
    try {
        let prompt = "";
        let sysInstruct = "";

        if (type === 'KHUTBAH') {
            sysInstruct = "You are an Imam preparing a Friday Khutbah. Write a structured summary (Intro, 2 main points, Conclusion, Doa) in Malay/English mix.";
            prompt = `Topic: ${topic}`;
        } else if (type === 'QUIZ') {
            sysInstruct = "Generate 3 multiple choice questions about the topic. Output JSON format: [{question, options[], answer}]";
            prompt = `Topic: ${topic}`;
        } else {
            sysInstruct = "You are a Copywriter. Write a catchy, short, and persuasive push notification message.";
            prompt = `Promotion/Update: ${topic}`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
            config: { systemInstruction: sysInstruct }
        });
        return response.text || "Failed to generate.";
    } catch (e) {
        return "AI Error.";
    }
};

// --- Quran Recitation Analysis ---
export const analyzeQuranRecitation = async (base64Audio: string, mimeType: string, contextText: string): Promise<any> => {
  try {
    const prompt = `Analyze recitation of: "${contextText}". Check Tajweed. Score out of 100. JSON Output.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ inlineData: { mimeType: mimeType, data: base64Audio } }, { text: prompt }] }],
      config: {
        systemInstruction: AI_PERSONAS.IQRA_EXAMINER,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                identified_text: { type: Type.STRING },
                accuracy_score: { type: Type.INTEGER },
                feedback_summary: { type: Type.STRING },
                tajweed_errors: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { error: { type: Type.STRING }, tip: { type: Type.STRING } }
                    }
                }
            }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) { return null; }
};

// --- Video Generation (Media Studio) ---
export const enhanceVideoPrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: `Enhance this video prompt for Veo: "${prompt}"` }] }]
    });
    return response.text || prompt;
  } catch (e) { return prompt; }
};

export const generateIslamicVideo = async (prompt: string): Promise<string | null> => {
  try {
    const veoAi = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

    let operation = await veoAi.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '16:9'
        }
    });

    // POLLING WITH TIMEOUT (Robust Logic)
    const MAX_POLL_TIME = 120000; // 2 minutes timeout
    const startTime = Date.now();

    while (!operation.done) {
        if (Date.now() - startTime > MAX_POLL_TIME) {
            console.error("Video generation timed out.");
            return null; // Exit cleanly
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await veoAi.operations.getVideosOperation({ operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) return null;

    return `${videoUri}&key=${process.env.API_KEY}`;
  } catch (e) {
    console.error("Video Gen Error", e);
    return null;
  }
};

// --- TTS Speech Generation ---
export const generateSpeech = async (text: string, voiceName: 'Zephyr' | 'Kore' = 'Zephyr'): Promise<string | null> => {
  try {
      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text }] }],
          config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
          }
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (e) { return null; }
};