import { Toaster } from './components/ui/toaster'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './app.css'
import CombinedProvider from './contexts/CombinedProvider'
import { AboutPage, TimeTableSchedulerPage, FaqsPage, NotFoundPage } from './pages'
import { getPath, config, plausible } from './utils'
import Layout from './components/layout'

// Configures the path for pages.
const pages = [
  { path: getPath(config.paths.about), location: 'Sobre', element: AboutPage, liquid: true },
  { path: getPath(config.paths.planner), location: 'Horários', element: TimeTableSchedulerPage, liquid: true },
  { path: getPath(config.paths.faqs), location: 'FAQs', element: FaqsPage, liquid: true },
  { path: getPath(config.paths.notfound), location: 'NotFound', element: NotFoundPage, liquid: true },
]

const redirects = [
  { from: "/", to: getPath(config.paths.planner) },
  { from: config.pathPrefix, to: getPath(config.paths.planner) },
  { from: config.pathPrefix.slice(0, -1), to: getPath(config.paths.planner) },
  { from: getPath(config.paths.home), to: getPath(config.paths.about) },
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