import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './i18n/config'
import App from './App'
import AppErrorBoundary from './components/AppErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>,
)
