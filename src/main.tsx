import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SamplesApp from './samples/SamplesApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SamplesApp />
  </StrictMode>,
)
