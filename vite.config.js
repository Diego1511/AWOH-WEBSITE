import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Crea chunks separados para las librerías más pesadas
          if (id.includes("node_modules")) {
            if (id.includes("recharts")) {
              return "recharts";
            }
            if (id.includes("framer-motion")) {
              return "framer-motion";
            }
            // Agrupa el resto de las dependencias en un chunk de 'vendor'
            return "vendor";
          }
        },
      },
    },
  },
});
