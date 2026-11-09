import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Porta fixa: é o endereço liberado no Supabase (http://localhost:5173).
  // Se estiver ocupada, o Vite avisa em vez de abrir em outra porta.
  server: { port: 5173, strictPort: true }
});
