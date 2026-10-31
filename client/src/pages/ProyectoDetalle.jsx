import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useAuth } from '../context/AuthContext'
import { api } from '../data/api'
import { docDe, docPorSlug } from '../data/documentacion'
import { integrantes } from '../data/integrantes'
import { useAparecer } from '../hooks/useAparecer'
import { useMovimientoReducido } from '../hooks/useMovimientoReducido'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Boton, Esqueleto } from '../components/ui'
import { DemoModal, DocProyecto, temaDe } from '../components/proyectos/Documentacion'

gsap.registerPlugin(useGSAP)

// /proyectos/:clave — la clave es el id de la base o el slug de la documentación (luna-llena, bfc, aura) - Rojo
// Gonzi: con id llamo a GET /api/projects/:id con el token; si no hay token uso la lista pública

const autorDe = (nombre) =>
  integrantes.find((m) => [m.alias, m.nombre, m.nombreCorto, m.id].some((n) => n.toLowerCase() === (nombre ?? '').toLowerCase()))

export default function ProyectoDetalle() {
  const { clave } = useParams()
  const { user } = useAuth()
  const directo = docPorSlug[clave.replace(/^doc-/, '')]
  const id = Number(clave)
  const [estado, setEstado] = useState({ cargando: true })

  useEffect(() => {
    if (directo || !Number.isInteger(id)) return
    let vivo = true
    api(`/projects/${id}`, { token: user?.token })
      .then((p) => (p?.id ? p : Promise.reject()))
      .catch(() => api('/projects').then((l) => l.find((p) => p.id === id) ?? Promise.reject()))
      .then((p) => vivo && setEstado({ proyecto: p, doc: docDe(p) }))
      .catch(() => vivo && setEstado({ error: true }))
    return () => {
      vivo = false
    }
  }, [directo, id, user?.token])

  if (directo) return <Detalle doc={directo} />
  if (!Number.isInteger(id)) return <NoEncontrado />
  if (estado.cargando) return <Cargando />
  if (estado.error) return <NoEncontrado />
  return <Detalle proyecto={estado.proyecto} doc={estado.doc} />
}

function Detalle({ proyecto, doc }) {
  const raiz = useRef(null)
  const reducido = useMovimientoReducido()
  const t = temaDe(doc)
  const [demo, setDemo] = useState(false)
  useAparecer(raiz)

  // los proyectos sin documentación se arman con lo que viene de la base
  const d = doc ?? {
    titulo: proyecto.titulo,
    tipo: proyecto.tipo,
    bajada: proyecto.descripcion,
    tecnologias: (proyecto.tecnologias ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    capturas: proyecto.imagenUrl ? [{ src: proyecto.imagenUrl, titulo: proyecto.titulo }] : [],
    secciones: [],
    ficha: [],
    cifras: [],
  }
  const autor = autorDe(doc?.autor ?? proyecto?.autor)

  useGSAP(
    () => {
      if (reducido) return
      gsap.from('[data-hero] > *', { y: 28, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07 })
      gsap.from('[data-arte]', { y: 40, autoAlpha: 0, duration: 1.1, ease: 'expo.out', delay: 0.25 })
    },
    { scope: raiz, dependencies: [reducido] },
  )

  useEffect(() => {
    document.title = `${d.titulo} — Proyectos`
    return () => {
      document.title = '[Equipo] — Portfolio Fullstack'
    }
  }, [d.titulo])

  return (
    <div ref={raiz} className="relative min-h-screen overflow-x-clip" style={{ background: t.fondo }}>
      <Fondo tema={doc?.tema} t={t} />
      <Navbar />

      <header className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 pb-16 pt-28 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-32">
        <div data-hero className="flex min-w-0 flex-col gap-5">
          <Link to="/#proyectos" className="w-fit text-sm text-niebla no-underline transition-colors hover:text-papel">
            ← Todos los proyectos
          </Link>
          <span className="etiqueta" style={{ color: t.acento }}>
            {[d.tipo, d.contexto].filter(Boolean).join(' · ')}
          </span>
          <h1
            className={`m-0 leading-[0.98] ${doc?.tema === 'luna' ? 'font-[Pixelify_Sans,var(--font-display)] text-[clamp(38px,5.4vw,68px)]' : 'text-[clamp(40px,5.6vw,72px)]'}`}
          >
            {d.titulo}
          </h1>
          {d.bajada && <p className="m-0 max-w-xl text-lg leading-relaxed text-papel/85">{d.bajada}</p>}
          <dl className="m-0 grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            {d.periodo && <Meta k="Período" v={d.periodo} />}
            {d.rol && <Meta k="Rol" v={d.rol} />}
            {d.autores && (
              <Meta
                k="Equipo"
                v={
                  <>
                    {d.autores.map((n) => autorDe(n)).filter(Boolean).map((m, i) => (
                      <span key={m.slug}>
                        {i > 0 && ', '}
                        <Link to={`/equipo/${m.slug}`} className="text-papel no-underline hover:underline">{m.nombre}</Link>
                      </span>
                    ))}
                    {d.otros?.length > 0 && `, ${d.otros.join(' y ')}`}
                  </>
                }
              />
            )}
            {autor && (
              <Meta
                k="Autor"
                v={
                  <Link to={`/equipo/${autor.slug}`} className="text-papel no-underline hover:underline">
                    {autor.nombre}
                  </Link>
                }
              />
            )}
          </dl>
          {d.tecnologias?.length > 0 && (
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Tecnologías">
              {d.tecnologias.map((x) => (
                <li key={x} className="rounded-full border px-3 py-1 font-mono text-xs" style={{ borderColor: t.linea, color: t.suave }}>
                  {x}
                </li>
              ))}
            </ul>
          )}
          {doc && (
            <div className="flex flex-wrap gap-3">
              {d.demo && (
                <button type="button" onClick={() => setDemo(true)}
                  className="cursor-pointer rounded-lg border-0 px-7 py-3.5 font-[Pixelify_Sans,var(--font-display)] text-xl font-bold text-tinta transition-transform hover:scale-105"
                  style={{ background: t.acento, boxShadow: '0 5px 0 #8A6A1E' }}>
                  ▶ Probar
                </button>
              )}
              <Boton href={`/docs/${doc.slug}.pdf`} download={`${doc.titulo} - Documentación.pdf`} variante="secundario">Descargar documentación (PDF)</Boton>
            </div>
          )}
          {!doc && (proyecto.demoUrl || proyecto.repoUrl) && (
            <div className="flex flex-wrap gap-3">
              {proyecto.demoUrl && <Boton href={proyecto.demoUrl} target="_blank" rel="noreferrer">Ver demo ↗</Boton>}
              {proyecto.repoUrl && <Boton href={proyecto.repoUrl} target="_blank" rel="noreferrer" variante="secundario">Repositorio ↗</Boton>}
            </div>
          )}
        </div>

        <div data-arte className="min-w-0">
          <Arte doc={d} t={t} />
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 pb-28 sm:px-8">
        <DocProyecto doc={d} />
      </main>

      <Footer />
      {demo && <DemoModal doc={d} onCerrar={() => setDemo(false)} />}
    </div>
  )
}

function Meta({ k, v }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="font-mono text-[11px] uppercase tracking-wider text-niebla">{k}</dt>
      <dd className="m-0 text-papel">{v}</dd>
    </div>
  )
}

// el dibujo del costado del título cambia con cada proyecto
function Arte({ doc, t }) {
  if (doc.tema === 'luna') {
    return (
      <div className="relative mx-auto max-w-[520px] pt-10">
        <span aria-hidden="true" className="absolute -top-2 right-6 z-10 size-28 rounded-full sm:size-36"
          style={{ background: t.suave, boxShadow: `0 0 60px ${t.suave}55, inset -14px -10px 0 #CFCFB4, inset 18px 22px 0 -8px #F7F7E6` }}>
          <span className="absolute left-[28%] top-[30%] size-[18%] rounded-full bg-[#D6D6BC]" />
          <span className="absolute left-[56%] top-[52%] size-[13%] rounded-full bg-[#D6D6BC]" />
          <span className="absolute left-[34%] top-[62%] size-[9%] rounded-full bg-[#D6D6BC]" />
        </span>
        <div className="relative block w-full overflow-hidden rounded-xl border-4" style={{ borderColor: t.linea, boxShadow: `8px 8px 0 ${t.tinte}` }}>
          <img src={doc.portada} alt="Partida durante una Luna Llena" className="block aspect-video w-full object-cover" style={{ imageRendering: 'pixelated' }} />
        </div>
      </div>
    )
  }
  if (doc.tema === 'ring') {
    return (
      <div className="relative mx-auto max-w-[540px] py-6">
        {[t.suave, '#EEEBE4', t.tinte].map((c, i) => (
          <span key={c} aria-hidden="true" className="absolute inset-x-[-8%] h-1.5 rounded-full" style={{ background: c, top: `${30 + i * 18}%`, rotate: '-4deg', opacity: 0.85 }} />
        ))}
        <div className="relative block w-full rotate-2 overflow-hidden rounded-xl transition-transform duration-500 ease-salida hover:rotate-0" style={{ boxShadow: `0 30px 60px -20px #000, 0 0 0 1px ${t.linea}` }}>
          <img src={doc.portada} alt="Inicio del sitio del torneo" className="block aspect-[16/10] w-full object-cover" />
        </div>
        <span className="absolute -bottom-1 left-4 rounded-md px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-tinta" style={{ background: t.acento }}>
          Capturas del sitio
        </span>
      </div>
    )
  }
  if (doc.tema === 'aura') {
    return (
      <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[400px]">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="absolute rounded-full border motion-safe:animate-[spin_linear_infinite]"
            style={{ inset: `${i * 11}%`, borderColor: `${i % 2 ? t.suave : t.acento}${i ? '55' : '33'}`, borderStyle: i % 2 ? 'dashed' : 'solid', animationDuration: `${24 - i * 4}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }} />
        ))}
        <span className="absolute inset-[34%] rounded-full" style={{ background: `radial-gradient(circle at 35% 30%, #fff 0%, ${t.acento} 35%, ${t.tinte} 70%, transparent 72%)`, boxShadow: `0 0 80px ${t.acento}88` }} />
        {['Voz', 'Pantalla', 'Word', 'Excel', 'Navegador', 'Memoria'].map((x, i) => {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2
          return (
            <span key={x} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 font-mono text-[11px] text-papel"
              style={{ left: `${50 + Math.cos(a) * 44}%`, top: `${50 + Math.sin(a) * 44}%`, background: t.panel, borderColor: t.linea }}>
              {x}
            </span>
          )
        })}
      </div>
    )
  }
  if (doc.capturas?.[0]) {
    return <img src={doc.capturas[0].src} alt={doc.capturas[0].titulo} className="block w-full rounded-2xl object-cover" />
  }
  return null
}

function Fondo({ tema, t }) {
  if (tema === 'luna') {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[900px]"
        style={{ background: `radial-gradient(ellipse 60% 50% at 75% 10%, ${t.tinte}40, transparent 70%), radial-gradient(1.5px 1.5px at 20% 30%, #fff8 50%, transparent 51%) 0 0/140px 140px, radial-gradient(1px 1px at 70% 60%, #fff6 50%, transparent 51%) 0 0/90px 90px` }} />
    )
  }
  if (tema === 'ring') {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[900px]"
        style={{ background: `conic-gradient(from 200deg at 15% -10%, transparent 0 20deg, ${t.suave}22 30deg, transparent 45deg), conic-gradient(from 130deg at 85% -10%, transparent 0 20deg, ${t.tinte}22 30deg, transparent 45deg)` }} />
    )
  }
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[900px]"
      style={{ background: `radial-gradient(ellipse 50% 45% at 70% 20%, ${t.tinte}30, transparent 70%)` }} />
  )
}

function Cargando() {
  return (
    <div className="min-h-screen bg-tinta">
      <Navbar />
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 pt-32 sm:px-8">
        <Esqueleto className="h-5 w-40" />
        <Esqueleto className="h-14 w-2/3" />
        <Esqueleto className="h-5 w-1/2" />
        <Esqueleto className="mt-6 h-72 w-full" />
      </div>
    </div>
  )
}

function NoEncontrado() {
  return (
    <div className="min-h-screen bg-tinta">
      <Navbar />
      <div className="mx-auto flex max-w-xl flex-col items-start gap-5 px-4 pt-40 sm:px-8">
        <span className="etiqueta text-ssanty">Proyectos</span>
        <h1 className="m-0 text-[40px]">No encontramos ese proyecto.</h1>
        <p className="m-0 text-niebla">Puede que lo hayan sacado o que el link esté mal.</p>
        <Boton href="/#proyectos" color="ssanty">Ver todos los proyectos</Boton>
      </div>
    </div>
  )
}
