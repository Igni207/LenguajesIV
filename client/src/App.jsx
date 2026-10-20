import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuiaDeEstilo from './pages/GuiaDeEstilo';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import LoginModal from './components/LoginModal';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/guia" replace />} />
          <Route path="/guia" element={<GuiaDeEstilo />} />

          {/* Login */}
          <Route path="/login" element={<LoginModal isOpen={true} isStandalone={true} />} />

          {/* Panel de administrador */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Admin />
              </ProtectedRoute>
            } 
          />

          {/* Perfil de usuario */}
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/guia" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}