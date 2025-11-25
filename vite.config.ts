import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars. The '' third argument loads all vars regardless of prefix (e.g. API_KEY)
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Securely inject ONLY the API Key.
      // Do NOT map 'process.env': process.env as it leaks all server secrets to the client.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      
      // Polyfill process.env as an empty object to prevent crashes in legacy code
      // that might access process.env.SOMETHING_ELSE
      'process.env': {} 
    },
    server: {
      host: true
    }
  };
});