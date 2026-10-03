import { sentryVitePlugin } from '@sentry/vite-plugin'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import { varlockVitePlugin } from '@varlock/vite-integration'

export default defineConfig({
  plugins: [
    varlockVitePlugin(),
    react(),
    viteTsconfigPaths(),
    sentryVitePlugin({
      org: 'niaefeup',
      project: 'tts',
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3100,
    // Dev equivalent of the `location = /feedback` block in nginx.tts.conf,
    // so Sentry envelopes (incl. feedback) reach the ingest host in development.
    proxy: {
      '/feedback': {
        target: 'https://o553498.ingest.us.sentry.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/feedback$/, '/api/4507775325437952/envelope/'),
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
})
