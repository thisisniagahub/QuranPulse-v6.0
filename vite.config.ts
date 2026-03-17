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
        includeAssets: ['favicon.ico', 'logo-full.png'],
        workbox: {
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          navigateFallbackDenylist: [/^\/api/, /\.[a-z]+$/],
          globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
          globIgnores: [
            '**/node_modules/**',
            '**/audio/**',
            '**/screenshots/**',
            '**/assets/backgrounds/**',
            '**/coverage/**',
            '**/*.map',
          ],
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB
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
              urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'unsplash-images',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
                },
              },
            },
            {
              urlPattern: /^https:\/\/grainy-gradients\.vercel\.app\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'grainy-gradients',
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
          id: 'quran-pulse-v6',
          name: 'Quran Pulse',
          short_name: 'QuranPulse',
          description: 'App Mengaji AI Pertama Malaysia. Belajar Iqra & Quran dengan Ustaz AI 24/7.',
          theme_color: '#051324',
          background_color: '#051324',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          lang: 'ms-MY',
          dir: 'ltr',
          display_override: ['window-controls-overlay', 'minimal-ui'],
          categories: ['education', 'lifestyle', 'productivity', 'books'],
          launch_handler: {
            client_mode: 'focus-existing'
          },
          screenshots: [
            {
              src: 'screenshots/screen1.png',
              sizes: '1080x1920',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Dashboard Utama'
            },
            {
              src: 'screenshots/screen2.png',
              sizes: '1080x1920',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Bacaan Al-Quran'
            },
            {
              src: 'screenshots/screen3.png',
              sizes: '1080x1920',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Pembelajaran AI'
            }
          ],
          icons: [
            {
              src: 'icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'icons/icon-maskable-512x512.png',
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
              icons: [{ src: 'logo-full.png', sizes: '192x192' }]
            },
            {
              name: 'Tanya Ustaz AI',
              short_name: 'Ustaz AI',
              description: 'Chat dengan Ustaz AI',
              url: '/smart-deen',
              icons: [{ src: 'UstazAI-Icon.png', sizes: '192x192' }]
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
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-motion': ['framer-motion'],
            'vendor-icons': ['lucide-react'],
            'vendor-lottie': ['lottie-react'],
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-mermaid': ['mermaid'],
            'vendor-pdf': ['react-pdf'],
          },
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
        'lucide-react',
        '@supabase/supabase-js',
        '@tanstack/react-query',
      ],
    },
  };
});
