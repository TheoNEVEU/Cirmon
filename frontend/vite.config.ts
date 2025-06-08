import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Cirmon/', // remplace avec le nom de ton dépôt
  plugins: [react()],
})