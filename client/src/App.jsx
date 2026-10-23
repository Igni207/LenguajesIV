import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Inicio from './pages/Inicio';
import GuiaDeEstilo from './pages/GuiaDeEstilo';
import NoEncontrada from './pages/NoEncontrada';
import PerfilIntegrante from './pages/PerfilIntegrante';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import LoginModal from './components/LoginModal';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Santy: la home ahora está en "/" - Rojo */}
          <Route path="/" element={<Inicio />} />
          <Route path="/guia" element={<GuiaDeEstilo />} />
          <Route path="/equipo/:slug" element={<PerfilIntegrante />} />

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

          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}