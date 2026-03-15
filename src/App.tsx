import { Toaster } from './components/ui/toaster'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './app.css'
import CombinedProvider from './contexts/CombinedProvider'
import { AboutPage, TimeTableSelectorPage, FaqsPage, NotFoundPage, PrivacyPolicyPage, ExchangeVerifyPage, AdminPage } from './pages'
import { getPath, config, dev_config, plausible } from './utils'
import Layout from './components/layout'
import Exchange from './pages/Exchange'
import { useEffect } from 'react'
import api from './api/backend'
import * as Sentry from "@sentry/react";

const configToUse = Number(import.meta.env.VITE_APP_PROD) ? config : dev_config

// Configures the path for pages.
const pages = [
  { 
    path: getPath(configToUse.paths.about), 
    location: 'Sobre', 
    element: AboutPage, 
    liquid: true,
    description: 'Sobre o Time Table Selector - Plataforma desenvolvida por NIAEFEUP para ajudar estudantes da FEUP a criar e gerir horários.',
    canonical: 'https://tts.niaefeup.pt/about',
    breadcrumbs: [
      { name: 'Início', url: 'https://tts.niaefeup.pt/' },
      { name: 'Sobre', url: 'https://tts.niaefeup.pt/about' }
    ]
  },
  { 
    path: getPath(configToUse.paths.planner), 
    location: 'Horários', 
    element: TimeTableSelectorPage, 
    liquid: true,
    description: 'Crie e experimente diferentes combinações de horários para o seu semestre na FEUP. Visualize conflitos e otimize a sua agenda.',
    canonical: 'https://tts.niaefeup.pt/planner',
    breadcrumbs: [
      { name: 'Início', url: 'https://tts.niaefeup.pt/' },
      { name: 'Horários', url: 'https://tts.niaefeup.pt/planner' }
    ]
  },
  { 
    path: getPath(configToUse.paths.faqs), 
    location: 'FAQs', 
    element: FaqsPage, 
    liquid: true,
    description: 'Perguntas frequentes sobre o Time Table Selector - Tire as suas dúvidas sobre a plataforma de horários da FEUP.',
    canonical: 'https://tts.niaefeup.pt/faqs',
    breadcrumbs: [
      { name: 'Início', url: 'https://tts.niaefeup.pt/' },
      { name: 'FAQs', url: 'https://tts.niaefeup.pt/faqs' }
    ]
  },
  { 
    path: getPath(configToUse.paths.notfound), 
    location: 'NotFound', 
    element: NotFoundPage, 
    liquid: true,
    description: 'Página não encontrada - Time Table Selector',
    canonical: 'https://tts.niaefeup.pt/404'
  },
  { 
    path: getPath(config.paths.exchange), 
    location: 'Turmas', 
    element: Exchange, 
    liquid: true,
    description: 'Troque de turmas com outros estudantes da FEUP. Pedidos de troca diretos e gestão de trocas de horários.',
    canonical: 'https://tts.niaefeup.pt/exchange',
    breadcrumbs: [
      { name: 'Início', url: 'https://tts.niaefeup.pt/' },
      { name: 'Turmas', url: 'https://tts.niaefeup.pt/exchange' }
    ]
  },
  { 
    path: getPath(config.paths.privacypolicy), 
    location: 'Privacidade', 
    element: PrivacyPolicyPage, 
    liquid: true,
    description: 'Política de privacidade do Time Table Selector - Como tratamos os seus dados.',
    canonical: 'https://tts.niaefeup.pt/privacy',
    breadcrumbs: [
      { name: 'Início', url: 'https://tts.niaefeup.pt/' },
      { name: 'Privacidade', url: 'https://tts.niaefeup.pt/privacy' }
    ]
  },
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
    fetch(`${api.BACKEND_URL}/csrf/`, { credentials: "include" }).then(() => {
    }).catch((e) => console.error(e));
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
                <Layout 
                  location={page.location} 
                  title={page.location} 
                  liquid={page.liquid}
                  description={page.description}
                  canonical={page.canonical}
                  breadcrumbs={page.breadcrumbs}
                >
                  <div>
                    <page.element />
                    <Toaster />
                  </div>
                </Layout>
              }
            />
          ))}
          <Route
            path="/exchange/verify/:token"
            key="exchange-verify-page"
            element={
              <Layout location="Exchange" title="Exchange" liquid={true}>
                <div>
                  <ExchangeVerifyPage />
                  <Toaster />
                </div>
              </Layout>
            }
          />
          {redirects.map((redirect, redirectIdx) => (
            <Route
              path={redirect.from}
              key={`redirect-${redirectIdx}`}
              element={<Navigate replace to={redirect.to} />}
            />
          ))}
          <Route
            path="admin"
            key="page-admin"
            element={
              <AdminPage page="pedidos" />
            }
          />
          <Route
            path="admin/vacancies"
            key="page-admin-vacancies"
            element={
              <AdminPage page="vacancies"/>
            }
          />
          <Route
            path="admin/settings"
            key="page-admin-settings"
            element={
              <AdminPage page="settings" />
          
            }
          />
          <Route
            path="admin/statistics"
            key="page-admin-statistics"
            element={
              <AdminPage page="statistics" />
            }
          />
        </SentryRoutes>
      </CombinedProvider>
    </BrowserRouter>
  )
}

export default App
