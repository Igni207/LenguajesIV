import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { integrantes } from '../../data/integrantes'
import { useMovimientoReducido } from '../../hooks/useMovimientoReducido'
import { useAparecer } from '../../hooks/useAparecer'
import { Navbar } from '../layout/Navbar'
import { Footer } from '../layout/Footer'
import { Silueta } from '../animaciones/Silueta'
import { Boton, IconoCandado } from '../ui'
import { IconoContacto } from './Contacto'
import { ModalMiembros, anio, periodo, usePerfil } from './comun'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// mi página: un lienzo de diseño con mesas de trabajo, selección, capas y una línea de tiempo de animación - Rojo
const C = {
  claro: '#EE8E80',
  medio: '#C9705F',
  profundo: '#6A3530',
  panel: '#1F191B',
  linea: '#3A2D30',
  fondo: '#151113',
}

const capas = [
  { id: 'd-contacto', nombre: 'Contacto' },
  { id: 'd-sobre', nombre: 'Sobre mí' },
  { id: 'd-exp', nombre: 'Experiencia' },
  { id: 'd-hab', nombre: 'Habilidades' },
  { id: 'd-edu', nombre: 'Educación' },
  { id: 'd-proy', nombre: 'Proyectos' },
]

export function PerfilDiseno({ integrante }) {
  const raiz = useRef(null)
  const cursor = useRef(null)
  const reducido = useMovimientoReducido()
  const perfil = usePerfil(integrante)
  const { cv, contacto } = perfil
  const [activa, setActiva] = useState(capas[0].id)
  useAparecer(raiz)

  useEffect(() => {
    const obs = new IntersectionObserver((ents) => ents.forEach((e) => e.isIntersecting && setActiva(e.target.id)), { rootMargin: '-40% 0px -55% 0px' })
    capas.forEach((c) => {
      const el = document.getElementById(c.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  useGSAP(
    () => {
      if (reducido) return
      const q = gsap.utils.selector(raiz)
      // el cursor con mi nombre pasea por la mesa de trabajo
      gsap.timeline({ repeat: -1, defaults: { duration: 1.6, ease: 'power2.inOut' } })
        .to(cursor.current, { x: 120, y: 40 })
        .to(cursor.current, { x: 300, y: 210, delay: 0.4 })
        .to(cursor.current, { x: 60, y: 300, delay: 0.5 })
        .to(cursor.current, { x: 0, y: 0, delay: 0.4 })
      // la caja de selección "se dibuja"
      gsap.from(q('[data-seleccion]'), { scale: 0.92, autoAlpha: 0, duration: 0.8, ease: 'back.out(1.6)', delay: 0.4 })
      gsap.from(q('[data-manija]'), { scale: 0, duration: 0.4, ease: 'back.out(2)', stagger: 0.06, delay: 0.9 })
      // fotogramas clave y deslizadores al bajar
      q('[data-keyframe]').forEach((el, i) =>
        gsap.from(el, { scale: 0, rotate: 45, duration: 0.5, ease: 'back.out(2)', delay: i * 0.12, scrollTrigger: { trigger: el, start: 'top 90%', once: true } }),
      )
      q('[data-pista]').forEach((el) =>
        gsap.from(el, { scaleX: 0, transformOrigin: 'left', duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }),
      )
    },
    { scope: raiz, dependencies: [reducido, perfil.isAuthenticated], revertOnUpdate: true },
  )

  const inicio = Math.min(...cv.experiencia.map((e) => anio(e.desde)))
  const fin = Math.floor(anio('Actualidad')) + 1
  const pos = (a) => ((a - inicio) / (fin - inicio)) * 100
  const anios = Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i)

  return (
    <div ref={raiz} className="relative min-h-screen overflow-x-clip" style={{ background: C.fondo, backgroundImage: `radial-gradient(${C.linea} 1.2px, transparent 1.2px)`, backgroundSize: '24px 24px' }}>
      <Navbar />

      <div className="relative mx-auto max-w-7xl px-4 pt-24 sm:px-8 lg:px-12">
        <div aria-hidden="true" className="mx-auto flex w-fit items-center gap-1 rounded-xl border p-1.5" style={{ background: C.panel, borderColor: C.linea }}>
          {['M5 3l14 9-6 1-3 6z', 'M4 4h16v16H4zM4 9h16M9 9v11', 'M5 6V4h14v2M12 4v16M9 20h6', 'M4 20c4-1 6-4 8-8s4-7 8-8'].map((d, i) => (
            <span key={i} className="flex size-9 items-center justify-center rounded-lg" style={i === 0 ? { background: C.claro, color: '#161923' } : { color: '#9BA1B3' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"><path d={d} /></svg>
            </span>
          ))}
          <span className="mx-1 h-6 w-px" style={{ background: C.linea }} />
          <span className="px-2 font-mono text-xs text-niebla">100%</span>
        </div>
      </div>

      <header className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-8 lg:px-12">
        <Etiqueta texto="Inicio — 1440 × auto" />
        <div className="relative grid grid-cols-1 gap-10 overflow-hidden rounded-2xl border p-6 sm:p-10 lg:grid-cols-[1.25fr_0.75fr]" style={{ background: C.panel, borderColor: C.linea }}>
          <div className="flex min-w-0 flex-col gap-6">
            <span className="etiqueta" style={{ color: C.claro }}>04 — {integrante.rol}</span>
            <div data-seleccion className="relative w-fit max-w-full border-[1.5px] border-dashed p-3" style={{ borderColor: C.claro }}>
              <h1 className="m-0 text-[clamp(40px,6vw,76px)] leading-[0.95]">{integrante.nombre}</h1>
              {['-left-1.5 -top-1.5', '-right-1.5 -top-1.5', '-bottom-1.5 -left-1.5', '-bottom-1.5 -right-1.5'].map((p) => (
                <span key={p} data-manija aria-hidden="true" className={`absolute size-3 rounded-[2px] border-[1.5px] bg-papel ${p}`} style={{ borderColor: C.claro }} />
              ))}
              <span aria-hidden="true" className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[11px] text-tinta" style={{ background: C.claro }}>
                Space Grotesk · 700
              </span>
            </div>
            <p className="m-0 mt-4 max-w-xl text-lg leading-relaxed text-papel/85">{integrante.bio}</p>
            <div className="flex flex-wrap gap-3">
              <Boton href={contacto.email.href} color="rojo"><IconoContacto tipo="email" />Escribirme</Boton>
              <Boton href={contacto.whatsapp.href} target="_blank" rel="noreferrer" variante="secundario" className="border-papel/40!">WhatsApp</Boton>
              <Boton variante="fantasma" onClick={perfil.descargarCv}>
                {!perfil.isAuthenticated && <IconoCandado tamaño={16} className="text-papel" />}
                Descargar CV
              </Boton>
            </div>
          </div>

          <div className="relative flex min-h-[340px] flex-col justify-between gap-6">
            <div className="flex flex-wrap gap-2" aria-label="Paleta del equipo">
              {integrantes.map((m) => (
                <div key={m.id} className="flex flex-col gap-1.5">
                  <span className="size-12 rounded-xl" style={{ background: m.claro }} />
                  <span className="font-mono text-[10px] text-niebla">{m.claro}</span>
                </div>
              ))}
            </div>
            <div className="relative mx-auto h-[260px] w-[260px]">
              <span aria-hidden="true" className="absolute inset-0 rounded-full" style={{ background: C.profundo }} />
              <span aria-hidden="true" className="absolute inset-6 rounded-full border-[1.5px] border-dashed" style={{ borderColor: `${C.claro}88` }} />
              <div className="absolute inset-x-0 bottom-0 mx-auto h-[300px] w-[200px] [clip-path:inset(-60px_0_0_0_round_0_0_130px_130px)]">
                <Silueta integrante={integrante} />
              </div>
            </div>
          </div>

          <div ref={cursor} aria-hidden="true" className="pointer-events-none absolute left-[55%] top-[18%] hidden lg:block">
            <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 3l16 7.5-7 1.8L9.5 20z" fill={C.claro} stroke="#161923" strokeWidth="1.2" strokeLinejoin="round" /></svg>
            <span className="ml-4 rounded-full px-2 py-0.5 font-mono text-[11px] font-medium text-tinta" style={{ background: C.claro }}>{integrante.nombreCorto}</span>
          </div>
        </div>
      </header>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-28 sm:px-8 lg:grid-cols-[220px_1fr] lg:px-12">
        <aside className="hidden lg:block">
          <nav aria-label="Capas" className="sticky top-24 flex flex-col gap-1 rounded-2xl border p-3" style={{ background: C.panel, borderColor: C.linea }}>
            <span className="mb-1 px-2 font-mono text-xs uppercase tracking-wider text-niebla">Capas</span>
            {capas.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                aria-current={activa === c.id ? 'true' : undefined}
                className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm no-underline transition-colors"
                style={{ color: activa === c.id ? '#161923' : '#EEEBE4', background: activa === c.id ? C.claro : 'transparent' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 4h16v16H4zM4 9h16" /></svg>
                {c.nombre}
              </a>
            ))}
          </nav>
        </aside>

        <main className="flex min-w-0 flex-col gap-12">
          <Mesa id="d-contacto" titulo="Contacto">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { tipo: 'email', texto: contacto.email.texto, href: contacto.email.href },
                { tipo: 'telefono', texto: contacto.telefono.texto, href: contacto.telefono.href },
                { tipo: 'whatsapp', texto: 'Escribir por WhatsApp ↗', href: contacto.whatsapp.href, externo: true },
                { tipo: 'ciudad', texto: integrante.ciudad },
              ].map((c) => (
                <div key={c.tipo} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: C.fondo }}>
                  <span style={{ color: C.claro }}><IconoContacto tipo={c.tipo} /></span>
                  {c.href ? (
                    <a href={c.href} {...(c.externo ? { target: '_blank', rel: 'noreferrer' } : {})} className="min-w-0 truncate text-papel no-underline hover:underline">{c.texto}</a>
                  ) : (
                    <span>{c.texto}</span>
                  )}
                </div>
              ))}
            </div>
          </Mesa>

          <Mesa id="d-sobre" titulo="Sobre mí">
            <p className="m-0 text-lg leading-relaxed text-papel/85">{cv.sobreMi}</p>
          </Mesa>

          <Mesa id="d-exp" titulo="Experiencia" extra="ease: expo.out">
            <div className="flex flex-col gap-6">
              <div className="relative overflow-x-auto">
                <div className="min-w-[480px]">
                  <div className="relative ml-[200px] flex h-6 font-mono text-xs text-niebla">
                    {anios.map((a, i) => (
                      <span key={a} className={`absolute ${i === 0 ? '' : i === anios.length - 1 ? '-translate-x-full' : '-translate-x-1/2'}`} style={{ left: `${pos(a)}%` }}>{a}</span>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-col gap-3">
                    {perfil.experiencia.map((e) => {
                      const desde = pos(anio(e.desde))
                      const hasta = pos(Math.min(fin, Math.max(anio(e.hasta), anio(e.desde) + 0.15)))
                      return (
                        <div key={e.puesto} className="grid grid-cols-[200px_1fr] items-center">
                          <span className="pr-3 text-sm font-semibold leading-tight">{e.lugar.split(' · ')[0]}</span>
                          <div className="relative h-9 rounded-lg" style={{ background: C.fondo }}>
                            <span data-pista className="absolute inset-y-[15px] rounded-full" style={{ left: `${desde}%`, width: `${hasta - desde}%`, background: `${C.claro}88` }} />
                            {[desde, hasta].map((x, i) => (
                              <span key={i} data-keyframe aria-hidden="true" className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px] border-2" style={{ left: `${x}%`, background: i === 0 ? C.claro : C.fondo, borderColor: C.claro }} />
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {perfil.experiencia.map((e) => (
                  <article key={e.puesto + e.desde} className="flex flex-col gap-1.5 rounded-xl p-4" style={{ background: C.fondo }}>
                    <span className="font-mono text-xs" style={{ color: C.claro }}>{periodo(e)}</span>
                    <span className="font-semibold">{e.puesto}</span>
                    <span className="text-sm text-niebla">{e.lugar}</span>
                    <p className="m-0 mt-1 text-sm leading-relaxed text-papel/80">{e.descripcion}</p>
                  </article>
                ))}
                {perfil.expOcultas > 0 && <Bloqueado texto={`${perfil.expOcultas} ${perfil.expOcultas === 1 ? 'experiencia más' : 'experiencias más'}`} onClick={perfil.pedirSesion} />}
              </div>
            </div>
          </Mesa>

          <Mesa id="d-hab" titulo="Habilidades">
            <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
              {cv.habilidades.map((h) => (
                <div key={h.nombre} className="flex flex-col gap-2.5">
                  <div className="flex justify-between text-[15px] font-semibold">
                    <span>{h.nombre}</span>
                    <span className="rounded-md px-1.5 font-mono text-xs leading-5" style={{ background: C.fondo, color: C.claro }}>{h.nivel}</span>
                  </div>
                  <div className="relative h-1.5 rounded-full" style={{ background: C.linea }}>
                    <span data-pista className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${h.nivel}%`, background: C.claro }} />
                    <span aria-hidden="true" className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-papel" style={{ left: `${h.nivel}%`, borderColor: C.claro }} />
                  </div>
                </div>
              ))}
            </div>
          </Mesa>

          <Mesa id="d-edu" titulo="Educación">
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {cv.educacion.map((e) => (
                <li key={e.titulo} className="grid grid-cols-1 gap-1 rounded-xl p-4 sm:grid-cols-[150px_1fr_auto] sm:items-center sm:gap-4" style={{ background: C.fondo }}>
                  <span className="font-mono text-sm" style={{ color: C.claro }}>{periodo(e)}</span>
                  <span className="font-semibold">{e.titulo}</span>
                  <span className="text-sm text-niebla">{e.lugar}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {cv.idiomas.map((i) => (
                <span key={i.nombre} className="rounded-full border px-3 py-1.5 text-sm" style={{ borderColor: C.linea }}>
                  {i.nombre} · <span className="text-niebla">{i.nivel}</span>
                </span>
              ))}
            </div>
          </Mesa>

          <Mesa id="d-proy" titulo="Proyectos">
            {perfil.cargando ? (
              <p className="m-0 text-sm text-niebla">Cargando…</p>
            ) : perfil.proyectos.length === 0 ? (
              <p className="m-0 text-niebla">Todavía no hay proyectos cargados.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {perfil.proyVisibles.map((p) => (
                  <article key={p.id} className="group flex flex-col gap-3">
                    <span className="font-mono text-xs text-niebla">{p.titulo} — 1440 × 900</span>
                    <div className="relative h-40 overflow-hidden rounded-xl border transition-colors group-hover:border-[#EE8E80]" style={{ background: C.fondo, borderColor: C.linea }}>
                      <span className="absolute left-5 top-5 h-2 w-2/3 rounded-full" style={{ background: `${C.claro}aa` }} />
                      <span className="absolute left-5 top-10 h-2 w-1/2 rounded-full bg-papel/15" />
                      <span className="absolute -bottom-6 right-6 h-28 w-28 rotate-6 rounded-2xl transition-transform duration-500 group-hover:rotate-0" style={{ background: C.claro }} />
                    </div>
                    {p.descripcion && <span className="text-sm text-niebla">{p.descripcion}</span>}
                    <div>
                      <Boton variante="secundario" onClick={perfil.verDetalle}>Ver detalle</Boton>
                    </div>
                  </article>
                ))}
                {perfil.proyOcultos > 0 && <Bloqueado texto={`${perfil.proyOcultos} ${perfil.proyOcultos === 1 ? 'proyecto más' : 'proyectos más'}`} onClick={perfil.pedirSesion} />}
              </div>
            )}
          </Mesa>
        </main>
      </div>

      <Footer />
      <ModalMiembros perfil={perfil} integrante={integrante} />
    </div>
  )
}

function Etiqueta({ texto }) {
  return (
    <span className="mb-2 flex items-center gap-2 font-mono text-xs text-niebla">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M7 3v18M17 3v18M3 7h18M3 17h18" /></svg>
      {texto}
    </span>
  )
}

function Mesa({ id, titulo, extra, children }) {
  return (
    <section id={id} data-aparecer aria-labelledby={`${id}-t`} className="flex flex-col">
      <div className="flex items-center justify-between">
        <Etiqueta texto={`${titulo} — mesa de trabajo`} />
        {extra && <span className="mb-2 font-mono text-xs" style={{ color: C.claro }}>{extra}</span>}
      </div>
      <div className="flex flex-col gap-5 rounded-2xl border p-5 sm:p-7" style={{ background: C.panel, borderColor: C.linea }}>
        <h2 id={`${id}-t`} className="m-0 text-[clamp(26px,3vw,36px)]">{titulo}</h2>
        {children}
      </div>
    </section>
  )
}

function Bloqueado({ texto, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed bg-transparent text-sm text-niebla transition-colors hover:text-papel" style={{ borderColor: C.linea }}>
      <IconoCandado tamaño={16} className="text-rojo" />
      {texto} — iniciá sesión para ver todo
    </button>
  )
}
