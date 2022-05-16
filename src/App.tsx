import React from 'react'
import Layout from './components/layout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage, ProfilePage, SchedulePage, FeupExchangePage, TimeTableSchedulerPage } from './pages'
import './index.css'

const pages = [
  { path: '/', location: 'Home', element: HomePage, liquid: true },
  { path: '/profile', location: 'Profile', element: ProfilePage, liquid: false },
  { path: '/schedule', location: 'Schedule', element: SchedulePage, liquid: true },
  { path: '/tts', location: 'Planner', element: TimeTableSchedulerPage, liquid: true },
  { path: '/feupexchange', location: 'Exchange', element: FeupExchangePage, liquid: true },
]

const App = () => (
  <BrowserRouter>
    <Routes>
      {pages.map((page, pageIdx) => (
        <Route
          path={page.path}
          key={`page-${pageIdx}`}
          element={
            <Layout location={page.location} liquid={page.liquid}>
              <page.element />
            </Layout>
          }
        />
      ))}
    </Routes>
  </BrowserRouter>
)

export default App
