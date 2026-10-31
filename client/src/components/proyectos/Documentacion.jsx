import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// todo lo que muestra la documentación de un proyecto, se usa en el perfil y en /proyectos/:clave - Rojo

export const temas = {
  luna: { fondo: '#0E1022', panel: '#171A33', linea: '#2A2E52', acento: '#E6B43C', suave: '#EBEBD2', tinte: '#5A46A0', pixel: true },
  ring: { fondo: '#0B0B10', panel: '#15151D', linea: '#2A2A36', acento: '#F5C518', suave: '#E5484D', tinte: '#3AB4D9' },
  aura: { fondo: '#0D0F1F', panel: '#171A2E', linea: '#2B2F4A', acento: '#9FB8FF', suave: '#E7A6FF', tinte: '#6B7CFF' },
  mazmorra: { fondo: '#15110E', panel: '#211A15', linea: '#3B3027', acento: '#E8833A', suave: '#D9C7A3', tinte: '#7A5C3E', pixel: true },
  base: { fondo: '#161923', panel: '#20242F', linea: '#3A3F52', acento: '#7C9CE4', suave: '#C29FE6', tinte: '#7C9CE4' },
}

export const temaDe = (doc) => temas[doc?.tema] ?? temas.base

// el cuerpo de la documentación: cifras, capturas, arquitectura, ficha con roadmap y desarrollo
export function DocProyecto({ doc }) {
  const t = temaDe(doc)
  const [abierta, setAbierta] = useState(null)
  const capturas = doc.capturas ?? []

  return (
    <div className="flex flex-col gap-14">
      {doc.cifras?.length > 0 && (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border lg:grid-cols-4" style={{ borderColor: t.linea, background: t.linea }}>
          {doc.cifras.map((c) => (
            <div key={c.texto} className="flex flex-col gap-1 p-5" style={{ background: t.panel }}>
              <span className="font-display text-[clamp(24px,2.6vw,34px)] font-bold" style={{ color: t.acento }}>{c.valor}</span>
              <span className="text-sm text-niebla">{c.texto}</span>
            </div>
          ))}
        </div>
      )}

      {capturas.length > 0 && (
        <Bloque titulo="Capturas" extra={`${capturas.length}`} t={t}>
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 lg:grid-cols-4">
            {capturas.map((c, i) => (
              <li key={c.src}>
                <button type="button" onClick={() => setAbierta(i)} className="group flex w-full cursor-zoom-in flex-col gap-2 border-0 bg-transparent p-0 text-left">
                  <span className="block overflow-hidden rounded-lg border" style={{ borderColor: t.linea }}>
                    <img src={c.src} alt={c.titulo} loading="lazy" className="block aspect-video w-full object-cover transition-transform duration-500 ease-salida group-hover:scale-[1.05]" style={t.pixel ? { imageRendering: 'pixelated' } : undefined} />
                  </span>
                  <span className="text-xs leading-snug text-niebla transition-colors group-hover:text-papel">{c.titulo}</span>
                </button>
              </li>
            ))}
          </ul>
        </Bloque>
      )}

      {doc.arquitectura && (
        <Bloque titulo="Cómo está armado" t={t}>
          <Arquitectura bloques={doc.arquitectura} t={t} />
        </Bloque>
      )}

      {(doc.ficha?.length > 0 || doc.roadmap?.length > 0) && (
        <Bloque titulo="Ficha técnica" t={t}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            {doc.ficha?.length > 0 && (
              <dl className="m-0 flex flex-col self-start overflow-hidden rounded-2xl border" style={{ borderColor: t.linea, background: t.panel }}>
                <span className="px-5 pt-4 font-mono text-xs uppercase tracking-wider text-niebla">Stack</span>
                {doc.ficha.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[112px_1fr] gap-3 px-5 py-3 text-sm" style={{ borderTop: `1px solid ${t.linea}` }}>
                    <dt className="font-mono text-[11px] uppercase leading-5 tracking-wider" style={{ color: t.acento }}>{k}</dt>
                    <dd className="m-0 leading-5 text-papel/90">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {doc.roadmap?.length > 0 && <Roadmap items={doc.roadmap} t={t} />}
          </div>
        </Bloque>
      )}

      {doc.secciones?.length > 0 && (
        <Bloque titulo="Desarrollo" t={t}>
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
            {doc.secciones.map((s) => (
              <article key={s.titulo} className="flex flex-col gap-3">
                <h4 className="m-0 font-display text-[21px]">{s.titulo}</h4>
                {s.parrafos?.map((p) => (
                  <p key={p.slice(0, 24)} className="m-0 leading-relaxed text-papel/80">{p}</p>
                ))}
                {s.lista && (
                  <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {s.lista.map((x) => (
                      <li key={x.slice(0, 24)} className="flex gap-3 leading-relaxed text-papel/80">
                        <span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 rotate-45" style={{ background: t.acento }} />
                        {x}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </Bloque>
      )}

      {abierta !== null && <Visor capturas={capturas} indice={abierta} setIndice={setAbierta} pixel={t.pixel} />}
    </div>
  )
}

function Bloque({ titulo, extra, t, children }) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-baseline gap-3">
        <h3 className="m-0 text-[clamp(22px,2.4vw,28px)]">{titulo}</h3>
        {extra && <span className="font-mono text-sm" style={{ color: t.acento }}>{extra}</span>}
        <span aria-hidden="true" className="h-px flex-1" style={{ background: t.linea }} />
      </div>
      {children}
    </section>
  )
}

const ESTADOS = { hecho: 'Hecho', 'en-curso': 'En desarrollo', futuro: 'A futuro' }

export function Roadmap({ items, t }) {
  const hay = Object.keys(ESTADOS).filter((e) => items.some((i) => i.estado === e))
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-wider text-niebla">
        <span>Roadmap</span>
        {hay.map((e) => (
          <span key={e} className="flex items-center gap-2">
            <Nodo estado={e} t={t} chico />
            {ESTADOS[e]}
          </span>
        ))}
      </div>
      <ol className="relative m-0 flex list-none flex-col gap-0 p-0">
        {items.map((it, i) => (
          <li key={it.titulo} className="relative grid grid-cols-[22px_1fr] gap-4 pb-6 last:pb-0">
            {i < items.length - 1 && (
              <span aria-hidden="true" className="absolute left-[10px] top-6 bottom-0 w-0.5"
                style={{ background: items[i + 1].estado === 'hecho' ? t.acento : `repeating-linear-gradient(${t.linea} 0 6px, transparent 6px 10px)` }} />
            )}
            <span className="relative pt-0.5"><Nodo estado={it.estado} t={t} /></span>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: it.estado === 'futuro' ? '#9BA1B3' : t.acento }}>
                {it.etiqueta}
                <span className="sr-only"> · {ESTADOS[it.estado]}</span>
              </span>
              <span className={`font-semibold ${it.estado === 'futuro' ? 'text-papel/75' : ''}`}>{it.titulo}</span>
              <span className="text-sm leading-relaxed text-niebla">{it.detalle}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Nodo({ estado, t, chico }) {
  const tam = chico ? 'size-3' : 'size-[22px]'
  if (estado === 'hecho') {
    return (
      <span aria-hidden="true" className={`${tam} flex items-center justify-center rounded-full text-[11px] font-bold text-tinta`} style={{ background: t.acento }}>
        {!chico && '✓'}
      </span>
    )
  }
  if (estado === 'en-curso') {
    return (
      <span aria-hidden="true" className={`${tam} relative flex items-center justify-center rounded-full border-2`} style={{ borderColor: t.acento, background: t.fondo }}>
        <span className="absolute inset-0 rounded-full motion-safe:animate-ping" style={{ background: `${t.acento}55` }} />
        <span className={`${chico ? 'size-1' : 'size-2'} rounded-full`} style={{ background: t.acento }} />
      </span>
    )
  }
  return <span aria-hidden="true" className={`${tam} block rounded-full border-2 border-dashed`} style={{ borderColor: '#9BA1B3', background: t.fondo }} />
}

export function Arquitectura({ bloques, t }) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
      {bloques.map((b, i) => (
        <div key={b.titulo} className="contents">
          {i > 0 && (
            <span aria-hidden="true" className="flex items-center justify-center font-mono text-xl" style={{ color: t.acento }}>
              <span className="md:hidden">↕</span>
              <span className="hidden md:inline">⇄</span>
            </span>
          )}
          <div className="flex flex-col gap-3 rounded-2xl border p-5" style={{ borderColor: i === 1 ? t.acento : t.linea, background: t.panel }}>
            <span className="font-display text-xl font-bold">{b.titulo}</span>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {b.items.map((x) => (
                <li key={x} className="flex gap-2.5 text-sm text-papel/80">
                  <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full" style={{ background: i === 1 ? t.acento : t.suave }} />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

// el juego se abre en una ventana grande arriba de todo
export function DemoModal({ doc, onCerrar }) {
  const t = temaDe(doc)
  const marco = useRef(null)
  const cerrarBtn = useRef(null)

  useEffect(() => {
    cerrarBtn.current?.focus()
    const tecla = (e) => e.key === 'Escape' && document.activeElement?.tagName !== 'IFRAME' && onCerrar()
    window.addEventListener('keydown', tecla)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', tecla)
      document.body.style.overflow = ''
    }
  }, [onCerrar])

  // portal: si el padre tiene un transform (las animaciones de GSAP), el fixed se rompe
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`Demo de ${doc.titulo}`} className="fixed inset-0 z-[70] flex flex-col gap-3 p-3 animate-entrar sm:p-6" style={{ background: `${t.fondo}f2` }}>
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate font-display text-lg font-bold">{doc.titulo} <span className="font-mono text-xs font-normal" style={{ color: t.acento }}>· demo</span></span>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => marco.current?.requestFullscreen?.()} className="min-h-10 cursor-pointer rounded-full border bg-transparent px-4 text-sm font-semibold text-papel hover:bg-papel/10" style={{ borderColor: t.linea }}>
            Pantalla completa
          </button>
          <button ref={cerrarBtn} type="button" onClick={onCerrar} aria-label="Cerrar demo" className="size-10 cursor-pointer rounded-full border bg-transparent text-lg text-papel hover:bg-papel/10" style={{ borderColor: t.linea }}>
            ✕
          </button>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="flex min-h-0 items-center justify-center">
          <div className="relative aspect-video max-h-full w-full overflow-hidden rounded-xl border-4 bg-black" style={{ borderColor: t.linea }}>
            <iframe ref={marco} src={doc.demo.src} title={`Demo de ${doc.titulo}`} allow="fullscreen; gamepad; autoplay" className="absolute inset-0 size-full border-0" />
          </div>
        </div>
        <aside className="hidden flex-col gap-3 lg:flex">
          <dl className="m-0 flex flex-col gap-3 rounded-xl border p-4" style={{ borderColor: t.linea, background: t.panel }}>
            <span className="font-mono text-xs uppercase tracking-wider" style={{ color: t.acento }}>Controles</span>
            {doc.demo.controles.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5 text-sm">
                <dt className="font-semibold">{k}</dt>
                <dd className="m-0 text-niebla">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="m-0 text-xs leading-relaxed text-niebla">{doc.demo.aviso}</p>
          <p className="m-0 text-xs leading-relaxed text-niebla">{doc.demo.nota}</p>
        </aside>
      </div>
    </div>,
    document.body,
  )
}

export function Visor({ capturas, indice, setIndice, pixel }) {
  const c = capturas[indice]
  const boton = useRef(null)

  useEffect(() => {
    boton.current?.focus()
    const tecla = (e) => {
      if (e.key === 'Escape') setIndice(null)
      if (e.key === 'ArrowRight') setIndice((i) => (i + 1) % capturas.length)
      if (e.key === 'ArrowLeft') setIndice((i) => (i - 1 + capturas.length) % capturas.length)
    }
    window.addEventListener('keydown', tecla)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', tecla)
      document.body.style.overflow = ''
    }
  }, [capturas.length, setIndice])

  const mover = (n) => setIndice((i) => (i + n + capturas.length) % capturas.length)
  const clase = 'size-11 cursor-pointer rounded-full border border-papel/30 bg-transparent text-xl text-papel hover:bg-papel/10'

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={c.titulo} className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4 bg-black/90 p-4 animate-entrar" onClick={() => setIndice(null)}>
      <img src={c.src} alt={c.titulo} className="max-h-[78vh] max-w-full rounded-lg object-contain" style={pixel ? { imageRendering: 'pixelated' } : undefined} onClick={(e) => e.stopPropagation()} />
      <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Anterior" onClick={() => mover(-1)} className={clase}>‹</button>
        <span className="min-w-0 text-center text-sm text-papel/90">
          {c.titulo} <span className="text-niebla">· {indice + 1}/{capturas.length}</span>
        </span>
        <button type="button" aria-label="Siguiente" onClick={() => mover(1)} className={clase}>›</button>
      </div>
      <button ref={boton} type="button" onClick={() => setIndice(null)} className={`absolute right-4 top-4 ${clase}`} aria-label="Cerrar">✕</button>
    </div>,
    document.body,
  )
}

// portada chica para las tarjetas (Aura no tiene capturas, va un dibujo)
export function Portada({ doc, className = '' }) {
  const t = temaDe(doc)
  if (doc.portada) {
    return <img src={doc.portada} alt="" loading="lazy" className={`block size-full object-cover ${className}`} style={t.pixel ? { imageRendering: 'pixelated' } : undefined} />
  }
  return (
    <div aria-hidden="true" className={`size-full overflow-hidden ${className || 'relative'}`} style={{ background: `radial-gradient(ellipse at 50% 60%, ${t.tinte}55, ${t.fondo} 70%) ${t.fondo}` }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border" style={{ width: `${30 + i * 22}%`, borderColor: `${i % 2 ? t.suave : t.acento}55`, borderStyle: i % 2 ? 'dashed' : 'solid' }} />
      ))}
      <span className="absolute left-1/2 top-1/2 aspect-square w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(circle at 35% 30%, #fff, ${t.acento} 40%, ${t.tinte})`, boxShadow: `0 0 40px ${t.acento}88` }} />
    </div>
  )
}
