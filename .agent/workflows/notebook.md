---
description: NotebookLM full automation — create notebooks, upload sources, generate ALL 10 Studio outputs (Audio/Video/Mind Maps/Reports/Slides/Infographics/Flashcards/Quiz/Data Table/Notes), query with citations.Use when user wants to interact with Google NotebookLM.
---

# /notebook — NotebookLM Full Automation 📓🧠

// turbo-all

User gives task → Agent handles EVERYTHING via browser automation.
NotebookLM = Source-Grounded AI Research Workspace (zero hallucination by design).

---

## Architecture: 3-Panel Model

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   SOURCES    │ →  │     CHAT     │ →  │    STUDIO    │
│   (Input)    │    │(Understanding)│    │   (Output)   │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ Upload docs  │    │ Ask questions│    │ Audio Overview│
│ PDFs, URLs   │    │ Get citations│    │ Video Overview│
│ Audio, Images│    │ Filter by    │    │ Mind Maps    │
│ YouTube      │    │ source       │    │ Reports      │
│ Paste text   │    │              │    │ Slide Decks  │
│              │    │              │    │ Infographics │
│              │    │              │    │ Flashcards   │
│              │    │              │    │ Notes        │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## Prerequisites
- Google account logged in on browser (first-time only)
- NotebookLM URL: https://notebooklm.google.com

## Source Types & Limits

| Type | Supported Formats | Limit |
|------|-------------------|-------|
| Google Workspace | Docs, Slides (≤100), Sheets (≤100k tokens) | Per notebook plan |
| Files | PDF, Word (.docx), Text (.txt), Markdown (.md) | 500K words / 200MB per source |
| Media | Audio (MP3/WAV), Images (JPG/PNG/HEIC) | 500K words / 200MB per source |
| Web | URLs, YouTube (with captions) | Auto-extracted |
| Text | Clipboard paste | Direct paste |

**Notebook Capacity:** Up to 300 sources (Plus plan), 50 sources (Free plan)

---

## Workflow Steps

### Step 1: Open NotebookLM
```
browser_subagent:
  Task: "Navigate to https://notebooklm.google.com. 
         Check if logged in. If login page appears, report back.
         If logged in, report what notebooks exist on the page."
```

If NOT logged in → ask user to login once via browser, then resume.

### Step 2: Determine Task
Parse user request into action:

| User Says | Action | Panel |
|-----------|--------|-------|
| "buat notebook baru" | Create new notebook | Sources |
| "upload docs ni" | Add sources to notebook | Sources |
| "explain this codebase" | Compile code → upload → query | Sources + Chat |
| "tanya NotebookLM tentang..." | Query existing notebook | Chat |
| "buat audio overview" | Generate Audio Overview | Studio |
| "buat video overview" | Generate Video Overview | Studio |
| "buat mind map" | Generate Mind Map | Studio |
| "buat report/laporan" | Generate Report | Studio |
| "buat slides/presentation" | Generate Slide Deck | Studio |
| "buat infographic" | Generate Infographic | Studio |
| "buat flashcards/quiz" | Generate Flashcards & Quiz | Studio |
| "summarize project" | Compile → upload → summarize | Full Pipeline |
| "set language ke Malay" | Change output language | Settings |

### Step 3: Prepare Content (if uploading)
For code/docs upload, compile sources first:

**Option A: Single Mega-Doc**
```
1. Scan project for .md, .ts, .tsx files
2. Compile into single markdown document
3. Save to temp file
4. Upload via browser (paste text method)
```

**Option B: Multiple Sources**
```
1. Identify key files (README, ARCHITECTURE, key source files)
2. Copy each to temp location
3. Upload each as separate source via browser
```

**Option C: Paste Text**
```
1. Read file content
2. Use browser to paste into NotebookLM "Paste text" option
3. Repeat for multiple sources (max 50 free / 300 plus)
```

**Option D: URL/YouTube**
```
1. Collect URLs from user or via web search
2. Use browser to add via "Website" or "YouTube" source option
3. NotebookLM auto-extracts content with captions
```

### Step 4: Execute via Browser

**Create Notebook:**
```
browser_subagent:
  Task: "On NotebookLM page, click 'Create new' button.
         Wait for new notebook to load.
         Close the 'Add source' modal if it appears (aria-label='Close').
         Click on the title area (top-left), select all text, type '<title>'.
         Press Enter to save. Return the notebook URL."

  # VERIFIED SELECTORS (2026-02-10):
  # Create: button[aria-label="Create new notebook"]
  # Close modal: button[aria-label="Close"]
  # Title: click_pixel at (134, 37) then Ctrl+A, type, Enter
```

**Upload Source (Paste Text):**
```
browser_subagent:
  Task: "In the current notebook, click 'Add source' button.
         Select 'Copied text' option (4th drop-zone button).
         In the textarea (aria-label='Pasted text'), set value to: <content>
         Dispatch input event.
         Click Insert button (mat-mdc-unelevated-button.mat-primary).
         Wait for processing.
         To rename: click source → More menu → Rename source → type name → Save."

  # VERIFIED SELECTORS (2026-02-10):
  # Add source: button[aria-label="Add source"]
  # Copied text: .drop-zone-icon-button (4th/index 3)
  # Text area: textarea[aria-label="Pasted text"]
  # Insert: button.mat-mdc-unelevated-button.mat-primary
  # Source item: .single-source-container
  # More menu: button[aria-label="More"]
  # Rename: button[role="menuitem"] (2nd item)
```

**Upload Source (URL):**
```
browser_subagent:
  Task: "In the current notebook, click 'Add source' or '+'.
         Select 'Website'.
         Enter URL: <url>
         Confirm upload. Wait for processing."
```

**Upload Source (File):**
```
browser_subagent:
  Task: "In the current notebook, click 'Add source' or '+'.
         Select 'Upload' or file upload option.
         Upload file from: <file_path>
         Wait for processing to complete."
```

**Query Notebook (Chat Panel):**
```
browser_subagent:
  Task: "In the NotebookLM chat panel, click on the input area.
         Type: '<user question>'
         Click submit button or press Enter.
         Wait 5 seconds for response to fully generate.
         Return the full response text including any citations [1][2] etc."

  # VERIFIED SELECTORS (2026-02-10):
  # Chat input: click_pixel at (455, 926)
  # Submit: click_pixel at (701, 926)
  # Response includes clickable citations grounded in sources
```

---

## Studio Output Generation

### 🎙️ Audio Overview
AI-hosted deep-dive discussion. Interactive — user can ask follow-ups mid-playback.

**Customization Options:**

| Option | Values |
|--------|--------|
| Format | Deep Dive, Brief, Critique, Debate |
| Language | 80+ languages (Malay, English, Arabic, etc.) |
| Length | Short, Default |
| Focus Steering | Specific source, topic, or target audience |

```
browser_subagent:
  Task: "In the Studio panel (right side), find 'Audio Overview'.
         Click 'Customize' or settings icon if available.
         Set format to '<format>' (Deep Dive/Brief/Critique/Debate).
         Set language to '<language>'.
         Set length to '<length>' (Short/Default).
         If focus prompt needed, enter: '<steering prompt>'
         Click 'Generate'. Wait for generation to start.
         Report status and estimated time."
```

**Focus Steering Examples:**
- "Focus on the authentication architecture"
- "Explain as if talking to a junior developer"
- "Compare competitor pricing strategies"
- "Debate the pros and cons of the serverless approach"

### 🎬 Video Overview
Visual walkthrough using source images. AI narration. MP4 export.

```
browser_subagent:
  Task: "In the Studio panel, find 'Video Overview' option.
         Click to generate.
         If customization options appear:
           Set language to '<language>'
           Set any focus/topic if available
         Click 'Generate'. Wait for generation to start.
         Report status."
```

### 🧠 Mind Map
Visual concept graph. Click nodes to ask targeted questions.

```
browser_subagent:
  Task: "In the Studio panel, find 'Mind Map' option.
         Click to generate.
         Wait for mind map to render.
         Take a screenshot of the generated mind map.
         Report the main nodes/concepts visible."
```

**Best for:** Systems thinking, exam prep, architecture breakdowns

### 📄 Report
Pre-built formats (FAQ, Timeline, Guide) or custom report generation.

```
browser_subagent:
  Task: "In the Studio panel, find 'Report' or document generation option.
         Select format: '<format>' (FAQ/Timeline/Study Guide/Briefing/Custom).
         If custom, enter prompt: '<custom instructions>'
         Click 'Generate'. Wait for report to complete.
         Return the report content or take a screenshot."
```

**Pre-built Report Formats:**
- FAQ — Auto-generated Q&A from sources
- Timeline — Chronological event summary
- Study Guide — Structured learning material
- Briefing Document — Executive summary
- Custom — User-defined format via prompt

### 📊 Slide Deck
Detailed or presenter-style slides. PDF export + full-screen presentation.

```
browser_subagent:
  Task: "In the Studio panel, find 'Slide Deck' or presentation option.
         Select style: '<style>' (Detailed/Presenter).
         Set tone if available.
         Click 'Generate'. Wait for slides to complete.
         Report number of slides generated.
         Take a screenshot of the first slide."
```

### 📈 Infographic
One-page visual summary. Orientation + detail control. PNG export.

```
browser_subagent:
  Task: "In the Studio panel, find 'Infographic' option.
         Set orientation: '<orientation>' (Portrait/Landscape).
         Set detail level if available.
         Click 'Generate'. Wait for infographic to render.
         Take a screenshot."
```

### 🎯 Flashcards & Quiz
Adjustable difficulty and length. "Explain" button for concept reinforcement.

```
browser_subagent:
  Task: "In the Studio panel, find 'Flashcards' or 'Quiz' option.
         Set difficulty: '<difficulty>' (Easy/Medium/Hard).
         Set number of cards if available.
         Click 'Generate'. Wait for flashcards to appear.
         Return the first 5 flashcard Q&A pairs."
```

### 📝 Notes (Save & Organize)
Manual notes or saved chat responses. Up to 1,000 notes per notebook.

```
browser_subagent:
  Task: "In the notebook, find 'Add note' or notes section.
         Create a new note with title: '<title>'
         Content: '<content>'
         Save the note."
```

**Note:** Saved chat notes are immutable (audit-friendly).

### 📊 Data Table
Structured data extraction from sources into tabular format.

```
browser_subagent:
  Task: "In the Studio panel, find 'Data Table' option.
         Click to generate.
         Wait for table to render.
         Take a screenshot of the generated table.
         Return the table headers and first 5 rows of data."
```

**Best for:** Comparing data points, extracting structured info from unstructured sources

---

## Multilingual Output

NotebookLM can generate outputs in any language, independent of source language.

```
browser_subagent:
  Task: "In the notebook settings (gear icon or settings),
         Find 'Output Language' or language settings.
         Change to '<target language>' (e.g., Bahasa Melayu, العربية).
         Confirm the setting."
```

**Key Points:**
- Language override applies to outputs, NOT the original sources
- Same source material → outputs in multiple languages
- Single notebook = multilingual knowledge hub
- Ideal for: regional teams, global audiences, Islamic education (Arabic + Malay)

---

## Sharing & Collaboration

**Share Notebook:**
```
browser_subagent:
  Task: "Click the 'Share' button on the notebook.
         Set sharing mode: '<mode>' (Viewer/Editor/Public link).
         Add collaborators: <email list>
         Confirm sharing settings."
```

**Sharing Limits:**
- Personal accounts: up to 50 collaborators
- Enterprise/Education: unlimited users + groups
- Can share: Audio Overviews, Video Overviews, entire notebooks

---

## Smart Workflows

### 🔬 "Explain My Codebase"
```
1. Scan project structure (find_by_name for .ts, .tsx, .md)
2. Read key files (README, package.json, main components)
3. Compile into structured doc:
   - Project overview
   - Architecture diagram
   - Key modules + responsibilities
   - API routes + endpoints
   - Database schema
4. Upload to new NotebookLM notebook
5. Generate Audio Overview (Deep Dive format)
6. Generate Mind Map for architecture visualization
```

### 🔍 "Research This Topic"
```
1. Search web for topic (search_web tool)
2. Compile findings into structured notes
3. Create NotebookLM notebook
4. Upload research as multiple sources
5. Query for insights with citations
6. Generate Report (Briefing format)
```

### 📚 "Study Session"
```
1. Upload user's docs/notes as sources
2. Generate Study Guide report
3. Generate Flashcards (Medium difficulty)
4. Generate Audio Overview (Brief format) for listening
5. Generate Mind Map for concept visualization
```

### 🏢 "Competitor Analysis"
```
1. Compile competitor data from project files
2. Search web for latest competitor info
3. Upload all as sources to new notebook
4. Generate Report (custom: competitive analysis)
5. Generate Slide Deck for presentation
6. Query: "What are our main competitive advantages?"
```

### 🕌 "Islamic Content Deep Dive"
```
1. Compile Quran/Hadith/Tafsir sources
2. Upload to NotebookLM
3. Set output language to Arabic + Malay
4. Generate Audio Overview (Deep Dive, Arabic)
5. Generate Study Guide report
6. Generate Flashcards for memorization
```

### 📋 "Project Status Report"
```
1. Compile project docs (CHANGELOG, STATUS, architecture)
2. Upload to NotebookLM
3. Generate Report (Briefing format)
4. Generate Slide Deck (Presenter style)
5. Generate Infographic (one-page summary)
```

---

## Example Triggers

```
User: "upload semua QuranPulse docs ke NotebookLM"
Agent: [compile docs] → [open NotebookLM] → [create notebook] → [upload] → ✅

User: "buat audio overview tentang projek ni, dalam Bahasa Melayu, format debate"
Agent: [compile context] → [upload] → [set language: Malay] → [set format: Debate] → [generate audio] → ✅

User: "buat mind map architecture projek ni"
Agent: [compile architecture docs] → [upload] → [generate mind map] → [screenshot] → ✅

User: "buat presentation slides untuk pitch deck"
Agent: [compile key docs] → [upload] → [generate slide deck: Presenter style] → ✅

User: "buat flashcards untuk study Surah Al-Baqarah"
Agent: [upload surah content] → [generate flashcards: Medium] → ✅

User: "buat report competitor analysis"
Agent: [compile competitor data] → [upload] → [generate report: Custom competitive analysis] → ✅

User: "tanya NotebookLM macam mana nak optimize React app"
Agent: [open notebook] → [type query in chat] → [return cited answer] → ✅

User: "buat video overview projek untuk team presentation"
Agent: [compile docs] → [upload] → [generate video overview] → ✅
```

---

## Report Back Template
```
📓 NotebookLM Task Complete:
  - Action: <what was done>
  - Notebook: <name/URL>
  - Sources: <count> sources uploaded
  - Studio Outputs: <what was generated>
  - Language: <output language used>
  - Result: <response/status/screenshot>
```

---

## Key Differences from Generic LLMs

| Feature | NotebookLM | ChatGPT/Gemini/Claude |
|---------|-----------|----------------------|
| Grounding | Source-only (zero hallucination) | Pretrained weights + optional RAG |
| Citations | Clickable, traceable to exact source | Optional, not native |
| Workspace | Project-scoped notebooks | Linear conversation |
| Outputs | 8 artifact types (Audio/Video/Maps/etc) | Text + code only |
| Collaboration | Share notebooks + outputs | Share conversations |
| Multilingual | Output language independent of source | Same as conversation |

---

*Last Updated: 2026-02-10*
*Source: NotebookLM Article by Shanmugavelu Munivelu (LinkedIn, Feb 2026)*