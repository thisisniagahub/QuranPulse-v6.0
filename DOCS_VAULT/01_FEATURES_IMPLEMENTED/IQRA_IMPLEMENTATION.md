# Iqra Digital Module: Technical Implementation Guide

> **Role:** Senior React Developer Report
> **Objective:** Build the core competitive moat (Iqra 1-6) with interactive learning.
> **Features:** Audio, Recording, Progress Tracking, Dashboard.
> **Stack:** React, Web Audio API, Supabase.

---

## 🏗️ PART 1: Data Structure

We structure data hierarchically: `Level` -> `Page` -> `Row`.

**File:** `src/modules/iqra/data/iqra-1.ts`
```typescript
export interface IqraRow {
  id: string; // "iqra-1-p1-r1"
  arabic: string; // "اَ  اَ  اَ"
  transliteration: string; // "A  A  A"
  audioUrl: string; // "/audio/iqra/1/page-1/row-1.mp3"
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface IqraPage {
  pageNumber: number;
  title?: string;
  rows: IqraRow[];
  objectives?: string[]; // "Kenal huruf Alif"
}

export interface IqraLevel {
  level: number;
  title: string;
  description: string;
  totalPages: number;
  pages: IqraPage[];
}

// Example Data (Static for performance, can be moved to DB later)
export const iqra1: IqraLevel = {
  level: 1,
  title: "Iqra Jilid 1",
  description: "Pengenalan huruf Hijaiyyah berbaris Fathah (Atas)",
  totalPages: 32,
  pages: [
    {
      pageNumber: 1,
      title: "Huruf Alif Fathah",
      rows: [
        {
          id: "iqra-1-p1-r1",
          arabic: "اَ  اَ  اَ  اَ  اَ",
          transliteration: "A-A-A-A-A",
          audioUrl: "/audio/iqra/1/1/1.mp3",
          difficulty: 'easy'
        },
        // ...
      ]
    }
  ]
};
```

---

## 🧩 PART 2: Core Components

### 1. The Reader Shell (`IqraReader.tsx`)
The Orchestrator. Manages page state and data fetching.

```typescript
// src/modules/iqra/features/reader/IqraReader.tsx
'use client'

export function IqraReader({ level }: { level: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  const { progress, updateProgress } = useIqraProgress(level, currentPage);

  // Load Data
  const pageData = IQRA_DATA[level].pages.find(p => p.pageNumber === currentPage);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
      <IqraHeader 
        title={`Iqra ${level} - Muka ${currentPage}`} 
        percentage={calculateLevelProgress(progress)} 
      />

      {/* Main Reading Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {pageData?.rows.map((row) => (
          <IqraRowCard
            key={row.id}
            row={row}
            status={progress[row.id]?.status || 'locked'}
            onComplete={(score) => updateProgress(row.id, score)}
          />
        ))}
      </div>

      <IqraPagination 
        current={currentPage} 
        total={IQRA_DATA[level].totalPages} 
        onNext={() => setCurrentPage(c => c+1)} 
      />
    </div>
  );
}
```

### 2. The Interactive Row (`IqraRowCard.tsx`)
The Atomic Unit. Handles Audio Playback and Recording trigger.

```typescript
export function IqraRowCard({ row, status, onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecordingModalOpen, setOpen] = useState(false);

  const playTeacherAudio = () => {
    const audio = new Audio(row.audioUrl);
    audio.play();
    setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
  };

  return (
    <div className={cn("p-6 rounded-2xl border transition-all", 
      status === 'completed' ? "border-green-500 bg-green-50/10" : "border-slate-200"
    )}>
      {/* Arabic Text */}
      <h3 className="text-4xl font-amiri text-center mb-4 leading-loose">
        {row.arabic}
      </h3>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button onClick={playTeacherAudio} variant="secondary" size="icon">
          {isPlaying ? <PauseIcon /> : <SpeakerIcon />}
        </Button>
        
        <Button onClick={() => setOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <MicIcon className="mr-2 h-4 w-4" /> Semak Bacaan
        </Button>
      </div>

      {/* Recording Modal (The Logic is in Part 3) */}
      <IqraRecorderModal 
        isOpen={isRecordingModalOpen} 
        rowId={row.id}
        expectedText={row.transliteration}
        onSuccess={(score) => onComplete(score)}
      />
    </div>
  );
}
```

---

## 🎙️ PART 3: Recording & Logic (`IqraRecorder.tsx`)

**Strategy:** MVP uses **Web Speech API** (Browser Native) for free pronunciation checking.
*Note: It's not perfect for Tajweed, but good for basic fluency.*

```typescript
export function IqraRecorder({ expectedText, onSuccess }) {
  const [feedback, setFeedback] = useState(null);

  const startRecord = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ar-SA'; // Arabic Mode
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      // Calculate Similarity (Levenshtein Distance)
      const score = calculateScore(transcript, expectedText); // 0-5 Stars
      
      setFeedback({ score, transcript });
      if (score >= 3) onSuccess(score);
    };
    
    recognition.start();
  };

  return (
    <DialogContent>
      <div className="text-center space-y-4">
        <RippleAnimation active={isRecording} />
        
        {feedback ? (
          <div className="animate-in fade-in zoom-in">
            <StarRating stars={feedback.score} />
            <p>{feedback.score >= 4 ? "MasyaAllah! Sempurna" : "Cuba lagi..."}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">Sila baca ayat ini dengan jelas.</p>
        )}
      </div>
    </DialogContent>
  );
}
```

---

## 🎣 PART 4: Progress Hook (`useIqraProgress`)

Persist logic to Supabase `iqra_progress`.

```typescript
export function useIqraProgress(level, page) {
  const supabase = useSupabase();
  const [progress, setProgress] = useState({});

  // Fetch
  useEffect(() => {
    supabase.from('iqra_progress')
      .select('*')
      .eq('book_level', level)
      .eq('page_number', page)
      .then(({ data }) => {
        // Map to Object: { 'row-1': { status: 'completed', stars: 5 } }
        /* mapping logic */
        setProgress(dataMap);
      });
  }, [level, page]);

  // Update
  const updateProgress = async (rowId, stars) => {
    const { error } = await supabase.from('iqra_progress').upsert({
      user_id: user.id,
      book_level: level,
      page_number: page,
      row_id: rowId,
      stars: stars,
      status: 'completed'
    });
    
    // Refresh local state optimistically
  };

  return { progress, updateProgress };
}
```

---

## 📊 PART 5: Teacher Dashboard

**View:** Summary of a student's journey.

```typescript
// src/modules/iqra/features/dashboard/TeacherView.tsx

export function TeacherDashboard() {
  // 1. Overall Completion Circle
  // 2. Weakest Rows (Low Stars)
  // 3. Activity Heatmap
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pages Mastered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12 / 32</div>
          <p className="text-xs text-muted-foreground">Iqra Level 1</p>
        </CardContent>
      </Card>
      
      {/* Weakness List */}
      <Card className="col-span-2">
        <CardHeader><CardTitle>Perlu Latihan</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>Level 1, Page 4: Huruf 'Jim' (Score: 2/5)</li>
            <li>Level 1, Page 7: Huruf 'Kha' (Score: 1/5)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 📦 PART 6: Audio Asset Strategy

**Recommendation:** Static Hosting (Public Folder).
**Structure:**
`/public/audio/iqra/1/01/01.mp3` (Level/Page/Row.mp3)

**Why?**
1.  **Zero Latency:** No API calls.
2.  **Zero Cost:** Served via Vercel CDN.
3.  **Offline Capable:** Easy to cache in Service Worker.

**Generation:**
*   Record voice actor reading rows.
*   OR use **ElevenLabs** batch process to generate once -> save as MP3.

---

## ✅ PART 7: Testing Checklist

1.  **Audio:** Does audio play on iOS (Silent switch ignored)?
2.  **Mic:** Does browser ask simpler permission?
3.  **State:** Does refreshing preserve 'Completed' green styling?
4.  **Offline:** Does it work in Airplane Mode (after first load)?
