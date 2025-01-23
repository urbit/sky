import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { urbitPlugin } from '@urbit/vite-plugin-urbit'

export default defineConfig({
  plugins: [
    react(),
    urbitPlugin({
      base: 'sky',
      target: 'http://localhost:8080',
      secure: false,
    }),
  ],
})
