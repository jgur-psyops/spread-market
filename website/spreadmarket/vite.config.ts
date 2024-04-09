import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: false, // can also be 'build', 'dev', or false
        global: true,
        process: true,
      },
    }),
  ],
});
