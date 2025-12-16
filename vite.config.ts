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
        // Custom Middleware removed for security
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
                      method: 'GET' // FIX: Explicitly only cache GET
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
