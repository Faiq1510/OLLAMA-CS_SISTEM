// vite.config.js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5175,
    strictPort: true, // Menggunakan port 5175 agar tidak bentrok dengan widget (5173/5174)
    proxy: {
      // Menghubungkan request API langsung ke Backend Node.js port 3000
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
