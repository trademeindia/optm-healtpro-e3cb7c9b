
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/base.css'
import './App.css'
import './styles/main.css'
import { Toaster } from 'sonner'

console.log('Main renderer starting...')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster position="bottom-right" richColors closeButton />
  </React.StrictMode>,
)

console.log('Main renderer initialized')
