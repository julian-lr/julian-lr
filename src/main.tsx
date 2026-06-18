import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import ThemeInitializer from './ThemeInitializer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeInitializer />
    <App />
  </StrictMode>,
)
