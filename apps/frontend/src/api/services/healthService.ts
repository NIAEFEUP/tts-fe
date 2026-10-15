import api from '../backend'

/**
 * Readiness probe for the backend (`GET /health`). Called once on startup so a
 * misconfigured `VITE_APP_BACKEND_URL` or a down backend shows up immediately
 * instead of only surfacing later as failing API calls.
 */
const checkHealth = async (): Promise<void> => {
  const res = await fetch(`${api.BACKEND_URL}/health`)
  if (!res.ok) {
    throw new Error(`health check failed with status ${res.status}`)
  }
}

const healthService = {
  checkHealth,
}

export default healthService
