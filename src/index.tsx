import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const strictMode = false
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

strictMode
  ? root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  : root.render(<App />)
