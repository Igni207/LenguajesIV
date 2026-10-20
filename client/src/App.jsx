import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuiaDeEstilo from './pages/GuiaDeEstilo';
import Admin from './pages/Admin';
import LoginModal from './components/LoginModal';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/guia" replace />} />
          <Route path="/guia" element={<GuiaDeEstilo />} />
          
          {/* Ruta de Login / Modal */}
          <Route path="/login" element={<LoginModal isOpen={true} onClose={() => window.history.back()} />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}