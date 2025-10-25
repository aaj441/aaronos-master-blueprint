import { defineConfig } from 'vinxi/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    preset: 'node-server'
  },
  plugins: [react()],
  ssr: {
    noExternal: ['@tanstack/react-router']
  }
})