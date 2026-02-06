import { defineConfig } from 'vite';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait()
  ],
  // Tambahkan ini untuk memastikan Vite tidak melakukan optimasi berlebih pada WASM
  optimizeDeps: {
    exclude: ['@dimforge/rapier3d']
  }
});