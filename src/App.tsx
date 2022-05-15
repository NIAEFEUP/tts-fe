import React from 'react'
import Layout from './components/layout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage, ProfilePage, SchedulePage, FeupExchangePage, TimeTableSchedulerPage } from './pages'
import './index.css'

const pages = [
  { path: '/', location: 'Home', element: HomePage },
  { path: '/profile', location: 'Profile', element: ProfilePage },
  { path: '/schedule', location: 'Schedule', element: SchedulePage },
  { path: '/tts', location: 'Time Table Selector', element: TimeTableSchedulerPage },
  { path: '/feupexchange', location: 'Exchange', element: FeupExchangePage },
]

const App = () => (
  <BrowserRouter>
    <Routes>
      {pages.map((page, pageIdx) => (
        <Route
          path={page.path}
          key={`page-${pageIdx}`}
          element={
            <Layout location={page.location}>
              <page.element />
            </Layout>
          }
        />
      ))}
    </Routes>
  </BrowserRouter>
)

export default App
