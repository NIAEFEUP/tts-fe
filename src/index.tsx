import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './api/socket'
import { sessionsSocket } from './api/socket'

const strictMode = false
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

// sessionsSocket.connect();

// sessionsSocket.on('connected', data => {
//   console.log('Connected to sessions socket');
//   console.log(data);
// });

// sessionsSocket.onAny((event, data) => {
//   console.log('Received event from sessions socket');
//   console.log(event);
//   console.log(data);
// })

// sessionsSocket.on('disconnect', data => {
//   console.log('Disconnected from sessions socket');
//   console.log(data);
// });

// setTimeout(() => {
//   sessionsSocket.emit('test', 'Hello, world!');
// });

root.render(strictMode
  ?
  <React.StrictMode>
    <App />
  </React.StrictMode>
  : <App />)
