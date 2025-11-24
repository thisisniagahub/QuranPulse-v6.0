import { GoogleGenAI, GenerateContentResponse, Modality, Type } from "@google/genai";
import { AI_PERSONAS, SYARIAH_BLACKLIST } from "../constants";
import { SyariahCheckResult } from "../types";

// Initialize Gemini Client
// NOTE: process.env.API_KEY is automatically injected in the environment.
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
      1. **Detailed Fiqh Analysis**: Provide a comprehensive explanation citing specific classical texts of the Syafi'i Mazhab (e.g., *Minhaj at-Talibin*, *I'anah at-Talibin*, *Al-Fiqh al-Manhaji*).
      2. **Malaysian Context**: Explicitly reference relevant Malaysian Fatwa Council decisions, JAKIM guidelines, or local cultural context (*'Urf*) where applicable.
      3. **Historical Depth**: Include relevant *Asbab al-Nuzul* (Reasons for Revelation) or historical context of the Hadith to provide depth.
      4. **Structure**: Break down complex rulings into clear points (Hukum, Dalil, Huraian). Format with Markdown for clear reading.
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
            
            INSTRUCTIONS:
            1. Answer specifically about this verse.
            2. Use the Persona of 'Ustaz AI' (Knowledgeable, Syafi'i Mazhab, Gentle).
            3. Provide Tafsir references (e.g., Ibn Kathir/Jalalayn) if relevant to the question.
            4. Keep it concise but spiritually enriching.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                systemInstruction: AI_PERSONAS.USTAZ_SYARIAH,
            }
        });

        return response.text || "I apologize, I could not process your question about this verse.";
    } catch (error) {
        console.error("Verse Chat Error", error);
        return "Connection error. Please try again.";
    }
};

// --- Verse Connections (Related Topics/Verses) ---
export const getVerseConnections = async (verseKey: string, verseText: string): Promise<any> => {
    try {
        const prompt = `
            Analyze this Quran verse: [${verseKey}] "${verseText}".
            
            Identify:
            1. 3-4 Key Topics/Themes (e.g., "Patience", "Legal Ruling", "Prophet Musa").
            2. 2-3 Related Verses from elsewhere in the Quran that support, explain, or provide context to this verse.
            
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
                        topics: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        related_verses: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    ref: { type: Type.STRING, description: "Surah Name and Verse Number" },
                                    text: { type: Type.STRING, description: "Translation of the related verse" },
                                    reason: { type: Type.STRING, description: "Why is this related?" }
                                }
                            }
                        }
                    }
                }
            }
        });

        return JSON.parse(response.text || "{}");
    } catch (e) {
        console.error("Connection Gen Error", e);
        return null;
    }
};

// --- Verse Tafsir & Reflection (Quran Module) ---
export const getVerseTafsir = async (surahName: string, verseKey: string, verseText: string): Promise<any> => {
  try {
    const prompt = `
      Analyze ${surahName} ${verseKey}: "${verseText}"
      Provide:
      1. A detailed Tafsir summary (citing Ibn Kathir or Jalalayn where applicable).
      2. A personal reflection or actionable advice for a modern Muslim.
      3. 3 key Arabic words from the verse with their meanings.
    `;

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
                properties: {
                  term: { type: Type.STRING },
                  meaning: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Tafsir Error", error);
    return null;
  }
};

// --- Morphology Analysis (Word by Word) ---
export const analyzeMorphology = async (word: string, verseContext: string): Promise<any> => {
  try {
    const prompt = `
      Analyze the Arabic word: "${word}" found in the verse context: "${verseContext}".
      
      Output JSON strictly:
      1. root: The 3 letter root (e.g., ك ت ب)
      2. type: Noun (Ism), Verb (Fi'l), or Particle (Harf)
      3. grammar: Brief grammatical role (e.g., "Active Participle", "Past Tense Verb", "Object")
      4. translation: Literal meaning
      5. usage_context: A 1-sentence explanation of its nuance in this verse.
    `;

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
  } catch (error) {
    return null;
  }
};

// --- Semantic Search (Quran Module) ---
export const getSemanticQuranSearch = async (query: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: query }] }],
      config: {
        systemInstruction: `
          You are a Quranic Search Engine. 
          Task: Find 3 most relevant verses for the user's query (emotion, topic, or question).
          Output JSON: {
            "results": [
              { 
                  "surah": "Surah Name", 
                  "ayah": number, 
                  "arabic": "Arabic Text",
                  "translation_en": "English Translation",
                  "translation_ms": "Bahasa Melayu Translation",
                  "explanation": "Why this verse fits the query (Context)" 
              }
            ]
          }
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
  } catch (error) {
    return null;
  }
};

// --- Jawi Converter (Smart Deen) ---
export const convertToJawi = async (rumiText: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: rumiText }] }],
      config: {
        systemInstruction: AI_PERSONAS.JAWI_CONVERTER
      }
    });
    return response.text?.trim() || "";
  } catch (e) {
    return "";
  }
};

// --- Hadith Retrieval (Smart Deen) ---
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
  } catch (e) {
    return null;
  }
};

// --- Learning Planner (Smart Deen) ---
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
                        properties: {
                            day: { type: Type.STRING },
                            task: { type: Type.STRING }
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

// --- Doa Generator (Profile/Souq) ---
export const generateDoaCard = async (name: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: `Name: ${name}` }] }],
      config: {
        systemInstruction: AI_PERSONAS.DOA_GENERATOR
      }
    });
    return response.text || "";
  } catch (e) {
    return "May Allah bless you and your family.";
  }
};

// --- Quran Recitation Analysis (Iqra) ---
export const analyzeQuranRecitation = async (base64Audio: string, mimeType: string, contextText: string): Promise<any> => {
  try {
    const prompt = `
      Analyze this audio recitation. The user is trying to read: "${contextText}".
      Check for Tajweed accuracy, makhraj (pronunciation), and fluency.
      Give a score out of 100.
      Identify specific errors.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using flash for speed
      contents: [
        {
          parts: [
            { inlineData: { mimeType: mimeType, data: base64Audio } },
            { text: prompt }
          ]
        }
      ],
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
                        properties: {
                            error: { type: Type.STRING },
                            tip: { type: Type.STRING }
                        }
                    }
                }
            }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error(e);
    return null;
  }
};

// --- Video Generation (Media Studio) ---
export const enhanceVideoPrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: `Enhance this video prompt for Veo to be cinematic, high-resolution, and visually stunning: "${prompt}"` }] }]
    });
    return response.text || prompt;
  } catch (e) {
    return prompt;
  }
};

export const generateIslamicVideo = async (prompt: string): Promise<string | null> => {
  try {
    // 1. Initial Request - Create a new AI instance to ensure fresh API Key if set via `window.aistudio`
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

    // 2. Poll for completion with Timeout
    const MAX_POLL_TIME = 120000; // 2 minutes max wait
    const startTime = Date.now();

    while (!operation.done) {
        if (Date.now() - startTime > MAX_POLL_TIME) {
            console.error("Video generation timed out.");
            return null;
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
        operation = await veoAi.operations.getVideosOperation({ operation });
    }

    // 3. Get URI
    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) return null;

    // 4. Return URI with API Key appended (required for Veo downloads)
    return `${videoUri}&key=${process.env.API_KEY}`;
  } catch (e) {
    console.error("Video Gen Error", e);
    return null;
  }
};

// --- TTS Speech Generation (Iqra) ---
export const generateSpeech = async (text: string, voiceName: 'Zephyr' | 'Kore' = 'Zephyr'): Promise<string | null> => {
  try {
      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text }] }],
          config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                  voiceConfig: {
                      prebuiltVoiceConfig: { voiceName }
                  }
              }
          }
      });
      
      const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      return base64 || null;
  } catch (e) {
      console.error("TTS Error", e);
      return null;
  }
};