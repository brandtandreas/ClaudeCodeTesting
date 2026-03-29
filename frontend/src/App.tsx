import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Train from './pages/Train'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import ProtectedRoute from './components/Auth/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <div style={{ display: 'flex', flex: 1 }}>
                  <Sidebar />
                  <main style={{ flex: 1, padding: '24px' }}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/train/:openingId" element={<Train />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
