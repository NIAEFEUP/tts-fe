import Layout from './components/layout'
import StorageAPI from './api/storage'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AboutPage, TimeTableSchedulerPage, NotFoundPage, FaqsPage } from './pages'
import { getPath, config } from './utils/utils'
import { useDarkMode } from './hooks'
import { ThemeContext } from './contexts/ThemeContext'
import { Toaster } from './components/ui/toaster'
import './app.css'

// Configures the path for pages.
const pages = [
  { path: getPath(config.paths.about), location: 'Sobre', element: AboutPage, liquid: true },
  { path: getPath(config.paths.planner), location: 'Horários', element: TimeTableSchedulerPage, liquid: true },
  { path: getPath(config.paths.faqs), location: 'FAQs', element: FaqsPage, liquid: true },
  { path: getPath(config.paths.notfound), location: 'NotFound', element: NotFoundPage, liquid: true },
]

const redirects = [
  { from: config.pathPrefix, to: getPath(config.paths.planner) },
  { from: config.pathPrefix.slice(0, -1), to: getPath(config.paths.planner) },
  { from: getPath(config.paths.home), to: getPath(config.paths.about) },
]

const App = () => {
  const [enabled, setEnabled] = useDarkMode()
  StorageAPI.updateScrappeInfo()

  return (
    <BrowserRouter>
      <ThemeContext.Provider value={{ enabled, setEnabled }}>
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
      </ThemeContext.Provider>
    </BrowserRouter>
  )
}

export default App
