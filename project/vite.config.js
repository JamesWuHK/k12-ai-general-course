import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  base: "./",
  build: {
    outDir: path.resolve(__dirname, "../site"),
    emptyOutDir: true
  },
  server: {
    host: "0.0.0.0",
    port: 4177
  },
  preview: {
    host: "0.0.0.0",
    port: 4178
  }
});
