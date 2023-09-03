import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App'


import './index.css'
import CreateConversation from './pages/CreateConversation';
import LandingPage from './pages/LandingPage'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Conversations" element={<App />} />
        <Route path="/CreateConversation" element={<CreateConversation />} />
      </Routes>
      </BrowserRouter>
  </React.StrictMode>
)
