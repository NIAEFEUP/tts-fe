import React from "react";
import { Toaster } from './components/ui/toaster'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from 'react-router-dom'
import './app.css'
import CombinedProvider from './contexts/CombinedProvider'
import { AboutPage, TimeTableSelectorPage, FaqsPage, NotFoundPage } from './pages'
import { getPath, config, dev_config, plausible } from './utils'
import Layout from './components/layout'
import Exchange from './pages/Exchange'
import { useEffect } from 'react'
import api from './api/backend'
import * as Sentry from "@sentry/react";

const configToUse = Number(import.meta.env.VITE_APP_PROD) ? config : dev_config

// Configures the path for pages.
const pages = [
  { path: getPath(configToUse.paths.about), location: 'Sobre', element: AboutPage, liquid: true },
  { path: getPath(configToUse.paths.planner), location: 'Horários', element: TimeTableSelectorPage, liquid: true },
  { path: getPath(configToUse.paths.faqs), location: 'FAQs', element: FaqsPage, liquid: true },
  { path: getPath(configToUse.paths.notfound), location: 'NotFound', element: NotFoundPage, liquid: true },
  { path: getPath(config.paths.exchange), location: 'Trocas', element: Exchange, liquid: true },
]

const redirects = [
  { from: "/", to: getPath(configToUse.paths.planner) },
  { from: configToUse.pathPrefix, to: getPath(configToUse.paths.planner) },
  { from: configToUse.pathPrefix.slice(0, -1), to: getPath(configToUse.paths.planner) },
  { from: getPath(configToUse.paths.home), to: getPath(configToUse.paths.about) },
]

const App = () => {
  //TODO(thePeras): Should this be used? Or should this invalidate the storage
  //StorageAPI.updateBackendDataVersion()

  // Enable Analytics
  const { enableAutoPageviews } = plausible
  enableAutoPageviews()

  useEffect(() => {
    fetch(`${api.BACKEND_URL}/csrf/`, { credentials: "include" }).then((res) => {
    })
  });
  // Enable Error Tracking, Performance Monitoring and Session Replay
  Sentry.init({
    environment: Number(import.meta.env.VITE_APP_PROD) ? "production" : "development",
    dsn: "https://01f0882e6aa029a125426e4ad32e6c18@o553498.ingest.us.sentry.io/4507775325437952",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
    ],

    // Performance monitoring
    tracesSampleRate: 1.0,
    //tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],

    // Session Replay
    replaysSessionSampleRate: Number(import.meta.env.VITE_APP_PROD) ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
  });
  const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

  return (
    <BrowserRouter>
      <CombinedProvider>
        <SentryRoutes>
          {pages.map((page, pageIdx) => (
            <Route
              path={page.path}
              key={`page-${pageIdx}`}
              element={
                <Layout location={page.location} title={page.location} liquid={page.liquid}>
                  <div>
                    <page.element />
                  </div>
                </Layout>
              }
            />
          ))}
          {redirects.map((redirect, redirectIdx) => (
            <Route
              path={redirect.from}
              key={`redirect-${redirectIdx}`}
              element={<Navigate replace to={redirect.to} />}
            />
          ))}
        </SentryRoutes>
      </CombinedProvider>
    </BrowserRouter>
  )
}

export default App
