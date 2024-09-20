import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const strictMode = false
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(strictMode
  ?
  <React.StrictMode>
    <App />
  </React.StrictMode>
  : <App />)
