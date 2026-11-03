import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Inicio from './pages/Inicio';
import GuiaDeEstilo from './pages/GuiaDeEstilo';
import NoEncontrada from './pages/NoEncontrada';
import PerfilIntegrante from './pages/PerfilIntegrante';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import LoginModal from './components/LoginModal';
import ProyectoDetalle from './pages/ProyectoDetalle';

// Componente para registrar las visitas cada vez que cambia el pathname
function VisitTracker() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/visits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
      },
      body: JSON.stringify({ ruta: location.pathname })
    }).catch(() => {});
  }, [location.pathname, user]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <VisitTracker /> {/* Se ejecuta dentro del Router para registrar el tráfico */}
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

          {/* Santy: el detalle de proyecto pide sesión, como dice la consigna - Rojo */}
          <Route
            path="/proyectos/:clave"
            element={
              <ProtectedRoute>
                <ProyectoDetalle />
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