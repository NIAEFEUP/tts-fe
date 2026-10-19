// vite.config.ts
import { sentryVitePlugin } from "file:///mnt/c/Users/carol/Niaefeup/TTS/tts-fe/node_modules/.bun/@sentry+vite-plugin@2.23.1/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
import { defineConfig } from "file:///mnt/c/Users/carol/Niaefeup/TTS/tts-fe/node_modules/.bun/vite@5.4.21+33768f24f0150334/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/c/Users/carol/Niaefeup/TTS/tts-fe/node_modules/.bun/@vitejs+plugin-react@4.7.0+7a6936b409819420/node_modules/@vitejs/plugin-react/dist/index.js";
import viteTsconfigPaths from "file:///mnt/c/Users/carol/Niaefeup/TTS/tts-fe/node_modules/.bun/vite-tsconfig-paths@4.3.2+dd7ed1624b81269c/node_modules/vite-tsconfig-paths/dist/index.mjs";
import { varlockVitePlugin } from "file:///mnt/c/Users/carol/Niaefeup/TTS/tts-fe/node_modules/.bun/@varlock+vite-integration@1.5.2+4b2a8bbcdf1dbc41/node_modules/@varlock/vite-integration/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    varlockVitePlugin(),
    react(),
    viteTsconfigPaths(),
    sentryVitePlugin({
      org: "niaefeup",
      project: "tts"
    })
  ],
  server: {
    host: "0.0.0.0",
    port: 3100,
    // Dev equivalent of the `location = /feedback` block in nginx.tts.conf,
    // so Sentry envelopes (incl. feedback) reach the ingest host in development.
    proxy: {
      "/feedback": {
        target: "https://o553498.ingest.us.sentry.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/feedback$/, "/api/4507775325437952/envelope/")
      }
    }
  },
  build: {
    outDir: "build",
    sourcemap: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvVXNlcnMvY2Fyb2wvTmlhZWZldXAvVFRTL3R0cy1mZS9hcHBzL2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvbW50L2MvVXNlcnMvY2Fyb2wvTmlhZWZldXAvVFRTL3R0cy1mZS9hcHBzL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9tbnQvYy9Vc2Vycy9jYXJvbC9OaWFlZmV1cC9UVFMvdHRzLWZlL2FwcHMvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBzZW50cnlWaXRlUGx1Z2luIH0gZnJvbSAnQHNlbnRyeS92aXRlLXBsdWdpbidcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgdml0ZVRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocydcbmltcG9ydCB7IHZhcmxvY2tWaXRlUGx1Z2luIH0gZnJvbSAnQHZhcmxvY2svdml0ZS1pbnRlZ3JhdGlvbidcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHZhcmxvY2tWaXRlUGx1Z2luKCksXG4gICAgcmVhY3QoKSxcbiAgICB2aXRlVHNjb25maWdQYXRocygpLFxuICAgIHNlbnRyeVZpdGVQbHVnaW4oe1xuICAgICAgb3JnOiAnbmlhZWZldXAnLFxuICAgICAgcHJvamVjdDogJ3R0cycsXG4gICAgfSksXG4gIF0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICBwb3J0OiAzMTAwLFxuICAgIC8vIERldiBlcXVpdmFsZW50IG9mIHRoZSBgbG9jYXRpb24gPSAvZmVlZGJhY2tgIGJsb2NrIGluIG5naW54LnR0cy5jb25mLFxuICAgIC8vIHNvIFNlbnRyeSBlbnZlbG9wZXMgKGluY2wuIGZlZWRiYWNrKSByZWFjaCB0aGUgaW5nZXN0IGhvc3QgaW4gZGV2ZWxvcG1lbnQuXG4gICAgcHJveHk6IHtcbiAgICAgICcvZmVlZGJhY2snOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vbzU1MzQ5OC5pbmdlc3QudXMuc2VudHJ5LmlvJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvZmVlZGJhY2skLywgJy9hcGkvNDUwNzc3NTMyNTQzNzk1Mi9lbnZlbG9wZS8nKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdidWlsZCcsXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFUsU0FBUyx3QkFBd0I7QUFDL1csU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sdUJBQXVCO0FBQzlCLFNBQVMseUJBQXlCO0FBRWxDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLGtCQUFrQjtBQUFBLElBQ2xCLE1BQU07QUFBQSxJQUNOLGtCQUFrQjtBQUFBLElBQ2xCLGlCQUFpQjtBQUFBLE1BQ2YsS0FBSztBQUFBLE1BQ0wsU0FBUztBQUFBLElBQ1gsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBO0FBQUEsSUFHTixPQUFPO0FBQUEsTUFDTCxhQUFhO0FBQUEsUUFDWCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsZ0JBQWdCLGlDQUFpQztBQUFBLE1BQ25GO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxFQUNiO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
