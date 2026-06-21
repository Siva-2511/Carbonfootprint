/**
 * @fileoverview Application entry point for CarbonSense.
 * Mounts the root React component inside a StrictMode wrapper onto the #root DOM element.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
