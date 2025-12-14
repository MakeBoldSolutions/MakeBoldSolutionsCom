import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    metaImagesPlugin(),
  ],
  base: process.env.GITHUB_PAGES === 'true' ? '/MakeBoldSolutionsCom/' : '/',
  publicDir: path.resolve(import.meta.dirname, "src", "public"),
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "src", "assets"),
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  root: import.meta.dirname,
  build: {
    outDir: path.resolve(import.meta.dirname, "docs"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 5010,
  },
});
