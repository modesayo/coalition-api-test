import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from 'vite-plugin-tailwind';

export default defineConfig({
  plugins: [
    react()
  ],
})