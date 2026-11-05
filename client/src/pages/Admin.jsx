import { useState, useEffect } from 'react';
import { Boton, Chip, Modal, Campo, useToast } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

// Si VITE_API_URL no está definida, se usan rutas relativas (/api/...):
// en desarrollo las atiende el proxy de Vite y en producción el rewrite de Vercel.
const API = import.meta.env.VITE_API_URL || '';

// Texto para mostrar cuando algo falla: el mensaje del servidor, nunca la respuesta completa.
function mensajeDeError(data, porDefecto) {
  const detalle = data?.errores ? Object.values(data.errores)[0] : data?.mensaje;
  return detalle || porDefecto;
}

// Pide una lista al servidor. Si algo falla devuelve [] sin escribir nada en la consola.
async function pedirLista(url, token) {
  try {
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default function Admin() {
  const { user } = useAuth();
  const { mostrar } = useToast();
  const [vistaActiva, setVistaActiva] = useState('dashboard');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [proyectoEditando, setProyectoEditando] = useState(null); 
  const [triggerRecargaProyectos, setTriggerRecargaProyectos] = useState(0);

  const handleAbrirModal = async (proyecto = null) => {
    if (!proyecto) {
      setProyectoEditando(null);
      setModalAbierto(true);
      return;
    }
    // La lista viene resumida (sin tecnologías ni URLs): pedimos la ficha completa
    // para precargar todos los campos y que no se borren al guardar.
    try {
      const res = await fetch(`${API}/api/projects/${proyecto.id}`, {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (!res.ok) throw new Error('ficha no disponible');
      const ficha = await res.json();
      setProyectoEditando({
        ...proyecto,
        tecnologias: ficha.tecnologias ?? '',
        repositorio: ficha.repoUrl ?? '',
        demo: ficha.demoUrl ?? ''
      });
      setModalAbierto(true);
    } catch {
      mostrar({
        tipo: 'error',
        titulo: 'No se pudo abrir el proyecto',
        mensaje: 'No se pudieron cargar sus datos completos. Intentá de nuevo.'
      });
    }
  };

  const handleGuardarProyecto = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const datosProyecto = {
      titulo: formData.get('titulo'),
      tipo: formData.get('tipo'),
      autor: formData.get('autor'),
      tecnologias: formData.get('tecnologias'),
      repositorio: formData.get('repositorio'),
      demo: formData.get('demo'),
      destacado: document.getElementById('destacado').checked
    };

    const esEdicion = Boolean(proyectoEditando?.id);
    const url = esEdicion 
      ? `${API}/api/projects/${proyectoEditando.id}`
      : `${API}/api/projects`;
    const method = esEdicion ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(datosProyecto)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setModalAbierto(false);
        setTriggerRecargaProyectos(prev => prev + 1);
      } else {
        mostrar({
          tipo: 'error',
          titulo: 'No se pudo guardar',
          mensaje: mensajeDeError(data, 'Revisá los datos ingresados.')
        });
      }
    } catch {
      mostrar({
        tipo: 'error',
        titulo: 'Sin conexión',
        mensaje: 'No se pudo conectar con el servidor.'
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-tinta text-papel md:flex-row font-sans">
      <aside className="border-pizarra bg-grafito md:w-64 md:border-r p-6 flex flex-col gap-8 order-last md:order-first border-t md:border-t-0 fixed bottom-0 w-full md:relative md:w-auto z-20">
        <div className="hidden md:block">
          <span className="etiqueta text-fexx">Operador</span>
          <h2 className="text-2xl mt-1 font-display font-bold">Panel Admin</h2>
        </div>
        <nav className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
          <Boton variante={vistaActiva === 'dashboard' ? 'primario' : 'fantasma'} color="fexx" anchoCompleto onClick={() => setVistaActiva('dashboard')}>Dashboard</Boton>
          <Boton variante={vistaActiva === 'proyectos' ? 'primario' : 'fantasma'} color="fexx" anchoCompleto onClick={() => setVistaActiva('proyectos')}>Proyectos</Boton>
          <Boton variante={vistaActiva === 'consultas' ? 'primario' : 'fantasma'} color="fexx" anchoCompleto onClick={() => setVistaActiva('consultas')}>Consultas</Boton>
          <Boton variante={vistaActiva === 'usuarios' ? 'primario' : 'fantasma'} color="fexx" anchoCompleto onClick={() => setVistaActiva('usuarios')}>Usuarios</Boton>
        </nav>
        <a href="/" className="hidden md:flex mt-auto items-center gap-2 text-sm font-medium text-niebla no-underline hover:text-papel">← Volver al sitio</a>
      </aside>

      <main className="flex-1 p-6 md:p-12 mb-24 md:mb-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {vistaActiva === 'dashboard' && <VistaDashboard user={user} />}
          {vistaActiva === 'proyectos' && <VistaProyectos abrirModal={handleAbrirModal} user={user} key={triggerRecargaProyectos} />}
          {vistaActiva === 'consultas' && <VistaConsultas user={user} />}
          {vistaActiva === 'usuarios' && <VistaUsuarios user={user} />}
        </div>
      </main>

      <Modal 
        abierto={modalAbierto} 
        onCerrar={() => setModalAbierto(false)} 
        titulo={proyectoEditando ? "Editar Proyecto" : "Nuevo Proyecto"}
        ancho={600}
      >
        <form key={proyectoEditando ? proyectoEditando.id : 'nuevo'} className="flex w-full flex-col gap-5 mt-4 text-left" onSubmit={handleGuardarProyecto}>
          <Campo name="titulo" etiqueta="Título del Proyecto" defaultValue={proyectoEditando?.titulo || ''} placeholder="Ej: Portfolio Fullstack" />
          
          <div className="grid grid-cols-2 gap-4">
            <Campo name="tipo" etiqueta="Tipo" defaultValue={proyectoEditando?.tipo || ''} placeholder="Frontend, Backend, etc." />
            <Campo name="autor" etiqueta="Autor" defaultValue={proyectoEditando?.autor || ''} placeholder="Tu nombre o equipo" />
          </div>

          <Campo name="tecnologias" etiqueta="Tecnologías (separadas por coma)" defaultValue={proyectoEditando?.tecnologias || ''} placeholder="React, Node, Tailwind..." />
          <Campo name="repositorio" etiqueta="URL del Repositorio" type="url" defaultValue={proyectoEditando?.repositorio || ''} placeholder="https://github.com/..." />
          <Campo name="demo" etiqueta="URL de la Demo (Opcional)" type="url" defaultValue={proyectoEditando?.demo || ''} placeholder="https://..." />
          
          <div className="flex items-center gap-3 mt-2">
            <input type="checkbox" id="destacado" defaultChecked={proyectoEditando?.destacado} className="size-5 accent-fexx" />
            <label htmlFor="destacado" className="text-sm font-semibold text-papel">Marcar como Proyecto Destacado</label>
          </div>

          <div className="mt-6 flex gap-3 w-full">
            <Boton variante="secundario" anchoCompleto onClick={() => setModalAbierto(false)}>Cancelar</Boton>
            <Boton type="submit" color="fexx" anchoCompleto>{proyectoEditando ? "Actualizar Proyecto" : "Guardar Proyecto"}</Boton>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// --- SUBCOMPONENTES ---

function VistaDashboard({ user }) {
  const [metricas, setMetricas] = useState({ visitas: 0, usuarios: 0, consultas: 0 });
  const [datosEvolucion, setDatosEvolucion] = useState([]);
  const [datosOrigen, setDatosOrigen] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    if (!user?.token) return;
    setCargando(true);

    let url = `${API}/api/metrics`;
    const params = new URLSearchParams();
    if (fechaInicio) params.append('inicio', fechaInicio);
    if (fechaFin) params.append('fin', fechaFin);
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        // Si el servidor responde con un error, se conservan los valores por defecto
        if (data) {
          setMetricas(data.totales || { visitas: 0, usuarios: 0, consultas: 0 });
          setDatosEvolucion(data.evolucion || []);
          setDatosOrigen(data.origen || []);
        }
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [user, fechaInicio, fechaFin]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <h1 className="text-3xl font-display font-bold text-fexx m-0">Dashboard de Métricas</h1>
        
        <div className="flex flex-wrap items-end gap-3 bg-grafito p-3 rounded-2xl border border-pizarra">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase text-niebla">Desde</label>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="bg-tinta border border-pizarra text-papel rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-fexx" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase text-niebla">Hasta</label>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="bg-tinta border border-pizarra text-papel rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-fexx" />
          </div>
          {(fechaInicio || fechaFin) && (
            <Boton variante="fantasma" color="niebla" tamaño="sm" onClick={() => {setFechaInicio(''); setFechaFin('');}}>Limpiar</Boton>
          )}
        </div>
      </div>

      {cargando ? (
        <div className="text-niebla animate-pulse">cargando métricas...</div>
      ) : (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <TarjetaMetrica titulo="Visitas Totales" valor={metricas.visitas} color="text-fexx" />
            <TarjetaMetrica titulo="Usuarios Registrados" valor={metricas.usuarios} color="text-ssanty" />
            <TarjetaMetrica titulo="Consultas Pendientes" valor={metricas.consultas} color="text-rojo" />
          </section>
          
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 rounded-3xl border border-pizarra bg-grafito/50 p-6 sm:p-8">
              <h3 className="m-0 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-niebla mb-6">
                {fechaInicio || fechaFin ? 'Evolución de Tráfico (Período Seleccionado)' : 'Evolución de Tráfico (Últimos 7 días)'}
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datosEvolucion} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3f52" vertical={false} />
                    <XAxis dataKey="dia" stroke="#9ba1b3" fontSize={13} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ba1b3" fontSize={13} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#161923', borderColor: '#3a3f52', borderRadius: '8px', color: '#eeebe4' }} itemStyle={{ fontWeight: 'bold' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                    <Line type="monotone" name="Visitas" dataKey="visitas" stroke="#7C9CE4" strokeWidth={3} activeDot={{ r: 6 }} dot={false} />
                    <Line type="monotone" name="Usuarios" dataKey="usuarios" stroke="#C29FE6" strokeWidth={3} activeDot={{ r: 6 }} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-3xl border border-pizarra bg-grafito/50 p-6 sm:p-8 flex flex-col">
              <h3 className="m-0 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-niebla mb-6">Origen del Registro</h3>
              <div className="h-72 w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosOrigen} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3f52" vertical={false} />
                    <XAxis dataKey="origen" stroke="#9ba1b3" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ba1b3" fontSize={13} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#20242f' }} contentStyle={{ backgroundColor: '#161923', borderColor: '#3a3f52', borderRadius: '8px', color: '#eeebe4' }} />
                    <Bar dataKey="cantidad" name="Registros" fill="#B6D76E" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

function VistaProyectos({ abrirModal, user }) {
  const { mostrar } = useToast();
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarProyectos = async () => {
    if (!user?.token) return;
    setProyectos(await pedirLista(`${API}/api/projects`, user.token));
    setCargando(false);
  };

  useEffect(() => {
    cargarProyectos();
  }, [user]);

  const handleEliminarProyecto = async (id) => {
    if (!window.confirm("¿Seguro querés eliminar este proyecto?")) return;
    try {
      const res = await fetch(`${API}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (res.ok) {
        cargarProyectos();
      } else {
        const data = await res.json().catch(() => ({}));
        mostrar({
          tipo: 'error',
          titulo: 'No se pudo dar de baja',
          mensaje: mensajeDeError(data, 'Intentá de nuevo.')
        });
      }
    } catch {
      mostrar({ tipo: 'error', titulo: 'Sin conexión', mensaje: 'No se pudo conectar con el servidor.' });
    }
  };

  if (cargando) return <div className="text-niebla animate-pulse">cargando proyectos...</div>;

  return (
    <>
      <h1 className="text-3xl font-display font-bold text-fexx mb-8">Gestión de Proyectos</h1>
      <section className="flex flex-col gap-5 rounded-3xl border border-pizarra bg-grafito/50 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="m-0 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-niebla">Listado de Proyectos</h3>
          <Boton color="fexx" onClick={() => abrirModal(null)}>Nuevo Proyecto +</Boton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm table-fixed">
            <thead className="border-b border-pizarra text-niebla">
              <tr>
                <th className="pb-3 font-medium">Título</th>
                <th className="pb-3 font-medium">Tipo</th>
                <th className="pb-3 font-medium">Autor</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pizarra/50">
              {proyectos.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-grafito group">
                  <td className="py-4 font-semibold pr-4">{p.titulo}</td>
                  <td className="py-4 text-niebla pr-4">{p.tipo}</td>
                  <td className="py-4 text-niebla pr-4">{p.autor}</td>
                  <td className="py-4 pr-4">
                    {p.destacado ? <Chip tono="exito">Destacado</Chip> : <Chip tono="neutro">Normal</Chip>}
                  </td>
                  <td className="py-4 text-right flex gap-2 justify-end">
                    <Boton variante="secundario" tamaño="md" onClick={() => abrirModal(p)}>Editar</Boton>
                    <Boton variante="fantasma" color="error" tamaño="md" onClick={() => handleEliminarProyecto(p.id)}>Baja</Boton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function VistaConsultas({ user }) {
  const { mostrar } = useToast();
  const [consultas, setConsultas] = useState([]);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);
  const [textoRespuesta, setTextoRespuesta] = useState('');
  
  // Estados para los filtros
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('TODOS'); // 'TODOS' por defecto

  const cargarConsultas = async () => {
    if (!user?.token) return;
    setConsultas(await pedirLista(`${API}/api/consultas`, user.token));
  };

  useEffect(() => {
    cargarConsultas();
  }, [user]);

  const handleEnviarRespuesta = async (e) => {
    e.preventDefault();
    if (!textoRespuesta.trim() || !consultaSeleccionada) return;

    try {
      const res = await fetch(`${API}/api/consultas/${consultaSeleccionada.id}/responder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ respuesta: textoRespuesta })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setConsultaSeleccionada(null);
        setTextoRespuesta('');
        cargarConsultas();
      } else {
        mostrar({
          tipo: 'error',
          titulo: 'No se pudo enviar la respuesta',
          mensaje: mensajeDeError(data, 'Intentá de nuevo.')
        });
      }
    } catch {
      mostrar({ tipo: 'error', titulo: 'Sin conexión', mensaje: 'No se pudo conectar con el servidor.' });
    }
  };

  // Lógica de filtrado combinando tipo y fechas
  const consultasFiltradas = consultas.filter(c => {
    // 1. Filtro por tipo exacto (si no es 'TODOS', comparamos)
    if (tipoSeleccionado !== 'TODOS' && c.tipo !== tipoSeleccionado) {
      return false;
    }

    // 2. Filtro por rango de fechas
    if (!fechaInicio && !fechaFin) return true;
    
    const [dia, mes, anio] = c.fecha.split('/');
    const fechaConsulta = new Date(anio, mes - 1, dia);
    
    const inicio = fechaInicio ? new Date(fechaInicio + 'T00:00:00') : null;
    const fin = fechaFin ? new Date(fechaFin + 'T23:59:59') : null;

    if (inicio && fechaConsulta < inicio) return false;
    if (fin && fechaConsulta > fin) return false;
    
    return true;
  });

  return (
    <>
      <h1 className="text-3xl font-display font-bold text-fexx mb-8">Consultas Pendientes</h1>
      
      <section className="flex flex-col gap-6 rounded-3xl border border-pizarra bg-grafito/50 p-6 sm:p-8">
        <div className="flex flex-col gap-4">
          <h3 className="m-0 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-niebla">Bandeja de Entrada</h3>
          
          {/* Botones de selección rápida por Tipo */}
          <div className="flex flex-wrap gap-2">
            {['TODOS', 'Consulta general', 'Cotizacion del proyecto', 'Asesoria tecnica'].map((tipo) => {
              const activo = tipoSeleccionado === tipo;
              // Mapeamos un texto amigable para mostrar en el botón
              let label = tipo;
              if (tipo === 'TODOS') label = 'Todos';
              
              return (
                <button
                  key={tipo}
                  onClick={() => setTipoSeleccionado(tipo)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
                    activo 
                      ? 'bg-fexx text-tinta border-fexx font-bold shadow-lg shadow-fexx/20' 
                      : 'bg-tinta text-niebla border-pizarra hover:text-papel hover:border-niebla'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Selector de Fechas y Limpieza */}
          <div className="flex flex-wrap items-end justify-between gap-3 bg-tinta p-3 rounded-2xl border border-pizarra">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-niebla">Desde</label>
                <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="bg-grafito border border-pizarra text-papel rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-fexx" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-niebla">Hasta</label>
                <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="bg-grafito border border-pizarra text-papel rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-fexx" />
              </div>
            </div>

            {(fechaInicio || fechaFin || tipoSeleccionado !== 'TODOS') && (
              <Boton variante="fantasma" color="niebla" tamaño="sm" onClick={() => {setFechaInicio(''); setFechaFin(''); setTipoSeleccionado('TODOS');}}>Restablecer Filtros</Boton>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm table-fixed">
            <thead className="border-b border-pizarra text-niebla">
              <tr>
                <th className="pb-3 font-medium">Remitente</th>
                <th className="pb-3 font-medium">Tipo</th>
                <th className="pb-3 font-medium">Fecha</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pizarra/50">
              {consultasFiltradas.length > 0 ? consultasFiltradas.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-grafito group">
                  <td className="py-4 font-semibold flex flex-col pr-4">
                    <span>{c.remitente}</span>
                    <span className="text-niebla font-normal text-xs">{c.email}</span>
                  </td>
                  <td className="py-4 text-niebla pr-4">{c.tipo}</td>
                  <td className="py-4 text-niebla pr-4">{c.fecha}</td>
                  <td className="py-4 pr-4">
                    {c.estado === 'Pendiente' ? <Chip tono="advertencia">Pendiente</Chip> : <Chip tono="exito">Respondida</Chip>}
                  </td>
                  <td className="py-4 text-right">
                    <Boton variante="secundario" tamaño="md" onClick={() => setConsultaSeleccionada(c)}>Responder</Boton>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-niebla">No hay consultas que coincidan con los filtros seleccionados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal para redactar la respuesta */}
      {consultaSeleccionada && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-grafito border border-pizarra rounded-3xl p-6 sm:p-8 max-w-lg w-full flex flex-col gap-4 shadow-2xl">
            <h3 className="text-xl font-display font-bold text-fexx">Responder a {consultaSeleccionada.remitente}</h3>
            <p className="text-sm text-niebla m-0">Correo: {consultaSeleccionada.email}</p>
            
            <div className="rounded-xl border border-pizarra/60 bg-tinta/50 p-4 text-sm text-papel/90 my-1">
              <span className="text-xs font-mono uppercase text-niebla block mb-1">Consulta recibida:</span>
              <p className="m-0 italic break-words">"{consultaSeleccionada.mensaje || 'Sin mensaje'}"</p>
            </div>

            <form onSubmit={handleEnviarRespuesta} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono uppercase tracking-wider text-niebla">Tu respuesta</label>
                <textarea 
                  rows="4"
                  value={textoRespuesta}
                  onChange={(e) => setTextoRespuesta(e.target.value)}
                  placeholder="Escribí tu respuesta aquí..."
                  className="w-full rounded-xl border border-pizarra bg-tinta p-3 text-papel text-sm focus:outline-none focus:border-fexx"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <Boton variante="secundario" onClick={() => { setConsultaSeleccionada(null); setTextoRespuesta(''); }}>Cancelar</Boton>
                <Boton type="submit" color="fexx">Enviar Respuesta</Boton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
function VistaUsuarios({ user }) {
  const { mostrar } = useToast();
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = async () => {
    if (!user?.token) return;
    setUsuarios(await pedirLista(`${API}/api/users`, user.token));
  };
  
  useEffect(() => {
    cargarUsuarios();
  }, [user]);

  const handleEliminarUsuario = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      const res = await fetch(`${API}/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (res.ok) {
        cargarUsuarios();
      } else {
        const data = await res.json().catch(() => ({}));
        mostrar({
          tipo: 'error',
          titulo: 'No se pudo eliminar',
          mensaje: mensajeDeError(data, 'Intentá de nuevo.')
        });
      }
    } catch {
      mostrar({ tipo: 'error', titulo: 'Sin conexión', mensaje: 'No se pudo conectar con el servidor.' });
    }
  };
  
  return (
    <>
      <h1 className="text-3xl font-display font-bold text-fexx mb-8">Gestión de Usuarios</h1>
      <section className="flex flex-col gap-5 rounded-3xl border border-pizarra bg-grafito/50 p-6 sm:p-8">
        <h3 className="m-0 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-niebla">Usuarios Registrados</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm table-fixed">
            <thead className="border-b border-pizarra text-niebla">
              <tr>
                <th className="pb-3 font-medium">Usuario</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Origen de Registro</th>
                <th className="pb-3 font-medium">Rol</th>
                <th className="pb-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pizarra/50">
              {usuarios.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-grafito group">
                  <td className="py-4 font-semibold pr-4">{u.nombre}</td>
                  <td className="py-4 text-niebla pr-4">{u.email}</td>
                  <td className="py-4 text-niebla pr-4">{u.origen}</td>
                  <td className="py-4 text-niebla pr-4">{u.rol}</td>
                  <td className="py-4 text-right">
                    <Boton variante="fantasma" color="error" tamaño="md" onClick={() => handleEliminarUsuario(u.id)}>Eliminar</Boton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function TarjetaMetrica({ titulo, valor, color }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-pizarra bg-grafito p-6 transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-fexx/5 cursor-default">
      <span className="font-mono text-[13px] uppercase tracking-wider text-niebla">{titulo}</span>
      <span className={`text-5xl font-bold font-mono ${color}`}>{valor}</span>
    </div>
  );
}

