import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAparecer } from '../../hooks/useAparecer'
import { Boton, Chip, Esqueleto, IconoCandado, Modal, useToast } from '../ui'
import { integrantes } from '../../data/integrantes'
import { Encabezado } from './Encabezado'

// el color de la tarjeta sale del autor (sirve con el alias o con el nombre) - Rojo
const coloresAutor = Object.fromEntries(
  integrantes.flatMap((m) => [m.alias, m.nombre, m.nombreCorto, m.id].map((n) => [n.toLowerCase(), m.claro])),
)

// Gonzi: leo GET /api/projects (titulo, descripcion, tipo, destacado, autor).
// Santy: sin sesión se ven solo los destacados, el resto pide login - Rojo
export function Proyectos({ proyectos, cargando, error, reintentar }) {
  const raiz = useRef(null)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { mostrar } = useToast()
  const [filtro, setFiltro] = useState('Todos')
  const [modal, setModal] = useState(false)
  useAparecer(raiz)

  const lista = proyectos ?? []
  const destacados = lista.filter((p) => p.destacado).slice(0, 3)
  const ocultos = lista.length - destacados.length
  const tipos = ['Todos', ...new Set(lista.map((p) => p.tipo).filter(Boolean))]
  const visibles = isAuthenticated ? lista.filter((p) => filtro === 'Todos' || p.tipo === filtro) : destacados

  const verDetalle = () => {
    if (!isAuthenticated) return setModal(true)
    mostrar({ tipo: 'info', titulo: 'Próximamente', mensaje: 'El detalle de cada proyecto está en camino.' })
  }

  const irALogin = () => {
    setModal(false)
    navigate('/login', { state: { from: location } })
  }

  return (
    <section ref={raiz} id="proyectos" aria-labelledby="t-proyectos" className="flex flex-col gap-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Encabezado
          id="t-proyectos"
          etiqueta="Proyectos"
          color="text-ssanty"
          titulo={isAuthenticated ? 'Todos los proyectos.' : 'Proyectos destacados.'}
          bajada={
            isAuthenticated
              ? 'Todo en lo que trabajamos, con detalle y demos.'
              : 'Una selección de lo que hicimos. El detalle y las demos piden sesión iniciada.'
          }
        />
        {isAuthenticated && tipos.length > 2 && (
          <div role="group" aria-label="Filtrar proyectos" className="flex flex-wrap gap-2">
            {tipos.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFiltro(t)}
                aria-pressed={filtro === t}
                className={`min-h-10 cursor-pointer rounded-full border-[1.5px] px-4 text-sm font-semibold transition-colors duration-200 ${
                  filtro === t ? 'border-ssanty bg-ssanty text-tinta' : 'border-pizarra bg-transparent text-papel hover:border-niebla'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {cargando ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-3 rounded-3xl bg-grafito p-5">
              <Esqueleto className="h-36" />
              <Esqueleto className="h-5 w-2/3" />
              <Esqueleto className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-start gap-4 rounded-3xl bg-grafito p-8">
          <p className="m-0 text-niebla">No pudimos cargar los proyectos.</p>
          <Boton variante="secundario" onClick={reintentar}>Reintentar</Boton>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((p) => (
            <TarjetaProyecto key={p.id} proyecto={p} onDetalle={verDetalle} />
          ))}

          {!isAuthenticated && ocultos > 0 && (
            <div className="relative min-h-[320px] overflow-hidden rounded-3xl">
              <div aria-hidden="true" className="absolute inset-0 grid grid-rows-2 gap-4 opacity-50 blur-md">
                <div className="rounded-3xl bg-grafito" />
                <div className="rounded-3xl bg-grafito" />
              </div>
              <div className="relative flex h-full flex-col items-center justify-center gap-4 bg-tinta/40 p-8 text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-ssanty/15">
                  <IconoCandado tamaño={28} />
                </span>
                <span className="font-display text-[26px] font-bold">+{ocultos} {ocultos === 1 ? "proyecto" : "proyectos"} más</span>
                <span className="max-w-64 text-[15px] text-niebla">Iniciá sesión para verlos todos, con detalle y demos.</span>
                <Boton color="ssanty" onClick={() => setModal(true)}>Ver todos</Boton>
              </div>
            </div>
          )}

          {visibles.length === 0 && (
            <p className="m-0 text-niebla">Todavía no hay proyectos cargados.</p>
          )}
        </div>
      )}

      <Modal
        abierto={modal}
        onCerrar={() => setModal(false)}
        titulo="Esto es para miembros"
        icono={
          <span className="flex size-[72px] items-center justify-center rounded-full bg-ssanty/15">
            <IconoCandado />
          </span>
        }
      >
        <p className="m-0 leading-normal text-niebla">
          Con una cuenta gratis ves todos los proyectos, las demos y el detalle de cada uno.
        </p>
        <div className="mt-2 flex w-full flex-col gap-2.5">
          <Boton color="ssanty" tamaño="lg" onClick={irALogin}>Crear cuenta</Boton>
          <Boton variante="secundario" tamaño="lg" onClick={irALogin}>Ya tengo cuenta</Boton>
        </div>
      </Modal>
    </section>
  )
}

function TarjetaProyecto({ proyecto, onDetalle }) {
  const color = coloresAutor[(proyecto.autor ?? '').toLowerCase()] ?? '#7C9CE4'
  return (
    <div data-aparecer className="flex">
      <article className="group flex w-full flex-col overflow-hidden rounded-3xl bg-grafito transition-transform duration-300 ease-salida hover:-translate-y-1.5">
        <div aria-hidden="true" className="relative h-36 overflow-hidden" style={{ background: `${color}33` }}>
          <div className="absolute left-5 right-[40%] top-6 flex flex-col gap-2.5">
            <span className="h-1.5 w-4/5 rounded-full bg-papel/20" />
            <span className="h-1.5 w-1/2 rounded-full" style={{ background: color }} />
            <span className="h-1.5 w-3/4 rounded-full bg-papel/20" />
          </div>
          <div
            className="absolute -bottom-6 right-5 h-28 w-28 rotate-6 rounded-2xl transition-transform duration-500 ease-salida group-hover:rotate-0"
            style={{ background: color }}
          />
          {proyecto.destacado && (
            <span className="absolute bottom-3 left-4 rounded-full bg-tinta px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider" style={{ color }}>
              Destacado
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="m-0 text-[22px]">{proyecto.titulo}</h3>
          {proyecto.descripcion && <p className="m-0 leading-relaxed text-niebla">{proyecto.descripcion}</p>}
          <div className="flex flex-wrap gap-2">
            {proyecto.tipo && <Chip>{proyecto.tipo}</Chip>}
            {proyecto.autor && <Chip>{proyecto.autor}</Chip>}
          </div>
          <div className="mt-auto pt-2">
            <Boton variante="secundario" onClick={onDetalle}>Ver detalle</Boton>
          </div>
        </div>
      </article>
    </div>
  )
}
