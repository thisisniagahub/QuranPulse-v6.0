import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const getEnv = (key: string): string => {
    return process.env[key] || '';
};

export const getEnvBool = (key: string): boolean => {
    const val = getEnv(key).toLowerCase();
    return val === 'true' || val === '1' || val === 'yes';
};
