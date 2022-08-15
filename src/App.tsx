import Layout from './components/layout'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AboutPage, ProfilePage, FeupExchangePage, TimeTableSchedulerPage, NotFoundPage, FaqsPage } from './pages'
import './app.css'

const pages = [
  { path: '/tts/about', location: 'About', element: AboutPage, liquid: true },
  { path: '/tts/profile', location: 'Profile', element: ProfilePage, liquid: true },
  { path: '/tts/planner', location: 'Planner', element: TimeTableSchedulerPage, liquid: true },
  { path: '/tts/exchange', location: 'Exchange', element: FeupExchangePage, liquid: true },
  { path: '/tts/faqs', location: 'FAQs', element: FaqsPage, liquid: true },
  { path: '/tts/*', location: 'NotFound', element: NotFoundPage, liquid: true },
]

const redirects = [
  { from: '/tts', to: '/tts/planner' },
  { from: '/tts/home', to: '/tts/about' },
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
