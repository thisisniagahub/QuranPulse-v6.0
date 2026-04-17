# 💰 Zero-Cost AI Architecture — Budget Optimization

> **Last Updated**: 21 Feb 2026
> **Status**: Draft
> **Module**: Core AI Platform

---

> **Philosophy:** We mimic Enterprise AI capabilities (Agents, Generative UI, Memory) using purely free-tier and open-source patterns. No monthly subscriptions.

## 1. Generative UI (The "Magic" Interface)
Instead of paying for A2UI/CopilotKit, we define our own **JSON Protocol**.

### How it works:
1.  **User:** "Saya nak bayar zakat."
2.  **Ustaz AI (Gemini Flash):** Detects intent. Instead of text, it outputs:
    ```json
    {
      "type": "widget",
      "component": "ZAKAT_CALC",
      "props": { "defaultType": "income" }
    }
    ```
3.  **React App:** Sees `type: widget` -> Renders `<ZakatCalculator />` inside the chat.
4.  **Cost:** RM0. (Just clever prompting).

---

## 2. The "Super Agent" Logic (Orchestrator)
We don't need LangChain. We use **TypeScript Logic Flow**.

### The Flow:
1.  **Context Loading:** Before calling AI, we fetch `user_profile` from Supabase.
2.  **Prompt Injection:** We tell Gemini: "User is level 2 Iqra. Adjust your answer."
3.  **Tool Execution:** If AI says "SEARCH_DB", our code runs the Supabase query.

---

## 3. Memory (The Brain)
We don't need Mem0 Cloud. We use **Supabase**.

*   **Short Term:** React Context (Chat History).
*   **Long Term:** Table `user_preferences` & `ai_knowledge_cache`.
*   **Vector Search:** `pgvector` in Supabase (Free tier supports ample vectors).

---

## 4. Implementation Roadmap

### Step 1: The "Widget Protocol"
Update `aiService.ts` to instruct Gemini to return JSON when it needs to show a UI element.

### Step 2: The Renderer
Create `<AIWidgetRenderer />` to switch between Text, Zakat Cards, Prayer Times, and Infaq Buttons.

### Step 3: The "Context Hook"
Ensure every AI call injects the user's `name`, `state` (for prayer times), and `subscription_status`.

---

**Verdict:** This architecture gives you 90% of the power of a RM500/month AI stack for **RM0**.

