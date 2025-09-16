import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './api/socket'

import * as Sentry from "@sentry/react";

import { useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from 'react-router-dom'

const strictMode = false
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

Sentry.init({
  environment: Number(import.meta.env.VITE_APP_PROD) ? "production" : "development",
  dsn: import.meta.env.VITE_APP_SENTRY_DSN,
  integrations: [
    import.meta.env.VITE_APP_SENTRY_TRACING ? Sentry.browserTracingIntegration() : null,
    import.meta.env.VITE_APP_SENTRY_TRACING ? Sentry.replayIntegration() : null,
    import.meta.env.VITE_APP_SENTRY_TRACING ? Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }) : null,
  ],

  // Performance monitoring
  tracesSampleRate: 1.0,
  //tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],

  // Session Replay
  replaysSessionSampleRate: Number(import.meta.env.VITE_APP_PROD) ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
});


root.render(strictMode
  ?
  <React.StrictMode>
    <App />
  </React.StrictMode>
  : <App />)
