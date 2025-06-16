import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Esta línea es la solución. Asegúrate de que esté presente y bien escrita.
  base: "./",
});
