import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useMovimientoReducido } from '../../hooks/useMovimientoReducido'
import { useAparecer } from '../../hooks/useAparecer'
import { Navbar } from '../layout/Navbar'
import { Footer } from '../layout/Footer'
import { Silueta } from '../animaciones/Silueta'
import { Boton, IconoCandado } from '../ui'
import { IconoContacto } from './Contacto'
import { ModalMiembros, periodo, usePerfil } from './comun'

// Santy: tu página es un componente de React: se escribe el JSX, se renderiza al lado y cada sección es un componente con sus props - Rojo
const L = {
  claro: '#C29FE6',
  medio: '#9F7BCF',
  profundo: '#45305E',
  panel: '#1C1826',
  linea: '#332B44',
  fondo: '#14121B',
}

const secciones = [
  { id: 's-contacto', nombre: 'Contacto' },
  { id: 's-sobre', nombre: 'SobreMi' },
  { id: 's-exp', nombre: 'Experiencia' },
  { id: 's-hab', nombre: 'Habilidades' },
  { id: 's-edu', nombre: 'Educacion' },
  { id: 's-proy', nombre: 'Proyectos' },
]

export function PerfilComponentes({ integrante }) {
  const raiz = useRef(null)
  const perfil = usePerfil(integrante)
  const { cv, contacto } = perfil
  const [activa, setActiva] = useState(secciones[0].id)
  useAparecer(raiz)

  // el árbol de componentes marca la sección que estás viendo
  useEffect(() => {
    const obs = new IntersectionObserver((ents) => ents.forEach((e) => e.isIntersecting && setActiva(e.target.id)), { rootMargin: '-40% 0px -55% 0px' })
    secciones.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={raiz} className="relative min-h-screen overflow-x-clip" style={{ background: `radial-gradient(900px 500px at 15% 0%, ${L.profundo}88, transparent 60%), ${L.fondo}` }}>
      <Navbar />

      <header className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-8 lg:px-12">
        <Navegador />
        <div className="grid grid-cols-1 overflow-hidden rounded-b-2xl border border-t-0 lg:grid-cols-2" style={{ borderColor: L.linea }}>
          <Editor integrante={integrante} />
          <Vista integrante={integrante} contacto={contacto} perfil={perfil} />
        </div>
      </header>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-28 sm:px-8 lg:grid-cols-[220px_1fr] lg:px-12">
        <aside className="hidden lg:block">
          <nav aria-label="Secciones" className="sticky top-24 flex flex-col gap-1 rounded-2xl border p-4 font-mono text-[13px]" style={{ borderColor: L.linea, background: L.panel }}>
            <span className="mb-2 text-xs uppercase tracking-wider text-niebla">Componentes</span>
            <span style={{ color: L.claro }}>{'<Perfil>'}</span>
            {secciones.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={activa === s.id ? 'true' : undefined}
                className="flex items-center gap-2 rounded-md py-1 pl-4 no-underline transition-colors"
                style={{ color: activa === s.id ? '#161923' : '#9BA1B3', background: activa === s.id ? L.claro : 'transparent' }}
              >
                <span aria-hidden="true">├</span>
                {`<${s.nombre} />`}
              </a>
            ))}
            <span style={{ color: L.claro }}>{'</Perfil>'}</span>
          </nav>
        </aside>

        <main className="flex min-w-0 flex-col gap-10">
          <Componente id="s-contacto" nombre="Contacto" props={`email="${contacto.email.texto}"`}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { tipo: 'email', texto: contacto.email.texto, href: contacto.email.href },
                { tipo: 'telefono', texto: contacto.telefono.texto, href: contacto.telefono.href },
                { tipo: 'whatsapp', texto: 'Escribir por WhatsApp ↗', href: contacto.whatsapp.href, externo: true },
                { tipo: 'ciudad', texto: integrante.ciudad },
              ].map((c) => (
                <div key={c.tipo} className="flex items-center gap-3 rounded-xl border px-4 py-3" style={{ borderColor: L.linea }}>
                  <span style={{ color: L.claro }}><IconoContacto tipo={c.tipo} /></span>
                  {c.href ? (
                    <a href={c.href} {...(c.externo ? { target: '_blank', rel: 'noreferrer' } : {})} className="min-w-0 truncate text-papel no-underline hover:underline">{c.texto}</a>
                  ) : (
                    <span>{c.texto}</span>
                  )}
                </div>
              ))}
            </div>
          </Componente>

          <Componente id="s-sobre" nombre="SobreMi">
            <p className="m-0 text-lg leading-relaxed text-papel/85">{cv.sobreMi}</p>
          </Componente>

          <Componente id="s-exp" nombre="Experiencia" props={`items={${cv.experiencia.length}}`}>
            <ol className="m-0 flex list-none flex-col gap-3 p-0">
              {perfil.experiencia.map((e) => (
                <li key={e.puesto + e.desde} className="grid grid-cols-1 gap-2 rounded-xl border p-4 sm:grid-cols-[160px_1fr]" style={{ borderColor: L.linea }}>
                  <span className="font-mono text-sm" style={{ color: L.claro }}>{periodo(e)}</span>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{e.puesto}</span>
                    <span className="text-sm text-niebla">{e.lugar}</span>
                    <p className="m-0 mt-1 text-sm leading-relaxed text-papel/80">{e.descripcion}</p>
                  </div>
                </li>
              ))}
              {perfil.expOcultas > 0 && <Bloqueado texto={`${perfil.expOcultas} ${perfil.expOcultas === 1 ? 'item más' : 'items más'}`} onClick={perfil.pedirSesion} />}
            </ol>
          </Componente>

          <Componente id="s-hab" nombre="Habilidades" props={`skills={[${cv.habilidades.length}]}`}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cv.habilidades.map((h) => (
                <div key={h.nombre} className="flex items-center justify-between gap-4 rounded-xl border px-4 py-3" style={{ borderColor: L.linea }}>
                  <span className="font-semibold">{h.nombre}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-niebla">{h.nivel}</span>
                    <span className="relative block h-6 w-11 rounded-full" style={{ background: L.claro }} aria-hidden="true">
                      <span className="absolute right-0.5 top-0.5 size-5 rounded-full bg-tinta" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Componente>

          <Componente id="s-edu" nombre="Educacion">
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {cv.educacion.map((e) => (
                <li key={e.titulo} className="grid grid-cols-1 gap-1 rounded-xl border p-4 sm:grid-cols-[160px_1fr_auto] sm:items-center sm:gap-4" style={{ borderColor: L.linea }}>
                  <span className="font-mono text-sm" style={{ color: L.claro }}>{periodo(e)}</span>
                  <span className="font-semibold">{e.titulo}</span>
                  <span className="text-sm text-niebla">{e.lugar}</span>
                </li>
              ))}
            </ul>
          </Componente>

          <Componente id="s-proy" nombre="Proyectos" props={`autor="${integrante.nombreCorto}"`}>
            {perfil.cargando ? (
              <p className="m-0 font-mono text-sm text-niebla">{'cargando…'}</p>
            ) : perfil.proyectos.length === 0 ? (
              <p className="m-0 text-niebla">Todavía no hay proyectos cargados.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {perfil.proyVisibles.map((p) => (
                  <article key={p.id} className="flex flex-col gap-3 rounded-xl border p-5 transition-colors hover:border-[#9F7BCF]" style={{ borderColor: L.linea }}>
                    <span className="font-mono text-xs" style={{ color: L.claro }}>{`<Proyecto id={${p.id}} />`}</span>
                    <span className="text-lg font-semibold">{p.titulo}</span>
                    {p.descripcion && <span className="text-sm text-niebla">{p.descripcion}</span>}
                    <div className="mt-auto pt-2">
                      <Boton variante="secundario" onClick={perfil.verDetalle}>Ver detalle</Boton>
                    </div>
                  </article>
                ))}
                {perfil.proyOcultos > 0 && <Bloqueado texto={`${perfil.proyOcultos} ${perfil.proyOcultos === 1 ? 'proyecto más' : 'proyectos más'}`} onClick={perfil.pedirSesion} />}
              </div>
            )}
          </Componente>
        </main>
      </div>

      <Footer />
      <ModalMiembros perfil={perfil} integrante={integrante} />
    </div>
  )
}

function Navegador() {
  const { pathname } = useLocation()
  return (
    <div className="flex items-center gap-3 rounded-t-2xl border px-4 py-3" style={{ background: L.panel, borderColor: L.linea }}>
      <div className="flex gap-1.5" aria-hidden="true">
        <span className="size-3 rounded-full bg-rojo/80" />
        <span className="size-3 rounded-full bg-arena/80" />
        <span className="size-3 rounded-full" style={{ background: L.claro }} />
      </div>
      <span className="min-w-0 flex-1 truncate rounded-full px-4 py-1.5 font-mono text-xs text-niebla" style={{ background: L.fondo }}>
        localhost:5173{pathname}
      </span>
    </div>
  )
}

// el JSX se escribe solo, letra por letra
function Editor({ integrante }) {
  const reducido = useMovimientoReducido()
  const lineas = [
    '<Desarrollador',
    `  nombre="${integrante.nombre}"`,
    `  rol="${integrante.rol}"`,
    `  ciudad="${integrante.ciudad}"`,
    `  stack={['React', 'React Router', 'Vite']}`,
    '/>',
  ]
  const total = lineas.join('\n').length
  const [n, setN] = useState(reducido ? total : 0)

  useEffect(() => {
    if (reducido) return
    let i = 0
    const t = setInterval(() => {
      i += 2
      setN(Math.min(i, total))
      if (i >= total) clearInterval(t)
    }, 22)
    return () => clearInterval(t)
  }, [reducido, total])

  const texto = lineas.join('\n').slice(0, n)
  return (
    <div className="flex flex-col border-b lg:border-b-0 lg:border-r" style={{ background: '#110F17', borderColor: L.linea }}>
      <div className="flex border-b font-mono text-xs" style={{ borderColor: L.linea }}>
        <span className="border-r px-4 py-2.5" style={{ borderColor: L.linea, color: L.claro, background: L.panel }}>Perfil.jsx</span>
      </div>
      <pre className="m-0 min-h-[220px] overflow-x-auto whitespace-pre px-5 py-5 font-mono text-[13px] leading-[1.9] sm:text-sm">
        {resaltar(texto)}
        {n < total && <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse" style={{ background: L.claro }} />}
      </pre>
    </div>
  )
}

// colores simples para que parezca un editor
function resaltar(texto) {
  return texto.split(/(<\/?[A-Za-z]+|\/>|"[^"]*"?|'[^']*'?|[a-z]+(?==))/g).map((t, i) => {
    if (!t) return null
    let color
    if (/^<\/?[A-Za-z]|^\/>$/.test(t)) color = L.claro
    else if (/^["']/.test(t)) color = '#B6D76E'
    else if (/^[a-z]+$/.test(t)) color = '#7C9CE4'
    return color ? <span key={i} style={{ color }}>{t}</span> : <span key={i}>{t}</span>
  })
}

function Vista({ integrante, contacto, perfil }) {
  return (
    <div className="relative flex flex-col justify-end gap-5 overflow-hidden p-6 sm:p-8" style={{ background: L.profundo }}>
      <span className="absolute right-4 top-4 rounded-full px-3 py-1 font-mono text-xs" style={{ background: '#00000033', color: L.claro }}>vista previa</span>
      <div className="pointer-events-none absolute -bottom-2 right-4 hidden h-[260px] w-[170px] sm:block">
        <Silueta integrante={integrante} />
      </div>
      <div data-aparecer className="relative flex max-w-[420px] flex-col gap-4 pt-10">
        <span className="etiqueta" style={{ color: L.claro }}>02 — {integrante.rol}</span>
        <h1 className="m-0 text-[clamp(36px,4.5vw,60px)] leading-[0.95]">{integrante.nombre}</h1>
        <p className="m-0 leading-relaxed text-papel/85">{integrante.bio}</p>
        <div className="flex flex-wrap gap-3">
          <Boton href={contacto.email.href} color="ssanty"><IconoContacto tipo="email" />Escribirme</Boton>
          <Boton href={contacto.whatsapp.href} target="_blank" rel="noreferrer" variante="secundario" className="border-papel/40!">WhatsApp</Boton>
          <Boton variante="fantasma" onClick={perfil.descargarCv}>
            {!perfil.isAuthenticated && <IconoCandado tamaño={16} className="text-papel" />}
            Descargar CV
          </Boton>
        </div>
      </div>
    </div>
  )
}

function Componente({ id, nombre, props, children }) {
  return (
    <section id={id} data-aparecer aria-labelledby={`${id}-t`} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 id={`${id}-t`} className="m-0 text-[clamp(26px,3vw,36px)]">{nombre === 'SobreMi' ? 'Sobre mí' : nombre === 'Educacion' ? 'Educación' : nombre}</h2>
        <span className="font-mono text-xs" style={{ color: L.claro }}>{`<${nombre}${props ? ' ' + props : ''} />`}</span>
      </div>
      <div className="rounded-2xl border p-4 sm:p-5" style={{ background: L.panel, borderColor: L.linea }}>{children}</div>
    </section>
  )
}

function Bloqueado({ texto, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed bg-transparent font-mono text-sm text-niebla transition-colors hover:text-papel" style={{ borderColor: L.linea }}>
      <IconoCandado tamaño={16} className="text-ssanty" />
      {texto} — iniciá sesión para ver todo
    </button>
  )
}
