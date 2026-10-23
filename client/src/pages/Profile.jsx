import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Boton, Chip } from '../components/ui';

export default function Profile() {
  const { user, logout } = useAuth();
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const projects = [
    { id: 1, title: 'Sistema DFD y Dictionaries', category: 'systems' },
    { id: 2, title: 'Dashboard React Fullstack', category: 'web' },
    { id: 3, title: 'API REST Node.js', category: 'backend' }
  ];

  const filteredProjects = projects.filter(p => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  // Santy: le di formato con el diseño, tus datos y filtros siguen igual - Rojo
  const filtros = [
    { id: 'all', texto: 'Todos' },
    { id: 'systems', texto: 'Sistemas' },
    { id: 'web', texto: 'Web' },
    { id: 'backend', texto: 'Backend' },
  ];
  const colores = { systems: '#7C9CE4', web: '#C29FE6', backend: '#B6D76E' };

  return (
    <>
      <Navbar />
      <header className="border-b border-pizarra/60 bg-grafito/60 pt-[72px]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-6 px-4 py-12 sm:px-8">
          <div className="flex items-center gap-5">
            <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-fexx font-display text-[36px] font-bold text-tinta">
              {(user?.name ?? 'U').slice(0, 1).toUpperCase()}
            </span>
            <div className="flex flex-col gap-1.5">
              <span className="etiqueta text-fexx">{user?.role === 'admin' ? 'Administrador' : 'Mi cuenta'}</span>
              <h1 className="m-0 text-[clamp(28px,4vw,40px)] leading-tight">{user ? `Hola, ${user.name}` : 'Vista de visitante'}</h1>
              {user && <span className="text-niebla">{user.email}</span>}
            </div>
          </div>
          {user ? (
            <div className="flex flex-wrap gap-3">
              {user.role === 'admin' && (
                <Boton variante="secundario" onClick={() => navigate('/admin')}>Panel admin</Boton>
              )}
              <Boton variante="secundario" onClick={logout}>Cerrar sesión</Boton>
            </div>
          ) : (
            <Boton onClick={() => navigate('/login')}>Iniciar sesión</Boton>
          )}
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-14 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="m-0 text-[28px]">Proyectos</h2>
          <div role="group" aria-label="Filtrar proyectos" className="flex flex-wrap gap-2">
            {filtros.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`min-h-10 cursor-pointer rounded-full border-[1.5px] px-4 text-sm font-semibold transition-colors duration-200 ${
                  filter === f.id ? 'border-fexx bg-fexx text-tinta' : 'border-pizarra bg-transparent text-papel hover:border-niebla'
                }`}
              >
                {f.texto}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="flex items-center gap-4 rounded-2xl bg-grafito p-5 transition-transform duration-300 ease-salida hover:-translate-y-1"
            >
              <span className="h-12 w-1.5 shrink-0 rounded-full" style={{ background: colores[project.category] ?? '#EE8E80' }} />
              <div className="flex flex-col gap-2">
                <h3 className="m-0 text-lg">{project.title}</h3>
                <div><Chip>{project.category}</Chip></div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
