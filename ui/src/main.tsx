import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

const rootElement = document.getElementById('root')
if (rootElement) {
  rootElement.style.margin = '0 auto'
}

createRoot(rootElement!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
