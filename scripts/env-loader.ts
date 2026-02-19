import fs from 'fs';
import path from 'path';

try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        console.log("Loading .env from:", envPath);
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim();
                process.env[key] = value;
            }
        });
    } else {
        console.warn("⚠️ No .env file found!");
    }
} catch (e) {
    console.error("Error loading .env:", e);
}
