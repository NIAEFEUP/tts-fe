import * as React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './api/socket'
import { HelmetProvider } from 'react-helmet-async'

import * as Sentry from '@sentry/react'

import { useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from 'react-router-dom'

const strictMode = false
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

Sentry.init({
  environment: Number(import.meta.env.VITE_APP_PROD) ? 'production' : 'development',
  dsn: import.meta.env.VITE_APP_SENTRY_DSN,
  // Route envelopes through our own origin so adblockers (which block the don't silently drop events.
  // Keep this in sync with SENTRY_TUNNEL in components/FeedbackReport.tsx.
  tunnel: '/feedback',
  integrations: [
    import.meta.env.VITE_APP_SENTRY_TRACING ? Sentry.browserTracingIntegration() : null,
    import.meta.env.VITE_APP_SENTRY_TRACING ? Sentry.replayIntegration() : null,
    import.meta.env.VITE_APP_SENTRY_TRACING
      ? Sentry.reactRouterV6BrowserTracingIntegration({
          useEffect: React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
        })
      : null,
  ],

  // Performance monitoring
  tracesSampleRate: 1.0,
  //tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],

  // Session Replay
  replaysSessionSampleRate: Number(import.meta.env.VITE_APP_PROD) ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
})

const app = (
  <HelmetProvider>
    <App />
  </HelmetProvider>
)
root.render(strictMode ? <React.StrictMode>{app}</React.StrictMode> : app)
