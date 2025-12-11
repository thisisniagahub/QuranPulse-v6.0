# 📚 QuranPulse Project Documentation

Welcome to the **QuranPulse v6.0** knowledge base. Use this index to navigate our project documentation.

## 🗺️ Documentation Map
```mermaid
graph TD
    %% Levels
    subgraph STRATEGY [1. Strategic Direction]
        direction TB
        VISION(🔭 VISION.md<br/>The 'Why' & Identity)
        ROADMAP(🛣️ ROADMAP.md<br/>The 'When' & Milestones)
    end

    subgraph TECHNICAL [2. Technical Foundation]
        direction TB
        PRD(📘 PRD.md<br/>The 'What' - Specs)
        ARCH(🏛️ ARCHITECTURE.md<br/>The 'How' - System)
        COMPLIANCE(⚖️ COMPLIANCE.md<br/>The 'Law' - JAKIM/Act 326)
    end

    subgraph GUIDES [3. Developer Guides]
        direction TB
        README(🚀 README.md<br/>Setup & Start)
        TESTING(🧪 TESTING.md<br/>QA & Tests)
        BACKEND(🤖 BACKEND_README.md<br/>Supabase & Edge)
    end

    %% Connections
    VISION --> ROADMAP
    ROADMAP --> PRD
    PRD --> ARCH
    ARCH --> BACKEND
    PRD --> TESTING
    COMPLIANCE -.->|Governs| PRD
```


## 🧭 Strategic Direction (Hala Tuju)
Where are we going and why?
- **[🔭 VISON & MANIFESTO](./VISION.md)**: The "Soul" of the project. Our Mission and "Cyber-Islamic" Identity.
- **[🛣️ ROADMAP](./ROADMAP.md)**: The "Time". Phases, milestones, and deadlines.

## 🏗️ Technical Foundation
How are we building it?
- **[📘 PRODUCT REQUIREMENTS (PRD)](./PRD.md)**: The "Bible". Comprehensive specifications for every feature.
- **[🏛️ ARCHITECTURE](./Architecture.md)**: The "Skeleton". System diagrams, tech stack, and data flow.
- **[⚖️ COMPLIANCE GUIDELINES](./COMPLIANCE_GUIDELINES.md)**: The "Law". JAKIM Act 326 standards and sacred text handling.

## 🛠️ Developer Guides
How do I contribute?
- **[🚀 README](./README.md)**: Getting started, installation, and setup.
- **[🧪 TESTING](./TESTING.md)**: How to run tests and ensure quality.
- **[🤖 BACKEND GUIDE](./BACKEND_README.md)**: Supabase and Edge Function details.

---
> *Tip: Start with `VISION.md` to understand the "Why", then `ROADMAP.md` for the "When", and `PRD.md` for the "What".*
