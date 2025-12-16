import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5173,
        host: '0.0.0.0',
        proxy: {
          '/ollama': {
            target: 'http://localhost:11434',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/ollama/, ''),
          },
        },
      },
      plugins: [
        react(),
        // Custom Middleware to Proxy Gemini CLI
      {
        name: 'gemini-cli-proxy',
        configureServer(server) {
          server.middlewares.use('/api/gemini-cli', async (req, res, next) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk);
              req.on('end', async () => {
                try {
                  const { prompt } = JSON.parse(body);
                  const { exec } = await import('child_process');
                  // Execute the gemini command. Note: We use 'gemini prompt' or similar depending on the CLI syntax. 
                  // Assuming 'gemini chat "message"' or piping input.
                  // Based on typical CLIs, we'll try piping the prompt to it or using arguments.
                  // Let's assume `gemini prompt "TEXT"` works based on version 0.20.x patterns.
                  // Use a safe quoting mechanism
                  const safePrompt = prompt.replace(/"/g, '\\"');
                  
                  // Executing command with -p flag using ABSOLUTE path to avoid module resolution issues
                  // We use the .cmd shim for Windows
                  const geminiPath = `C:\\Users\\megat\\AppData\\Roaming\\npm\\gemini.cmd`;
                  exec(`"${geminiPath}" -p "${safePrompt}"`, (error, stdout, stderr) => {
                    if (error) {
                      console.error('Gemini CLI Error:', stderr);
                      res.statusCode = 500;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ error: stderr || error.message }));
                      return;
                    }
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ text: stdout.trim() }));
                  });
                } catch (e) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Invalid Request' }));
                }
              });
            } else {
              next();
            }
          });
        }
      },
      VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
          workbox: {
              navigateFallbackDenylist: [/^\/api/], // Ignore API routes for Service Worker
              runtimeCaching: [
                  {
                      urlPattern: ({ request }) => request.destination === 'image',
                      handler: 'CacheFirst',
                      options: {
                          cacheName: 'images',
                          expiration: {
                              maxEntries: 10,
                              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
                          },
                      },
                  },
                  {
                      // Fix 206 Partial Content errors for Video/Audio
                      urlPattern: ({ request }) => request.destination === 'video' || request.destination === 'audio',
                      handler: 'NetworkOnly', 
                  }
              ]
          },
          manifest: {
            name: 'QuranPulse',
            short_name: 'QuranPulse',
            description: 'Your Complete Islamic Lifestyle Companion',
            theme_color: '#0f172a',
            background_color: '#0f172a',
            display: 'standalone',
            icons: [
              {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png'
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
              }
            ]
          },

        })
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
        dedupe: ['react', 'react-dom'],
      },
      build: {
        target: 'es2015',
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: mode === 'production',
            drop_debugger: mode === 'production',
          },
        },
        rollupOptions: {
          output: {
            // manualChunks removed to prevent React instance duplication issues
            // Vite 4+ handles chunking efficiently by default
          },
        },
        chunkSizeWarningLimit: 800,
        sourcemap: mode === 'development',
        // Enable tree-shaking and minimal bundle size
        cssCodeSplit: true,
        assetsInlineLimit: 4096,
      },
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react-router-dom',
          'framer-motion',
          '@supabase/supabase-js',
          '@tanstack/react-query',
        ],
      },
    };
});
