import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export type AgentRole = 'planner' | 'executor' | 'reviewer';

export interface AgentConfig {
  name: string;
  role: AgentRole;
  systemPrompt: string;
}

export class AdkAgent {
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  async run(input: string, context: any): Promise<string> {
    // Uses GOOGLE_GENERATIVE_AI_API_KEY from .env.local automatically
    const model = google('models/gemini-1.5-flash');
    
    const dynamicPrompt = `${this.config.systemPrompt}\n\nCONTEXT: ${JSON.stringify(context)}`;

    const result = await generateText({
      model,
      system: dynamicPrompt,
      prompt: input,
    });

    return result.text;
  }
}