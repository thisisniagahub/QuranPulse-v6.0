import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'src');

const replacements = [
    { regex: /cyan/g, replace: 'teal' },
    { regex: /purple/g, replace: 'emerald' },
    { regex: /fuchsia/g, replace: 'amber' },
    { regex: /indigo/g, replace: 'teal' },
    { regex: /violet/g, replace: 'emerald' },
    { regex: /Noor-e-Cyber/gi, replace: 'Raudhah' },
];

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modifiedCount = 0;

walkDir(directoryPath, function (filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        replacements.forEach(({ regex, replace }) => {
            content = content.replace(regex, replace);
        });

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            modifiedCount++;
            // console.log(`Updated: ${filePath.replace(__dirname, '')}`);
        }
    }
});

console.log(`Total files updated: ${modifiedCount}`);
