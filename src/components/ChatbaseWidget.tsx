import { useEffect } from 'react';

/**
 * Chatbase AI Chatbot Integration
 * Loads the Chatbase embed script for AI-powered chat support
 * 
 * User identification is supported via window.chatbase('identify', { token })
 * where token is a JWT signed with CHATBOT_IDENTITY_SECRET on the server
 */
export function ChatbaseWidget() {
  useEffect(() => {
    const chatbotId = import.meta.env.VITE_CHATBOT_ID;
    
    if (!chatbotId) {
      console.warn('Chatbase: VITE_CHATBOT_ID not set');
      return;
    }

    // Initialize chatbase proxy (exact format from Chatbase docs)
    if (!window.chatbase || (window as any).chatbase("getState") !== "initialized") {
      (window as any).chatbase = (...args: any[]) => {
        if (!(window as any).chatbase.q) {
          (window as any).chatbase.q = [];
        }
        (window as any).chatbase.q.push(args);
      };
      
      (window as any).chatbase = new Proxy((window as any).chatbase, {
        get(target: any, prop: string) {
          if (prop === "q") {
            return target.q;
          }
          return (...args: any[]) => target(prop, ...args);
        }
      });
    }

    // Load script (exact format from Chatbase docs)
    const loadScript = () => {
      // Check if script already exists
      if (document.getElementById(chatbotId)) {
        return;
      }
      
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = chatbotId;
      script.setAttribute("domain", "www.chatbase.co");
      document.body.appendChild(script);
    };

    if (document.readyState === "complete") {
      loadScript();
    } else {
      window.addEventListener("load", loadScript);
      return () => window.removeEventListener("load", loadScript);
    }
  }, []);

  return null; // Widget renders via script injection
}

// Utility function to identify user with Chatbase
// Call this after user logs in with JWT token from server
export function identifyChatbaseUser(token: string) {
  if ((window as any).chatbase) {
    (window as any).chatbase('identify', { token });
  }
}

export default ChatbaseWidget;
