/**
 * 🛡️ UNIVERSAL ENVIRONMENT LOADER
 * Handles safe access to env variables in both Client (Vite) and Server (Node/TS-Node) environments.
 */

export const getEnv = (key: string): string => {
    // 1. Try Vite (Client-side)
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
        return import.meta.env[key];
    }

    // 2. Try Node.js (Server-side / Scripts)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key];
    }

    // 3. Fallback (Optional: Log warning)
    // console.warn(`[Env] Missing key: ${key}`);
    return '';
};

// Helper for Boolean flags
export const getEnvBool = (key: string): boolean => {
    const val = getEnv(key).toLowerCase();
    return val === 'true' || val === '1' || val === 'yes';
};
