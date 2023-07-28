import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        short_name: "WordleWiz",
        name: "WordleWiz - Be a Wordle Wizard",
        icons: [
          {
            src: "/favicon.png",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/png",
          },
          {
            src: "/logo192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "/logo512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
        start_url: ".",
        display: "standalone",
        theme_color: "#6aaa64",
        background_color: "#6aaa64",
      },
    }),
  ],
});
