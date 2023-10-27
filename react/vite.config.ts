import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // plain React
    react(),

    // for PWA - https://vite-pwa-org.netlify.app/guide/
    VitePWA({
      //   registerType: "autoUpdate",
      registerType: "prompt",
      injectRegister: "auto",
      includeAssets: ["favicon.ico", "apple-touc-icon.png", "masked-icon.svg"],

      // dynamic manifest generation
      // NOTE - the images are generated with the npm script `generate-pwa-assets`,
      // which uses the `pwa-assets-generator` node lib
      manifest: {
        name: "Activities",
        short_name: "Calendar Activities",
        description: "Log user's activities",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/apple-touch-icon-180x180.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "apple touch icon",
          },
          {
            src: "/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        theme_color: "#444466",
        background_color: "#113344",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },

      devOptions: {
        enabled: true,
      },
    }),
  ],
});
