import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const [filter, setFilter] = useState('all');

  const projects = [
    { id: 1, title: 'Sistema DFD y Dictionaries', category: 'systems' },
    { id: 2, title: 'Dashboard React Fullstack', category: 'web' },
    { id: 3, title: 'API REST Node.js', category: 'backend' }
  ];

  const filteredProjects = projects.filter(p => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Perfil de Desarrollador</h1>
          {user ? (
            <p className="text-gray-600">Bienvenido, <span className="font-semibold">{user.name}</span> ({user.email})</p>
          ) : (
            <p className="text-gray-500">Vista de Visitante / Público</p>
          )}
        </div>
        {user ? (
          <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Cerrar Sesión
          </button>
        ) : (
          <a href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Iniciar Sesión
          </a>
        )}
      </div>

      <div className="mb-6 flex gap-2">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Todos</button>
        <button onClick={() => setFilter('systems')} className={`px-4 py-2 rounded-lg ${filter === 'systems' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Sistemas</button>
        <button onClick={() => setFilter('web')} className={`px-4 py-2 rounded-lg ${filter === 'web' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Web</button>
        <button onClick={() => setFilter('backend')} className={`px-4 py-2 rounded-lg ${filter === 'backend' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Backend</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map(project => (
          <div key={project.id} className="p-4 border rounded-xl shadow-sm bg-white">
            <h3 className="font-bold text-lg text-gray-800">{project.title}</h3>
            <span className="text-xs uppercase px-2 py-1 bg-indigo-100 text-indigo-700 rounded mt-2 inline-block">
              {project.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}