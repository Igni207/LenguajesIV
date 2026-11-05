import { useState, useEffect } from 'react';
import { Boton, Chip, Modal, Campo } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function Admin() {
  const { user } = useAuth();
  const [vistaActiva, setVistaActiva] = useState('dashboard');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [proyectoEditando, setProyectoEditando] = useState(null); 
  const [triggerRecargaProyectos, setTriggerRecargaProyectos] = useState(0);

  const handleAbrirModal = (proyecto = null) => {
    setProyectoEditando(proyecto);
    setModalAbierto(true);
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
      ? `${import.meta.env.VITE_API_URL}/api/projects/${proyectoEditando.id}`
      : `${import.meta.env.VITE_API_URL}/api/projects`;
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
        alert("Error al guardar: " + (data.error || "Verificá los datos ingresados"));
        console.error("Error del servidor:", data);
      }
    } catch (err) {
      alert("Error de red al intentar conectar con el servidor.");
      console.error("Error de red al guardar proyecto", err);
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

  useEffect(() => {
    if (!user?.token) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/metrics`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMetricas(data.totales || { visitas: 0, usuarios: 0, consultas: 0 });
        setDatosEvolucion(data.evolucion || []);
        setDatosOrigen(data.origen || []);
        setCargando(false);
      })
      .catch(err => console.error("error al traer metricas - fexx", err));
  }, [user]);

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
  );
}

function VistaProyectos({ abrirModal, user }) {
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarProyectos = () => {
    if (!user?.token) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProyectos(data);
        setCargando(false);
      })
      .catch(err => console.error("error al traer proyectos - fexx", err));
  };

  useEffect(() => {
    cargarProyectos();
  }, [user]);

  const handleEliminarProyecto = async (id) => {
    if (!window.confirm("¿Seguro querés eliminar este proyecto?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (res.ok) cargarProyectos();
    } catch (err) {
      console.error("Error al eliminar proyecto", err);
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
  const [consultas, setConsultas] = useState([]);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);
  const [respuesta, setRespuesta] = useState('');

  const cargarConsultas = () => {
    if (!user?.token) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/consultas`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setConsultas(data))
      .catch(err => console.error("Error al traer consultas", err));
  };

  useEffect(() => {
    cargarConsultas();
  }, [user]);

  const handleEnviarRespuesta = async (e) => {
    e.preventDefault();
    if (!respuesta.trim() || !consultaSeleccionada) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/consultas/${consultaSeleccionada.id}/responder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ respuesta })
      });

      if (res.ok) {
        setConsultaSeleccionada(null);
        setRespuesta('');
        cargarConsultas();
      }
    } catch (err) {
      console.error("Error al responder consulta", err);
    }
  };

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
                    <Boton 
                      variante="secundario" 
                      tamaño="md" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setConsultaSeleccionada(c)}
                    >
                      Responder
                    </Boton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        abierto={Boolean(consultaSeleccionada)}
        onCerrar={() => setConsultaSeleccionada(null)}
        titulo="Responder Consulta"
        ancho={600}
      >
        {consultaSeleccionada && (
          <form className="flex w-full flex-col gap-5 mt-4 text-left" onSubmit={handleEnviarRespuesta}>
            <div className="rounded-xl border border-pizarra bg-tinta/80 p-4 flex flex-col gap-2">
              <span className="text-xs font-mono uppercase text-niebla">Consulta original de {consultaSeleccionada.remitente}:</span>
              <p className="text-sm text-papel italic m-0">"{consultaSeleccionada.mensaje}"</p>
            </div>

            <Campo 
              etiqueta="Tu Respuesta" 
              multilinea 
              value={respuesta} 
              onChange={(e) => setRespuesta(e.target.value)} 
              placeholder="Escribí tu respuesta..." 
            />

            <div className="mt-6 flex gap-3 w-full">
              <Boton type="button" variante="secundario" anchoCompleto onClick={() => setConsultaSeleccionada(null)}>Cancelar</Boton>
              <Boton type="submit" color="fexx" anchoCompleto>Enviar Respuesta</Boton>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}

function VistaUsuarios({ user }) {
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = () => {
    if (!user?.token) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error("Error al traer usuarios", err));
  };
  useEffect(() => {
    cargarUsuarios();
  }, [user]);
  const handleEliminarUsuario = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (res.ok) cargarUsuarios();
    } catch (err) {
      console.error("Error al eliminar usuario", err);
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