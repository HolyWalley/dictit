import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Only enable PWA in production
      disable: process.env.NODE_ENV === 'development',
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,csv}'],
        // Force cache the dictionary file
        runtimeCaching: [
          {
            urlPattern: /^.*\/russian_italian_dictionary\.csv$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'dictionary-cache',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Russian-Italian Dictionary',
        short_name: 'RU-IT Dict',
        description: 'Russian-Italian Dictionary with offline support',
        theme_color: '#242424',
        background_color: '#242424',
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
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})
