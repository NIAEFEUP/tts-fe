import Layout from './components/layout'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AboutPage, ProfilePage, FeupExchangePage, TimeTableSchedulerPage, NotFoundPage, FaqsPage } from './pages'
import './app.css'

const pages = [
  { path: '/about', location: 'About', element: AboutPage, liquid: true },
  { path: '/profile', location: 'Profile', element: ProfilePage, liquid: true },
  { path: '/planner', location: 'Planner', element: TimeTableSchedulerPage, liquid: true },
  { path: '/exchange', location: 'Exchange', element: FeupExchangePage, liquid: true },
  { path: '/faqs', location: 'FAQs', element: FaqsPage, liquid: true },
  { path: '/*', location: 'NotFound', element: NotFoundPage, liquid: true },
]

const redirects = [
  { from: '/', to: '/planner' },
  { from: '/home', to: '/about' },
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
