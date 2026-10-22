import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

  // Santy: le di formato con el diseño, la lógica es la tuya tal cual - Rojo
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

  if (!isStandalone) {
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

  return (
    <div className="flex min-h-[100svh] bg-tinta">
      <aside aria-hidden="true" className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-grafito p-14 lg:flex">
        <pre className="absolute inset-x-0 top-0 m-0 animate-codigo whitespace-pre px-14 py-10 font-mono text-[13px] leading-[1.8] text-niebla/15">
          {Array(4).fill("if (!session) return <Navigate to=\"/login\" />;\nconst { user } = useContext(AuthContext);\nconst proyectos = await api('/projects');\njwt.verify(token, SECRET);\nres.status(401).json({ error: 'Sesión requerida' });\n").join('')}
        </pre>
        <a href="/" className="relative font-display text-[22px] font-bold text-papel no-underline">
          [equipo]<span className="text-fexx">_</span>
        </a>
        <div className="relative flex max-w-[520px] flex-col gap-8">
          <div className="flex h-28 items-end gap-3">
            {['#7C9CE4', '#C29FE6', '#B6D76E', '#EE8E80'].map((c, i) => (
              <div key={c} className="flex w-14 items-end overflow-hidden rounded-xl bg-tinta" style={{ height: `${[100, 80, 92, 72][i]}%`, rotate: `${[-4, 3, -2, 5][i]}deg` }}>
                <div className="h-[70%] w-full" style={{ background: c }} />
              </div>
            ))}
          </div>
          <h2 className="m-0 text-[44px] leading-[1.05]">Del otro lado del código hay más.</h2>
          <ul className="m-0 flex list-none flex-col gap-4 p-0 text-[17px]">
            {[
              'Todos los proyectos de cada integrante, no solo los destacados.',
              'Demos interactivas para probar cada proyecto.',
              'Detalle técnico: stack, rol de cada uno y repositorio.',
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B6D76E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <span className="relative font-mono text-xs text-niebla">Lenguajes IV · UCASAL · 2026</span>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-10">
        <a href="/" className="flex min-h-11 w-full max-w-[420px] items-center gap-2 text-sm font-medium text-niebla no-underline hover:text-papel">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          Volver al sitio
        </a>
        {formulario}
      </main>
    </div>
  );
}
