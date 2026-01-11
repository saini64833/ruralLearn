import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "icons/icon-192.png",
        "icons/icon-512.png",
      ],

      manifest: {
        name: "Rural Learn",
        short_name: "RuralLearn",
        description: "Learning platform with videos, PDFs, quizzes",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0d6efd",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",

        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages-cache",
            },
          },
          {
            urlPattern: ({ url }) => url.origin.includes("onrender.com"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
});
