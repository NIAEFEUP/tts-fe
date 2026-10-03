import { node } from "@elysiajs/node";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { healthRoutes } from "@/interface/routes/health.routes";

export function createApp() {
  return new Elysia({ adapter: "Bun" in globalThis ? undefined : node() })
    .use(cors())
    .use(healthRoutes)
    .get("/", () => ({ message: "Hello from tts-be!" }));
}

export type App = ReturnType<typeof createApp>;

if (import.meta.main) {
  const port = Number(process.env.PORT) || 3000;
  const app = createApp().listen(port);
  console.log(`Server running at http://localhost:${app.server?.port ?? port}`);
}
