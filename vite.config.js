import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // Ensure Vite uses the repository root and public directory explicitly.
  // This helps CI/CD platforms (like Vercel) that may change the working directory.
  root: fileURLToPath(new URL("./", import.meta.url)),
  publicDir: "public",
});
