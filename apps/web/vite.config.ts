import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? "/",
  resolve: {
    alias: {
      "@amdb/core": fileURLToPath(new URL("../../packages/core/src/index.ts", import.meta.url)),
      "@amdb/content": fileURLToPath(
        new URL("../../packages/content/src/index.ts", import.meta.url),
      ),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
