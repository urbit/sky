import { defineConfig } from 'vite'
import { urbitPlugin } from '@urbit/vite-plugin-urbit'

export default defineConfig({
  plugins: [
    urbitPlugin({
      base: 'sky',
      target: 'http://localhost:8080',
    }),
  ],
})
