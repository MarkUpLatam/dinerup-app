import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    // Configuración para SPA - redirigir todas las rutas a index.html
    middlewareMode: false,
    historyApiFallback: true, // Asegura que todas las rutas redirijan a index.html
  },
  preview: {
    // Configuración para preview (similar a producción)
    port: 4173,
  },
});
