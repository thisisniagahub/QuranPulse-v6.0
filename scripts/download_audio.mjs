import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../public/audio/hijaiyah');

// Source: Open source Quranic audio repository
const BASE_URL = "https://github.com/semarketir/quran-json/raw/master/source/audio/"; 
// Note: This repo has numbered files 001.mp3 etc for Surah.
// For letters, we need a specific letter dataset.
// Let's use `islamic-network/cdn` letter sounds if available, or fetch from `arabic-keyboard.org` which we know works if downloaded directly (bypassing CORS).

const LETTER_URLS = {
    'alif': 'https://www.arabic-keyboard.org/sounds/alif.mp3',
    'ba': 'https://www.arabic-keyboard.org/sounds/baa.mp3',
    'ta': 'https://www.arabic-keyboard.org/sounds/taa.mp3',
    'tsa': 'https://www.arabic-keyboard.org/sounds/thaa.mp3',
    'jim': 'https://www.arabic-keyboard.org/sounds/jeem.mp3',
    'ha': 'https://www.arabic-keyboard.org/sounds/haa.mp3',
    'kho': 'https://www.arabic-keyboard.org/sounds/khaa.mp3',
    'dal': 'https://www.arabic-keyboard.org/sounds/dal.mp3',
    'dzal': 'https://www.arabic-keyboard.org/sounds/dhal.mp3',
    'ro': 'https://www.arabic-keyboard.org/sounds/raa.mp3',
    'zai': 'https://www.arabic-keyboard.org/sounds/zay.mp3',
    'sin': 'https://www.arabic-keyboard.org/sounds/seen.mp3',
    'syin': 'https://www.arabic-keyboard.org/sounds/sheen.mp3',
    'sod': 'https://www.arabic-keyboard.org/sounds/sad.mp3',
    'dhod': 'https://www.arabic-keyboard.org/sounds/dad.mp3',
    'tho': 'https://www.arabic-keyboard.org/sounds/taa2.mp3',
    'zho': 'https://www.arabic-keyboard.org/sounds/dha2.mp3',
    'ain': 'https://www.arabic-keyboard.org/sounds/ain.mp3',
    'ghain': 'https://www.arabic-keyboard.org/sounds/ghain.mp3',
    'fa': 'https://www.arabic-keyboard.org/sounds/fa.mp3',
    'qof': 'https://www.arabic-keyboard.org/sounds/qaf.mp3',
    'kaf': 'https://www.arabic-keyboard.org/sounds/kaf.mp3',
    'lam': 'https://www.arabic-keyboard.org/sounds/lam.mp3',
    'mim': 'https://www.arabic-keyboard.org/sounds/meem.mp3',
    'nun': 'https://www.arabic-keyboard.org/sounds/noon.mp3',
    'wau': 'https://www.arabic-keyboard.org/sounds/waw.mp3',
    'haa': 'https://www.arabic-keyboard.org/sounds/ha.mp3', // Marbutah/Simpul
    'ya': 'https://www.arabic-keyboard.org/sounds/ya.mp3',
    // Hamzah often shares Alif sound in basics
};

const downloadFile = (url, filename) => {
    const filePath = path.join(OUTPUT_DIR, filename);
    const file = fs.createWriteStream(filePath);

    https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded: ${filename}`);
        });
    }).on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete failed file
        console.error(`Error downloading ${filename}:`, err.message);
    });
};

console.log("Starting audio download...");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

Object.entries(LETTER_URLS).forEach(([name, url]) => {
    downloadFile(url, `${name}.mp3`);
});
