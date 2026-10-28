import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../data/api';
import { Boton, Campo } from './ui';

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

  const handleSubmit = async (e) => {
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

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? { name, email, password } : { email, password };

      const data = await api(endpoint, {
        method: 'POST',
        body: payload,
      });

      const userData = {
        name: data.user?.name || data.name || (isRegister ? name : 'Usuario'),
        email: data.user?.email || data.email || email,
        role: data.user?.role || data.role || 'user',
        token: data.token
      };

      login(userData);

      if (!isStandalone && onClose) {
        onClose();
      }

      const isAdmin = userData.role === 'admin';
      const targetPath = from || (isAdmin ? '/admin' : '/perfil');
      navigate(targetPath, { replace: true });

    } catch (err) {
      setError(err.message || err.error || 'No se pudo conectar con el servidor.');
    }
  };

  const formulario = (
    <div className="flex w-full max-w-[420px] flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-[32px] leading-tight sm:text-[36px]">
          {isRegister ? 'Creá tu cuenta' : 'Hola de nuevo'}
        </h1>
        <p className="m-0 text-niebla">
          {isRegister ? 'Es gratis y te lleva menos de un minuto.' : 'Ingresá para ver los proyectos y demos completos.'}
        </p>
      </div>

      <div role="tablist" aria-label="Tipo de acceso" className="flex gap-1 rounded-full bg-grafito p-1">
        <button
          type="button"
          role="tab"
          aria-selected={!isRegister}
          onClick={() => { setIsRegister(false); setError(''); }}
          className={`min-h-11 flex-1 cursor-pointer rounded-full text-[15px] font-semibold transition-colors duration-300 ${!isRegister ? 'bg-papel text-tinta' : 'bg-transparent text-niebla hover:text-papel'}`}
        >
          Ingresar
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isRegister}
          onClick={() => { setIsRegister(true); setError(''); }}
          className={`min-h-11 flex-1 cursor-pointer rounded-full text-[15px] font-semibold transition-colors duration-300 ${isRegister ? 'bg-papel text-tinta' : 'bg-transparent text-niebla hover:text-papel'}`}
        >
          Crear cuenta
        </button>
      </div>

      {error && (
        <div role="alert" className="animate-entrar rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {isRegister && (
          <Campo
            etiqueta="Nombre"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre y apellido"
          />
        )}
        <Campo
          etiqueta="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nombre@correo.com"
        />
        <Campo
          etiqueta="Contraseña"
          type="password"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
        />
        <Boton type="submit" tamaño="lg" anchoCompleto>
          {isRegister ? 'Crear cuenta' : 'Ingresar'}
        </Boton>
      </form>

      <p className="m-0 text-center text-sm text-niebla">
        {isRegister ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}
        <button
          type="button"
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
          className="cursor-pointer bg-transparent p-2 font-semibold text-fexx hover:text-papel"
        >
          {isRegister ? 'Ingresá' : 'Creá una'}
        </button>
      </p>
    </div>
  );

  if (isStandalone) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        {formulario}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-tinta/70 backdrop-blur-md" />
      <div role="dialog" aria-modal="true" className="relative flex w-full max-w-[480px] justify-center rounded-3xl border border-pizarra bg-tinta px-6 pb-8 pt-12 sm:px-8">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-3 top-3 flex size-11 cursor-pointer items-center justify-center rounded-full bg-transparent text-niebla hover:text-papel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        )}
        {formulario}
      </div>
    </div>
  );
}