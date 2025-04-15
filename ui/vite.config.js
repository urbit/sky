import { loadEnv, defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react'
import { urbitPlugin } from '@urbit/vite-plugin-urbit'

// https://vitejs.dev/config/
export default ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()))
  const SHIP_URL =
    process.env.SHIP_URL || process.env.VITE_SHIP_URL || 'http://localhost:8080'
  console.log(`Connecting to ${SHIP_URL}`)

  return defineConfig({
    plugins: [
      urbitPlugin({ base: 'sky', target: SHIP_URL, secure: false }),
      reactRefresh(),
    ],
    build: {
      rollupOptions: {
        preserveEntrySignatures: 'strict',
      },
    },
    template: {
      transformIndexHtml(html) {
        return html.replace(/%VITE_SHIP_URL%/g, SHIP_URL)
      },
    },
  })
}
