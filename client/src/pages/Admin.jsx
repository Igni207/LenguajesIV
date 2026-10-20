import { useState, useEffect } from 'react';
import { Boton, Chip, Modal, Campo } from '../components/ui';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function Admin() {
  const [vistaActiva, setVistaActiva] = useState('dashboard');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [proyectoEditando, setProyectoEditando] = useState(null); 
  const handleAbrirModal = (proyecto = null) => {
    setProyectoEditando(proyecto);
    setModalAbierto(true);
  };
  return (
    <div className="flex min-h-screen flex-col bg-tinta text-papel md:flex-row font-sans">
      
      {/* barra lateral e inferior */}
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
      </aside>

      {/* main */}
      <main className="flex-1 p-6 md:p-12 mb-24 md:mb-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {vistaActiva === 'dashboard' && <VistaDashboard />}
          {vistaActiva === 'proyectos' && <VistaProyectos abrirModal={handleAbrirModal} />}
          {vistaActiva === 'consultas' && <VistaConsultas />}
          {vistaActiva === 'usuarios' && <VistaUsuarios />}
        </div>
      </main>

      {/* modal dinámico (se adapta si es nuevo o editar) */}
      <Modal 
        abierto={modalAbierto} 
        onCerrar={() => setModalAbierto(false)} 
        titulo={proyectoEditando ? "Editar Proyecto" : "Nuevo Proyecto"}
        ancho={600}
      >
        <form key={proyectoEditando ? proyectoEditando.id : 'nuevo'} className="flex w-full flex-col gap-5 mt-4 text-left" onSubmit={(e) => { e.preventDefault(); setModalAbierto(false); }}>
          <Campo etiqueta="Título del Proyecto" defaultValue={proyectoEditando?.titulo || ''} placeholder="Ej: Portfolio Fullstack" />
          
          <div className="grid grid-cols-2 gap-4">
            <Campo etiqueta="Tipo" defaultValue={proyectoEditando?.tipo || ''} placeholder="Frontend, Backend, etc." />
            <Campo etiqueta="Autor" defaultValue={proyectoEditando?.autor || ''} placeholder="Tu nombre o equipo" />
          </div>

          <Campo etiqueta="Tecnologías (separadas por coma)" placeholder="React, Node, Tailwind..." />
          <Campo etiqueta="URL del Repositorio" type="url" placeholder="https://github.com/..." />
          <Campo etiqueta="URL de la Demo (Opcional)" type="url" placeholder="https://..." />
          
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

function VistaDashboard() {
  const [metricas, setMetricas] = useState({ visitas: 0, usuarios: 0, consultas: 0 });
  const [datosEvolucion, setDatosEvolucion] = useState([]);
  const [datosOrigen, setDatosOrigen] = useState([]);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/metrics`)
      .then(res => res.json())
      .then(data => {
        setMetricas(data.totales);
        setDatosEvolucion(data.evolucion);
        setDatosOrigen(data.origen);
        setCargando(false);
      })
      .catch(err => console.error("error al traer metricas - fexx", err));
  }, []);
  if (cargando) return <div className="text-niebla animate-pulse">cargando métricas...</div>;
  return (
    <>
      <h1 className="text-3xl font-display font-bold text-fexx mb-8">Dashboard de Métricas</h1>
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <TarjetaMetrica titulo="Visitas Totales" valor={metricas.visitas} color="text-fexx" />
        <TarjetaMetrica titulo="Usuarios Registrados" valor={metricas.usuarios} color="text-ssanty" />
        <TarjetaMetrica titulo="Consultas Pendientes" valor={metricas.consultas} color="text-rojo" />
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 rounded-3xl border border-pizarra bg-grafito/50 p-6 sm:p-8">
          <h3 className="m-0 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-niebla mb-6">Evolución de Tráfico (Últimos 7 días)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosEvolucion} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3f52" vertical={false} />
                <XAxis dataKey="dia" stroke="#9ba1b3" fontSize={13} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ba1b3" fontSize={13} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#161923', borderColor: '#3a3f52', borderRadius: '8px', color: '#eeebe4' }} itemStyle={{ fontWeight: 'bold' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                <Line type="monotone" name="Visitas" dataKey="visitas" stroke="#7C9CE4" strokeWidth={3} activeDot={{ r: 6 }} dot={false} />
                <Line type="monotone" name="Usuarios" dataKey="usuarios" stroke="#6FCDBE" strokeWidth={3} activeDot={{ r: 6 }} dot={false} />
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
  );
}
function VistaProyectos({ abrirModal }) {
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/projects`)
      .then(res => res.json())
      .then(data => {
        setProyectos(data);
        setCargando(false);
      })
      .catch(err => console.error("error al traer proyectos - fexx", err));
  }, []);
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
                  <td className="py-4 text-right">
                    <Boton variante="secundario" tamaño="md" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => abrirModal(p)}>Editar</Boton>
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
function VistaConsultas() {
  const consultas = [
    { id: 1, remitente: 'Empresa S.A.', email: 'contacto@empresa.com', tipo: 'Cotización', estado: 'Pendiente', fecha: '19/10/2026' },
    { id: 2, remitente: 'Juan Pérez', email: 'juanp@gmail.com', tipo: 'Asesoría', estado: 'Respondida', fecha: '18/10/2026' },
  ];
  return (
    <>
      <h1 className="text-3xl font-display font-bold text-fexx mb-8">Consultas Pendientes</h1>
      <section className="flex flex-col gap-5 rounded-3xl border border-pizarra bg-grafito/50 p-6 sm:p-8">
        <h3 className="m-0 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-niebla">Bandeja de Entrada</h3>
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
              {consultas.map((c) => (
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
                    <Boton variante="secundario" tamaño="md" className="opacity-0 group-hover:opacity-100 transition-opacity">Responder</Boton>
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
function VistaUsuarios() {
  const usuarios = [
    { id: 1, nombre: 'Ana Gomez', email: 'ana.gomez@gmail.com', origen: 'Proyectos', rol: 'Usuario' },
    { id: 2, nombre: 'Marcos Ruiz', email: 'marcos88@hotmail.com', origen: 'Demos', rol: 'Usuario' },
  ];
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
                    <Boton variante="fantasma" color="error" tamaño="md" className="opacity-0 group-hover:opacity-100 transition-opacity">Eliminar</Boton>
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