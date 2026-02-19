// 🔌 NiagaHub Plugin SDK
// Copy this file into your QuranPulse project (e.g., src/plugins/niagahub.ts)
// This bridges your App with the NiagaHub SuperApp Brain.

export interface NiagaConfig {
  apiKey: string;
  endpoint: string; // e.g., "https://niagahub-superapp.vercel.app/api/adk"
}

export class NiagaHubPlugin {
  private config: NiagaConfig;

  constructor(config: NiagaConfig) {
    this.config = config;
  }

  /**
   * Ask the NiagaHub AI Squad to perform a task.
   * Useful for: "Analyze User Reading Habit", "Generate Tadabbur Content", etc.
   */
  async askSquad(prompt: string) {
    try {
      const res = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({ prompt })
      });
      return await res.json();
    } catch (error) {
      console.error("NiagaHub Link Failed:", error);
      throw error;
    }
  }

  /**
   * Get the URL for the Admin War Room
   * Embed this in an iframe or redirect admin users.
   */
  getAdminDashboardUrl() {
    return `${this.config.endpoint.replace('/api/adk', '')}/admin/agents`;
  }
}

// Example Usage in QuranPulse:
/*
  const niaga = new NiagaHubPlugin({ 
    apiKey: "sk_niaga_123", 
    endpoint: "http://localhost:3000/api/adk" 
  });

  // Trigger AI analysis on Quran data
  niaga.askSquad("Analyze user ID 555's reading pattern and suggest 3 Surahs").then(data => {
    console.log("Suggestion:", data.result);
  });
*/
