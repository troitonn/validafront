import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' // Adicionado
import './index.css'
import App from './App.js'
import Dashboard from './pages/Dashboard.js'
import PrivateRoute from './components/PrivateRoute.js'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota da tela de Login */}
        <Route path="/" element={<App />} />
        
        {/* Rota Protegida do Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
