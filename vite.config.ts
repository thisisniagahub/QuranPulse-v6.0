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
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo-full.png'],
          workbox: {
              navigateFallbackDenylist: [/^\/api/], // Ignore API routes for Service Worker
              globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
              // Exclude large icons from precaching - they'll load normally
              globIgnores: ['**/IQRA-ICON.png', '**/QIBLAT-ICON.png', '**/HOME-ICON.png', '**/USTAZ-AI_ICON.png', '**/Al-QURAN-ICON.png'],
              // Increase max file size for precaching
              maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
              runtimeCaching: [
                  {
                      urlPattern: /^https:\/\/api\.quran\.com\/.*/i,
                      handler: 'CacheFirst',
                      options: {
                          cacheName: 'quran-api-cache',
                          expiration: {
                              maxEntries: 500,
                              maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
                          },
                          cacheableResponse: {
                              statuses: [0, 200],
                          },
                      },
                  },
                  {
                      urlPattern: /^https:\/\/verses\.quran\.com\/.*/i,
                      handler: 'CacheFirst',
                      options: {
                          cacheName: 'quran-audio-cache',
                          expiration: {
                              maxEntries: 100,
                              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
                          },
                      },
                  },
                  {
                      urlPattern: ({ request }) => request.destination === 'image',
                      handler: 'CacheFirst',
                      options: {
                          cacheName: 'images',
                          expiration: {
                              maxEntries: 50,
                              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
                          },
                      },
                      method: 'GET'
                  },
                  {
                      // Fix 206 Partial Content errors for Video/Audio
                      urlPattern: ({ request }) => request.destination === 'video' || request.destination === 'audio',
                      handler: 'NetworkOnly', 
                  }
              ]
          },
          manifest: {
            name: 'Quran Pulse',
            short_name: 'QuranPulse',
            description: 'Your Digital Islamic Companion - AI-powered Quran learning',
            theme_color: '#051324',
            background_color: '#051324',
            display: 'standalone',
            orientation: 'portrait',
            scope: '/',
            start_url: '/',
            categories: ['education', 'lifestyle', 'books'],
            icons: [
              {
                src: 'logo-full.png',
                sizes: '512x512',
                type: 'image/png'
              },
              {
                src: 'logo-full.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'logo-full.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
              }
            ],
            shortcuts: [
              {
                name: 'Baca Al-Quran',
                short_name: 'Quran',
                description: 'Terus membaca Al-Quran',
                url: '/quran',
                icons: [{ src: 'Al-QURAN-ICON.png', sizes: '192x192' }]
              },
              {
                name: 'Tanya Ustaz AI',
                short_name: 'Ustaz AI',
                description: 'Chat dengan Ustaz AI',
                url: '/smart-deen',
                icons: [{ src: 'USTAZ-AI_ICON.png', sizes: '192x192' }]
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
