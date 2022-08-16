import Layout from './components/layout'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AboutPage, ProfilePage, FeupExchangePage, TimeTableSchedulerPage, NotFoundPage, FaqsPage } from './pages'
import { getPath, config } from './utils'
import './app.css'

// Configures the path for pages. 
const pages = [
  { path: getPath(config.paths.about), location: 'About', element: AboutPage, liquid: true },
  { path: getPath(config.paths.profile), location: 'Profile', element: ProfilePage, liquid: true },
  { path: getPath(config.paths.planner), location: 'Planner', element: TimeTableSchedulerPage, liquid: true },
  { path: getPath(config.paths.exchange), location: 'Exchange', element: FeupExchangePage, liquid: true },
  { path: getPath(config.paths.faqs), location: 'FAQs', element: FaqsPage, liquid: true },
  { path: getPath(config.paths.notfound), location: 'NotFound', element: NotFoundPage, liquid: true },
]

const redirects = [
  { from: config.pathPrefix, to: getPath(config.paths.planner) },
  { from: config.pathPrefix.slice(0,-1) , to: getPath(config.paths.planner) },
  { from: getPath(config.paths.home), to: getPath(config.paths.about) },
]


const App = () => (
  <BrowserRouter>
    <Routes>
      {pages.map((page, pageIdx) => (
        <Route
          path={page.path}
          key={`page-${pageIdx}`}
          element={
            <Layout location={page.location} title={page.location} liquid={page.liquid}>
              <page.element />
            </Layout>
          }
        />
      ))}
      {redirects.map((redirect, redirectIdx) => (
        <Route path={redirect.from} key={`redirect-${redirectIdx}`} element={<Navigate replace to={redirect.to} />} />
      ))}
    </Routes>
  </BrowserRouter>
)

export default App
