import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Login from './pages/Login.tsx'
import Dashboard from './pages/Dashboard.tsx'
import PrivateRoute from './routes/PrivateRoute.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota principal agora usa o componente Login com fundo 3D */}
        <Route path="/" element={<Login />} />
        
        {/* Rota protegida */}
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
