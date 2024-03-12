import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://172.18.0.2:3100/tts/planner',
  },
});
