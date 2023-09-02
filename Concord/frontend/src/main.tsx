import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App'
import About from "./Components/About";

import './index.css'
import CreateConversation from './Components/CreateConversation';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/CreateConversation" element={<CreateConversation />} />
      </Routes>
      </BrowserRouter>
  </React.StrictMode>
)
