import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
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
          }
        })
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
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
            manualChunks: (id) => {
              // Vendor libraries - core React ecosystem
              if (id.includes('node_modules/react') || 
                  id.includes('node_modules/react-dom') || 
                  id.includes('node_modules/react-router')) {
                return 'vendor-react';
              }
              
              // UI and animation libraries
              if (id.includes('node_modules/framer-motion') || 
                  id.includes('node_modules/lucide-react')) {
                return 'vendor-ui';
              }
              
              // Supabase and API clients
              if (id.includes('node_modules/@supabase') || 
                  id.includes('node_modules/@tanstack/react-query')) {
                return 'vendor-data';
              }
              
              // Service layer - separate chunk for better caching
              if (id.includes('/src/services/')) {
                return 'services';
              }
              
              // Large modules - split into separate chunks
              if (id.includes('/src/modules/Quran')) {
                return 'module-quran';
              }
              if (id.includes('/src/modules/Iqra')) {
                return 'module-iqra';
              }
              if (id.includes('/src/modules/Admin')) {
                return 'module-admin';
              }
              if (id.includes('/src/modules/SmartDeen')) {
                return 'module-smartdeen';
              }
            },
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
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
        ],
      },
    };
});
