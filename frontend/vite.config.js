import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  base: '/', // Netlify root
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'icon-192.png',
        'icon-512.png',
        'maskable-icon-512.png',
        'offline.html',
        'app-release-signed.apk'   // ✅ Add APK here
      ],
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: '/offline.html',
        runtimeCaching: [
          {
            urlPattern: /.*\.apk$/,   // ✅ Match .apk requests
            handler: 'NetworkFirst', // always try network first
            options: {
              cacheName: 'apk-cache',
              expiration: {
                maxEntries: 1, // only keep 1 version
              }
            }
          }
        ]
      },
      manifest: {
        name: 'QR Pro',
        short_name: 'QRPro',
        description: 'AI-powered QR generator — Studio + 3D',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#0d6efd',
        background_color: '#ffffff',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/maskable-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable any' }
        ],
        shortcuts: [
          {
            name: "Create QR",
            short_name: "Create",
            description: "Open generator",
            url: "/?shortcut=create",
            icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }]
          },
          {
            name: "Open 3D",
            short_name: "3D",
            description: "Open the 3D Cube",
            url: "/cube.html",
            icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }]
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        scanner: resolve(__dirname, 'scanner.html'),
        studio: resolve(__dirname, 'studio.html'),
        cube: resolve(__dirname, 'cube.html'),
      }
    }
  },
});
