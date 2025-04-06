import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'
import fs from 'fs'

// Plugin to copy the dictionary file to the build output
const copyDictionaryPlugin = () => {
  return {
    name: 'copy-dictionary-plugin',
    generateBundle() {
      // Check if the dictionary file exists
      const dictionaryPath = resolve(process.cwd(), 'russian_italian_dictionary.csv')
      if (fs.existsSync(dictionaryPath)) {
        // Read the file content
        const content = fs.readFileSync(dictionaryPath, 'utf-8')

        // Add the file to the build output
        this.emitFile({
          type: 'asset',
          fileName: 'russian_italian_dictionary.csv',
          source: content
        })

        console.log('Dictionary file copied to build output')
      } else {
        console.warn('Dictionary file not found at:', dictionaryPath)
      }
    }
  }
}

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
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'mask-icon.svg',
        'russian_italian_dictionary.csv'  // Include the dictionary in PWA assets
      ],
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
    }),
    // copyDictionaryPlugin()
  ],
  build: {
    rollupOptions: {
      // Make sure the dictionary file is included in the build
      external: []
    }
  }
})
