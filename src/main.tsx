import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Members from './pages/Members.tsx'
import { captureUtm, loadTrackingTags } from './lib/tracking'

captureUtm()
loadTrackingTags()

// Routing lives only here — the landing page itself (App.tsx and its sections)
// stays exactly as-is at "/". /login and /membros are new, isolated pages for the
// backend's member area and don't touch anything under components/sections.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/membros" element={<Members />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
