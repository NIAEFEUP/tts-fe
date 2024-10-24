import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslintPlugin from 'vite-plugin-eslint'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), eslintPlugin({
    cache: false,
    include: ['./src/**/*.js', './src/**/*.jsx'],
    exclude: [],
  }), sentryVitePlugin({
    org: "niaefeup",
    project: "tts"
  })],
  server: {
    host: '0.0.0.0',
    hmr: {
      host: 'tts-dev.niaefeup.pt',
    },
    port: 3100,
  },
  build: {
    outDir: 'build',
    sourcemap: true
  }
})
