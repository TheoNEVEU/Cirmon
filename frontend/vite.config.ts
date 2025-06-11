import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Cirmon/', // remplace avec le nom de ton dépôt
  plugins: [react()],
  server: {
    host: true, // autorise l'écoute sur toutes les interfaces
    port: 5173  // tu peux choisir un autre port si nécessaire
  }
})