import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [react({ exclude: '**/*.tsx' })],
  server: { port: 5700 },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
