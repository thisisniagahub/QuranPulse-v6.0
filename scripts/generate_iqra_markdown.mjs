import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JSON_DIR = path.join(__dirname, '../public/iqra_json');
const OUTPUT_BASE_DIR = path.join(__dirname, '../docs/iqra-guides');

// 1. LETTER MAPPING (Enhanced for details)
const LETTER_MAP = {
  'أ': { name: 'ALIF', shape: 'Tiang Tegak', sound: 'A!', trait: 'Jelas & Tajam', rumi: 'A' },
  'ا': { name: 'ALIF', shape: 'Tiang Tegak', sound: 'A!', trait: 'Jelas & Tajam', rumi: 'A' },
  'ب': { name: 'BA', shape: 'Mangkuk (Titik Bawah)', sound: 'BA!', trait: 'Bibir Rapat', rumi: 'BA' },
  'ت': { name: 'TA', shape: 'Mangkuk (2 Titik Atas)', sound: 'TA!', trait: 'Lidah di gigi', rumi: 'TA' },
  'ث': { name: 'TSA', shape: 'Mangkuk (3 Titik)', sound: 'TSA!', trait: 'Hujung lidah', rumi: 'TSA' },
  'ج': { name: 'JIM', shape: 'Perut Buncit (1 Titik)', sound: 'JA!', trait: 'Tengah lidah', rumi: 'JA' },
  'ح': { name: 'HA', shape: 'Perut Buncit (Kosong)', sound: 'HA!', trait: 'Pedas / Bersih', rumi: 'HA' },
  'خ': { name: 'KHO', shape: 'Perut Buncit (Titik Atas)', sound: 'KHO!', trait: 'Garr (Kahak)', rumi: 'KHO' },
  'د': { name: 'DAL', shape: 'Siku Tajam', sound: 'DA!', trait: 'Lidah belakang gigi', rumi: 'DA' },
  'ذ': { name: 'DZAL', shape: 'Siku (Titik Atas)', sound: 'DZA!', trait: 'Lembut', rumi: 'DZA' },
  'ر': { name: 'RO', shape: 'Bulan Sabit', sound: 'RO!', trait: 'Getar', rumi: 'RO' },
  'ز': { name: 'ZAI', shape: 'Sabit (Titik Atas)', sound: 'ZA!', trait: 'Desir Lebah', rumi: 'ZA' },
  'س': { name: 'SIN', shape: 'Gigi 3', sound: 'SA!', trait: 'Desir Ular', rumi: 'SA' },
  'ش': { name: 'SYIN', shape: 'Gigi 3 (3 Titik)', sound: 'SYA!', trait: 'Sebar Angin', rumi: 'SYA' },
  'ص': { name: 'SOD', shape: 'Kepala & Mangkuk', sound: 'SO!', trait: 'Tebal & Kuat', rumi: 'SO' },
  'ض': { name: 'DHOD', shape: 'Kepala (Titik)', sound: 'DHO!', trait: 'Tepi Lidah', rumi: 'DHO' },
  'ط': { name: 'THO', shape: 'Tiang & Perut', sound: 'THO!', trait: 'Langit-langit', rumi: 'THO' },
  'ظ': { name: 'ZHO', shape: 'Tiang (Titik)', sound: 'ZHO!', trait: 'Lidah Keluar Sikit', rumi: 'ZHO' },
  'ع': { name: 'AIN', shape: 'Kepala Burung', sound: 'A\'A!', trait: 'Tekak Tengah', rumi: 'AIN' },
  'غ': { name: 'GHAIN', shape: 'Burung (Titik)', sound: 'GHO!', trait: 'Air Kumur', rumi: 'GHAIN' },
  'ف': { name: 'FA', shape: 'Kepala Bulat (1 Titik)', sound: 'FA!', trait: 'Gigi di bibir', rumi: 'FA' },
  'ق': { name: 'QOF', shape: 'Kepala Bulat (2 Titik)', sound: 'QO!', trait: 'Pangkal Lidah', rumi: 'QO' },
  'ك': { name: 'KAF', shape: 'Bentuk L', sound: 'KA!', trait: 'Angin sikit', rumi: 'KA' },
  'ل': { name: 'LAM', shape: 'Mata Kail', sound: 'LA!', trait: 'Hujung Lidah', rumi: 'LA' },
  'م': { name: 'MIM', shape: 'Kepala Bawah', sound: 'MA!', trait: 'Bibir Rapat', rumi: 'MA' },
  'ن': { name: 'NUN', shape: 'Mangkuk Dalam (1 Titik)', sound: 'NA!', trait: 'Hidung Dengung', rumi: 'NA' },
  'و': { name: 'WAU', shape: 'Kepala Wau', sound: 'WA!', trait: 'Bibir Bulat', rumi: 'WA' },
  'ه': { name: 'HA', shape: 'Simpul', sound: 'HA!', trait: 'Dada', rumi: 'HA' },
  'ء': { name: 'HAMZAH', shape: 'Kepala Ain Kecil', sound: 'A!', trait: 'Putus', rumi: 'A' },
  'ي': { name: 'YA', shape: 'Angsa / Titik Bawah', sound: 'YA!', trait: 'Tengah Lidah', rumi: 'YA' },
  'ى': { name: 'ALIF MAKSURAH', shape: 'Angsa Tanpa Titik', sound: 'A!', trait: 'Panjang Sikit', rumi: 'A' }
};

// Helper to determine focus letters for the page
function getFocusLetters(content) {
  const letters = new Set();
  const text = content.join(' ');
  const matches = text.match(/[\u0600-\u06FF]/g);
  if (matches) {
    matches.forEach(l => {
      if (LETTER_MAP[l]) letters.add(l);
    });
  }
  return Array.from(letters).slice(0, 2);
}

// Helper to generate pedagogical focus text
function getFocusText(lineIndex, totalLines, isMixed, char1, char2) {
    if (lineIndex === 0) return `Perbezaan bentuk ${char1.name} & ${char2 ? char2.name : '...'}.`;
    if (lineIndex === totalLines - 1) return "Ujian Akhir: Kelancaran sebelum pindah MS.";
    if (isMixed) return "Latihan tukar bunyi secara berselang-seli.";
    return "Pengukuhan (Reinforcement).";
}

function generatePageMarkdown(pageData, iqraLevel) {
  const pageNum = pageData.page;
  const title = pageData.title || `Iqra ${iqraLevel} - Muka Surat ${pageNum}`;
  const contentLines = pageData.content;
  
  const focusLetters = getFocusLetters(contentLines);
  const letter1 = LETTER_MAP[focusLetters[0]] || { name: 'Huruf', shape: 'Bentuk Khusus', sound: 'Bunyi', trait: 'Sifat', rumi: '?' };
  const letter2 = focusLetters[1] ? (LETTER_MAP[focusLetters[1]] || { name: 'Huruf', shape: 'Bentuk Khusus', sound: 'Bunyi', trait: 'Sifat', rumi: '?' }) : null;

  // Mermaid Graph Construction
  let mermaidGraph = `graph LR
A[Huruf ${focusLetters[0] || '?'} - ${letter1.name}] --> A1(Bentuk: ${letter1.shape})
A --> A2(Bunyi: ${letter1.sound})
A --> A3(Sifat: ${letter1.trait})`;

  if (letter2) {
    mermaidGraph += `
B[Huruf ${focusLetters[1]} - ${letter2.name}] --> B1(Bentuk: ${letter2.shape})
B --> B2(Bunyi: ${letter2.sound})
B --> B3(Sifat: ${letter2.trait})`;
  }

  // Table Rows Construction
  let boxStructureRows = '';
  // Add Header Row (TAJUK) if applicable, or just start with Baris 1
  // The user example has "TAJUK" as a row. We'll simulate this with the first line of content or generic if not enough content.
  
  contentLines.forEach((line, index) => {
    // Basic splitting logic
    // Usually Iqra lines are space-separated blocks.
    // e.g. "Ba A Ba" -> [Ba, A, Ba]
    let segments = line.replace(/\s+/g, ' ').trim().split(' ');
    
    // Create logical "Right Box" and "Left Box"
    // If line has 4 items: Right=[0,1], Left=[2,3]
    // If 3 items: Right=[0,1], Left=[2]
    // If 2 items: Right=[0], Left=[1]
    
    let mid = Math.ceil(segments.length / 2);
    let rightBox = segments.slice(0, mid).join(' - ');
    let leftBox = segments.slice(mid).join(' - ');
    
    if (!leftBox) leftBox = "(Tiada)";

    // Determine focus text
    // Check if line has mixed characters
    const uniqueCharsInLine = new Set(line.match(/[\u0600-\u06FF]/g));
    const isMixed = uniqueCharsInLine.size > 1;
    
    let rowLabel = `Baris ${index + 1}`;
    if (index === 0) rowLabel = "TAJUK"; // Use first line as Tajuk/Intro row per example style

    const focusText = getFocusText(index, contentLines.length, isMixed, letter1, letter2);

    boxStructureRows += `| ${rowLabel} | ${rightBox} | ${leftBox} | ${focusText} |
`;
  });

  // Check if we need to pad with "Baris 1" if we used the first line as TAJUK
  // Actually, let's strictly follow the content.

  return `# Panduan Bimbingan Iqra ${iqraLevel} - Muka Surat ${pageNum}
## ${title}

---

### Diagram Aliran Bacaan (Kanan ke Kiri)
Dalam setiap kotak, anda perlu mula membaca dari arah anak panah ini:
\`\`\`
[ 3 ] <--- [ 2 ] <--- [ 1 ]
\`\`\`

### Diagram Struktur Kotak (Baris demi Baris)

| Baris | Kotak Kanan (Mula Sini) | Kotak Kiri (Seterusnya) | Fokus Latihan |
| :--- | :--- | :--- | :--- |
${boxStructureRows}

### Diagram Perbandingan Karakter (Identiti Huruf)
\`\`\`mermaid
${mermaidGraph}
\`\`\`

### Diagram "Checklist" Kelancaran
Untuk menganggap diri anda sudah "paham" dan "lulus" muka surat ini, anda perlu pastikan:

- [ ] **Arah Benar:** Mata bergerak dari kanan ke kiri tanpa tertukar.
- [ ] **Bunyi Pendek:** Tidak membaca Aaaaa (2 harakat), tapi ${letter1.sound} (1 harakat).
- [ ] **Kenal Titik:** Pantas bezakan ${letter1.name} (${letter1.shape})${letter2 ? ` dengan ${letter2.name} (${letter2.shape})` : ''}.
- [ ] **Kelajuan Tetap:** Boleh baca Baris Akhir tanpa berhenti atau berfikir lama.

### Ringkasan Untuk Anda
Bayangkan imej ini sebagai satu set latihan "Gym" untuk mata. Baris atas adalah *warm-up*, dan baris paling bawah adalah *heavy lifting*. Jika anda sudah boleh sebut baris terakhir **"${contentLines[contentLines.length-1] || '...'}"** dengan sekali nafas dan kelajuan yang stabil, bermakna saraf otak anda sudah berjaya menterjemah kod visual Arab tersebut dengan sempurna!

---
*Generated by QuranPulse AI Engine*
`;
}

// Main Execution
const iqraFiles = [1, 2, 3, 4, 5, 6];

iqraFiles.forEach(level => {
    const inputFile = path.join(JSON_DIR, `iqra-${level}.json`);
    const outputDir = path.join(OUTPUT_BASE_DIR, `iqra-${level}`);
    
    if (fs.existsSync(inputFile)) {
        try {
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            const rawData = fs.readFileSync(inputFile, 'utf-8');
            const jsonData = JSON.parse(rawData);
            const key = `Iqra_${level}`; // Key inside JSON (e.g. "Iqra_1")
            const pages = jsonData[key];

            if (pages) {
                pages.forEach(page => {
                    const markdownContent = generatePageMarkdown(page, level);
                    const filename = `page_${String(page.page).padStart(2, '0')}.md`;
                    fs.writeFileSync(path.join(outputDir, filename), markdownContent);
                    // console.log(`Generated: Iqra ${level}/${filename}`);
                });
                console.log(`✅ Success: Iqra ${level} guides generated in ${outputDir}`);
            } else {
                console.warn(`⚠️ Warning: Key '${key}' not found in ${inputFile}`);
            }

        } catch (err) {
            console.error(`❌ Error processing Iqra ${level}:`, err);
        }
    } else {
        console.log(`ℹ️ Info: ${inputFile} not found, skipping.`);
    }
});
