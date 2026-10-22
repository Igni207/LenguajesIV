import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose, isStandalone = false }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegister && name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 letras.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresá un correo electrónico válido.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    const isAdmin = email.toLowerCase().includes('admin');
    const userData = {
      name: isRegister ? name : (isAdmin ? 'Administrador' : 'Usuario'),
      email,
      role: isAdmin ? 'admin' : 'user'
    };

    login(userData);

    if (!isStandalone && onClose) {
      onClose();
    }

    const targetPath = from || (isAdmin ? '/admin' : '/perfil');
    navigate(targetPath, { replace: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {isRegister ? 'Registro Obligatorio' : 'Iniciar Sesión'}
          </h2>
          {!isStandalone && onClose && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold">
              ✕
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Mínimo 2 letras"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Mínimo 8 caracteres"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            {isRegister ? 'Registrarse y Continuar' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-indigo-600 hover:underline"
          >
            {isRegister ? '¿Ya tenés cuenta? Iniciá sesión' : '¿No tenés cuenta? Registrate'}
          </button>
        </div>
      </div>
    </div>
  );
}