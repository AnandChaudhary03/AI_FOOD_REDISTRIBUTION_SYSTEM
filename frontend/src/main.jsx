import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n/i18n.js'
import { registerSW } from 'virtual:pwa-register'

registerSW({ onNeedRefresh() {}, onOfflineReady() { console.log('AnnaSetu is ready for offline use!') } })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
