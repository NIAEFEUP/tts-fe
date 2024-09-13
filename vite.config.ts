import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  server: {
    host: '0.0.0.0',
    hmr: {
      host: 'tts-dev.niaefeup.pt',
    },
    port: 3100,
  },
  build: {
    outDir: 'build'
  },
})
