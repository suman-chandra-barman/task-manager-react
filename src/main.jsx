import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeContext, themes } from './context/ThemeContext.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeContext.Provider value={themes}>
      <App />
    </ThemeContext.Provider>
  </StrictMode>,
)
