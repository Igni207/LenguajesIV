import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useMovimientoReducido } from '../../hooks/useMovimientoReducido'
import { useAparecer } from '../../hooks/useAparecer'
import { Navbar } from '../layout/Navbar'
import { Footer } from '../layout/Footer'
import { Silueta } from '../animaciones/Silueta'
import { Boton, Chip, IconoCandado } from '../ui'
import { IconoContacto } from './Contacto'
import { ModalMiembros, anio, periodo, usePerfil } from './comun'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Fexx: tu página es un dashboard: el CV en widgets, la experiencia como Gantt y las habilidades como gráfico - Rojo
const A = {
  claro: '#7C9CE4',
  medio: '#5B7BC4',
  profundo: '#2C3E66',
  panel: '#182033',
  linea: '#27324D',
  fondo: '#111624',
}

export function PerfilAnalytics({ integrante }) {
  const raiz = useRef(null)
  const reducido = useMovimientoReducido()
  const perfil = usePerfil(integrante)
  const { cv, contacto } = perfil
  useAparecer(raiz)

  useGSAP(
    () => {
      if (reducido) return
      const q = gsap.utils.selector(raiz)
      q('[data-trazo]').forEach((el) => {
        const largo = el.getTotalLength()
        gsap.fromTo(el, { strokeDasharray: largo, strokeDashoffset: largo }, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', delay: 0.3 })
      })
      q('[data-barra]').forEach((el) =>
        gsap.from(el, { scaleX: 0, transformOrigin: 'left', duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }),
      )
      q('[data-contar]').forEach((el) => {
        const fin = Number(el.dataset.contar)
        if (!fin) return
        const o = { n: 0 }
        gsap.to(o, { n: fin, duration: 1.4, ease: 'power2.out', onUpdate: () => (el.textContent = Math.round(o.n)), scrollTrigger: { trigger: el, start: 'top 95%', once: true } })
      })
    },
    { scope: raiz, dependencies: [reducido, perfil.proyectos.length, perfil.isAuthenticated], revertOnUpdate: true },
  )

  // ejes del Gantt: desde el primer año hasta el año que viene
  const inicio = Math.min(...cv.experiencia.map((e) => anio(e.desde)))
  const fin = Math.floor(anio('Actualidad')) + 1
  const pos = (a) => ((a - inicio) / (fin - inicio)) * 100
  const anios = Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i)

  return (
    <div ref={raiz} className="relative min-h-screen overflow-x-clip" style={{ background: A.fondo }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 h-[800px] opacity-[0.35]" style={{ backgroundImage: `linear-gradient(${A.linea} 1px, transparent 1px), linear-gradient(90deg, ${A.linea} 1px, transparent 1px)`, backgroundSize: '48px 48px', maskImage: 'linear-gradient(#000, transparent)' }} />
      <Navbar />

      <header className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-32 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-12">
        <div data-aparecer className="flex flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs" style={{ borderColor: A.linea, color: A.claro }}>
            <span className="size-2 animate-pulse rounded-full bg-exito" />
            Producción · Ready
          </span>
          <span className="etiqueta" style={{ color: A.claro }}>01 — {integrante.rol}</span>
          <h1 className="m-0 text-[clamp(40px,6vw,76px)] leading-[0.95]">{integrante.nombre}</h1>
          <p className="m-0 max-w-xl text-lg leading-relaxed text-papel/85">{integrante.bio}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Boton href={contacto.email.href} color="fexx"><IconoContacto tipo="email" />Escribirme</Boton>
            <Boton href={contacto.whatsapp.href} target="_blank" rel="noreferrer" variante="secundario" className="border-papel/40!"><IconoContacto tipo="whatsapp" />WhatsApp</Boton>
            <Boton variante="fantasma" onClick={perfil.descargarCv}>
              {!perfil.isAuthenticated && <IconoCandado tamaño={16} className="text-papel" />}
              Descargar CV
            </Boton>
          </div>
        </div>

        <div data-aparecer className="grid grid-cols-3 gap-3">
          <Widget titulo="Resumen" className="col-span-3">
            <div className="relative grid grid-cols-[1fr_auto] items-end gap-4">
              <svg viewBox="0 0 400 140" className="h-36 w-full" aria-hidden="true">
                {[35, 70, 105].map((y) => (
                  <line key={y} x1="0" x2="400" y1={y} y2={y} stroke={A.linea} strokeDasharray="3 5" />
                ))}
                <path d="M0 120 C 40 112, 60 96, 90 100 S 150 70, 180 76 S 240 40, 270 52 S 330 20, 400 14" fill="none" stroke={A.claro} strokeWidth="3" strokeLinecap="round" data-trazo />
                <path d="M0 130 C 50 126, 80 118, 120 120 S 200 100, 240 104 S 320 84, 400 80" fill="none" stroke={A.medio} strokeWidth="2" strokeLinecap="round" opacity="0.6" data-trazo />
              </svg>
              <div className="relative hidden h-36 w-28 sm:block">
                <div className="absolute inset-x-0 bottom-0 mx-auto h-40 w-28">
                  <Silueta integrante={integrante} />
                </div>
              </div>
            </div>
          </Widget>
          <Kpi valor={anio(cv.educacion[0].desde)} texto="empezó la carrera" fijo />
          <Kpi valor={perfil.proyectos.length} texto="proyectos" />
          <Kpi valor={cv.habilidades.length} texto="tecnologías" />
        </div>
      </header>

      <main className="relative mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 pb-28 sm:px-8 lg:grid-cols-12 lg:px-12">
        <section aria-labelledby="a-contacto" className="lg:col-span-12">
          <h2 id="a-contacto" className="sr-only">Contacto</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { tipo: 'email', titulo: 'Email', texto: contacto.email.texto, href: contacto.email.href },
              { tipo: 'telefono', titulo: 'Teléfono', texto: contacto.telefono.texto, href: contacto.telefono.href },
              { tipo: 'whatsapp', titulo: 'WhatsApp', texto: 'Abrir chat ↗', href: contacto.whatsapp.href, externo: true },
              { tipo: 'ciudad', titulo: 'Ciudad', texto: integrante.ciudad },
            ].map((c) => (
              <div key={c.tipo} data-aparecer className="flex items-center gap-4 rounded-2xl border p-5" style={{ background: A.panel, borderColor: A.linea }}>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl" style={{ background: `${A.claro}22`, color: A.claro }}>
                  <IconoContacto tipo={c.tipo} />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="font-mono text-xs uppercase tracking-wider text-niebla">{c.titulo}</span>
                  {c.href ? (
                    <a href={c.href} {...(c.externo ? { target: '_blank', rel: 'noreferrer' } : {})} className="truncate text-papel no-underline hover:underline">{c.texto}</a>
                  ) : (
                    <span className="truncate">{c.texto}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Widget id="a-sobre" titulo="Sobre mí" className="lg:col-span-8">
          <p className="m-0 text-lg leading-relaxed text-papel/85">{cv.sobreMi}</p>
        </Widget>
        <Widget titulo="Idiomas" className="lg:col-span-4">
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {cv.idiomas.map((i) => (
              <li key={i.nombre} className="flex items-center justify-between">
                <span className="font-semibold">{i.nombre}</span>
                <Chip>{i.nivel}</Chip>
              </li>
            ))}
          </ul>
        </Widget>

        <Widget id="a-exp" titulo="Experiencia" accion={`${cv.experiencia.length} registros`} className="lg:col-span-12">
          <div className="flex flex-col gap-6">
            <div className="relative">
              <div className="ml-0 grid font-mono text-xs text-niebla sm:ml-[200px]" style={{ gridTemplateColumns: `repeat(${anios.length - 1}, minmax(0,1fr))` }}>
                {anios.slice(0, -1).map((a) => (
                  <span key={a} className="border-l pl-2" style={{ borderColor: A.linea }}>{a}</span>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-3">
                {perfil.experiencia.map((e) => {
                  const desde = pos(anio(e.desde))
                  const hasta = pos(Math.min(fin, Math.max(anio(e.hasta), anio(e.desde) + 0.15)))
                  return (
                    <div key={e.puesto} className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[200px_1fr]">
                      <span className="truncate text-sm font-semibold">{e.lugar.split(' · ')[0]}</span>
                      <div className="relative h-8 rounded-lg" style={{ background: `${A.linea}66` }}>
                        <div data-barra className="absolute inset-y-1 rounded-md" style={{ left: `${desde}%`, width: `${hasta - desde}%`, background: A.claro }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {perfil.experiencia.map((e) => (
                <article key={e.puesto + e.desde} className="flex flex-col gap-1.5 rounded-xl border p-4" style={{ borderColor: A.linea }}>
                  <span className="font-mono text-xs" style={{ color: A.claro }}>{periodo(e)}</span>
                  <span className="font-semibold">{e.puesto}</span>
                  <span className="text-sm text-niebla">{e.lugar}</span>
                  <p className="m-0 mt-1 text-sm leading-relaxed text-papel/80">{e.descripcion}</p>
                </article>
              ))}
              {perfil.expOcultas > 0 && <Bloqueado texto={`${perfil.expOcultas} ${perfil.expOcultas === 1 ? 'registro más' : 'registros más'}`} onClick={perfil.pedirSesion} />}
            </div>
          </div>
        </Widget>

        <Widget id="a-hab" titulo="Habilidades" accion="nivel %" className="lg:col-span-7">
          <div className="relative flex flex-col gap-4">
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[140px] right-0 grid grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="border-r border-dashed" style={{ borderColor: A.linea }} />
              ))}
            </div>
            {cv.habilidades.map((h) => (
              <div key={h.nombre} className="relative grid grid-cols-[130px_1fr] items-center gap-2.5">
                <span className="truncate text-sm font-semibold">{h.nombre}</span>
                <div className="flex items-center gap-2">
                  <span data-barra className="block h-5 rounded-r-md" style={{ width: `${h.nivel}%`, background: `linear-gradient(90deg, ${A.medio}, ${A.claro})` }} />
                  <span className="font-mono text-xs text-niebla">{h.nivel}</span>
                </div>
              </div>
            ))}
          </div>
        </Widget>

        <Widget titulo="Educación" className="lg:col-span-5">
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {cv.educacion.map((e) => (
              <li key={e.titulo} className="flex gap-4">
                <span className="mt-1.5 size-2.5 shrink-0 rounded-full" style={{ background: A.claro }} />
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-xs text-niebla">{periodo(e)}</span>
                  <span className="font-semibold">{e.titulo}</span>
                  <span className="text-sm text-niebla">{e.lugar}</span>
                </div>
              </li>
            ))}
          </ul>
        </Widget>

        <Widget id="a-proy" titulo="Proyectos" accion={`${perfil.proyectos.length} en total`} className="lg:col-span-12">
          {perfil.cargando ? (
            <p className="m-0 text-sm text-niebla">Cargando datos…</p>
          ) : perfil.proyectos.length === 0 ? (
            <p className="m-0 text-sm text-niebla">Todavía no hay proyectos cargados.</p>
          ) : (
            <div className="flex flex-col">
              {perfil.proyVisibles.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center gap-4 border-b py-4 last:border-b-0" style={{ borderColor: A.linea }}>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="font-semibold">{p.titulo}</span>
                    {p.descripcion && <span className="text-sm text-niebla">{p.descripcion}</span>}
                  </div>
                  {p.tipo && <Chip>{p.tipo}</Chip>}
                  {p.destacado && <Chip tono="info">Destacado</Chip>}
                  <Boton variante="secundario" onClick={perfil.verDetalle}>Ver detalle</Boton>
                </div>
              ))}
              {perfil.proyOcultos > 0 && <Bloqueado texto={`${perfil.proyOcultos} ${perfil.proyOcultos === 1 ? 'proyecto más' : 'proyectos más'}`} onClick={perfil.pedirSesion} />}
            </div>
          )}
        </Widget>
      </main>

      <Footer />
      <ModalMiembros perfil={perfil} integrante={integrante} />
    </div>
  )
}

function Widget({ titulo, accion, className = '', id, children }) {
  return (
    <section data-aparecer aria-labelledby={id} className={`flex flex-col gap-5 rounded-2xl border p-5 sm:p-6 ${className}`} style={{ background: A.panel, borderColor: A.linea }}>
      <div className="flex items-center justify-between gap-4">
        <h2 id={id} className="m-0 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-niebla">{titulo}</h2>
        {accion ? <span className="font-mono text-xs" style={{ color: A.claro }}>{accion}</span> : <span aria-hidden="true" className="text-niebla">⋯</span>}
      </div>
      {children}
    </section>
  )
}

function Kpi({ valor, texto, fijo = false }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border p-4" style={{ background: A.panel, borderColor: A.linea }}>
      <span {...(fijo ? {} : { 'data-contar': valor })} className="font-display text-[clamp(26px,3vw,36px)] font-bold" style={{ color: A.claro }}>
        {Math.floor(valor)}
      </span>
      <span className="text-xs text-niebla sm:text-sm">{texto}</span>
    </div>
  )
}

function Bloqueado({ texto, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed bg-transparent text-sm text-niebla transition-colors hover:text-papel" style={{ borderColor: A.linea }}>
      <IconoCandado tamaño={16} className="text-fexx" />
      {texto} — iniciá sesión para ver todo
    </button>
  )
}
