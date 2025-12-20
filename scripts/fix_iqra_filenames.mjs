import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, '../public/iqra-guides/iqra-1');

try {
    const files = fs.readdirSync(DIR);
    files.forEach(file => {
        if (file.startsWith('Page_')) {
            const newName = file.replace('Page_', 'page_');
            fs.renameSync(path.join(DIR, file), path.join(DIR, newName));
            console.log(`Renamed: ${file} -> ${newName}`);
        }
    });
    console.log("Renaming complete.");
} catch (err) {
    console.error("Error renaming files:", err);
}
