import { Toaster } from './components/ui/toaster'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './app.css'
import CombinedProvider from './contexts/CombinedProvider'
import { AboutPage, TimeTableSelectorPage, FaqsPage, NotFoundPage } from './pages'
import { getPath, config, dev_config, plausible } from './utils'
import Layout from './components/layout'

const configToUse = Number(import.meta.env.VITE_APP_PROD) ? config : dev_config

// Configures the path for pages.
const pages = [
  { path: getPath(configToUse.paths.about), location: 'Sobre', element: AboutPage, liquid: true },
  { path: getPath(configToUse.paths.planner), location: 'Horários', element: TimeTableSelectorPage, liquid: true },
  { path: getPath(configToUse.paths.faqs), location: 'FAQs', element: FaqsPage, liquid: true },
  { path: getPath(configToUse.paths.notfound), location: 'NotFound', element: NotFoundPage, liquid: true },
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

  const { enableAutoPageviews } = plausible
  enableAutoPageviews()

  return (
    <BrowserRouter>
      <CombinedProvider>
        <Routes>
          {pages.map((page, pageIdx) => (
            <Route
              path={page.path}
              key={`page-${pageIdx}`}
              element={
                <Layout location={page.location} title={page.location} liquid={page.liquid}>
                  <div>
                    <page.element />
                    <Toaster />
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
        </Routes>
      </CombinedProvider>
    </BrowserRouter>
  )
}

export default App
