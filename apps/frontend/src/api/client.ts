import { treaty, type Treaty } from '@elysiajs/eden'
import type { App } from 'tts-be'

// In your .env, VITE_APP_BACKEND_URL should now be http://localhost:3000
const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:3000'

export const client: Treaty.Create<App> = treaty<App>(backendUrl)
