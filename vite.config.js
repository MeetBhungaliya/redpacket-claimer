import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      include: /\.(jsx|js)$/
    })
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: false
  }
})
