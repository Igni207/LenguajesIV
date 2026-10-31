import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { docDe } from '../../data/documentacion'
import { Boton, IconoCandado } from '../ui'
import { DemoModal, DocProyecto, Portada, temaDe } from './Documentacion'

// proyectos de un integrante: los que tienen documentación se abren acá mismo, con sesión - Rojo
// el link /equipo/slug#p-luna-llena abre ese proyecto directo
export function ListaProyectos({ perfil, color }) {
  const { hash } = useLocation()
  const [elegidos, setElegidos] = useState({})
  const [demo, setDemo] = useState(null)
  const conDoc = perfil.proyVisibles.filter((p) => docDe(p))
  const sinDoc = perfil.proyVisibles.filter((p) => !docDe(p))

  // con sesión arranca abierto el que venga en el link, o el primero
  const pedido = hash.startsWith('#p-') ? hash.slice(3) : null
  const porDefecto = conDoc.some((p) => docDe(p).slug === pedido) ? pedido : conDoc[0] && docDe(conDoc[0]).slug
  const estaAbierto = (slug) => (slug in elegidos ? elegidos[slug] : slug === porDefecto)
  const alternar = (slug) => setElegidos((e) => ({ ...e, [slug]: !estaAbierto(slug) }))

  useEffect(() => {
    if (!pedido || !perfil.isAuthenticated) return
    const id = setTimeout(() => document.getElementById(`p-${pedido}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400)
    return () => clearTimeout(id)
  }, [pedido, perfil.isAuthenticated, conDoc.length])

  return (
    <div className="flex flex-col gap-5">
      {conDoc.map((p) => {
        const doc = docDe(p)
        const t = temaDe(doc)
        const abierto = estaAbierto(doc.slug)
        return (
          <article key={p.id} id={`p-${doc.slug}`} className="scroll-mt-24 overflow-hidden rounded-2xl border" style={{ borderColor: abierto ? t.acento : t.linea, background: t.fondo }}>
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]">
              <div className="relative aspect-video md:aspect-auto md:min-h-[200px]">
                <Portada doc={doc} className="absolute inset-0" />
              </div>
              <div className="flex min-w-0 flex-col gap-3 p-5 sm:p-6">
                <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: t.acento }}>
                  {[doc.tipo, doc.contexto, doc.periodo].filter(Boolean).join(' · ')}
                </span>
                <h3 className={`m-0 text-[clamp(22px,2.4vw,28px)] leading-tight ${doc.tema === 'luna' ? 'font-[Pixelify_Sans,var(--font-display)]' : ''}`}>{doc.titulo}</h3>
                <p className="m-0 leading-relaxed text-papel/80">{doc.bajada}</p>
                <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0" aria-label="Tecnologías">
                  {doc.tecnologias.map((x) => (
                    <li key={x} className="rounded-full border px-2.5 py-0.5 font-mono text-[11px]" style={{ borderColor: t.linea, color: t.suave }}>{x}</li>
                  ))}
                </ul>
                <div className="mt-1 flex flex-wrap gap-3">
                  {doc.demo && (
                    <button
                      type="button"
                      onClick={() => (perfil.isAuthenticated ? setDemo(doc) : perfil.pedirSesion())}
                      className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border-0 px-5 font-[Pixelify_Sans,var(--font-display)] text-lg font-bold text-tinta transition-transform hover:scale-105"
                      style={{ background: t.acento, boxShadow: '0 4px 0 #8A6A1E' }}
                    >
                      {perfil.isAuthenticated ? '▶' : <IconoCandado tamaño={16} className="text-tinta" />} Probar
                    </button>
                  )}
                  <button
                    type="button"
                    aria-expanded={perfil.isAuthenticated ? abierto : undefined}
                    aria-controls={`doc-${doc.slug}`}
                    onClick={() => (perfil.isAuthenticated ? alternar(doc.slug) : perfil.pedirSesion())}
                    className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-[1.5px] bg-transparent px-5 text-sm font-semibold text-papel transition-colors hover:bg-papel/10"
                    style={{ borderColor: t.linea }}
                  >
                    {!perfil.isAuthenticated && <IconoCandado tamaño={16} className="text-papel" />}
                    Documentación
                    {perfil.isAuthenticated && <span aria-hidden="true" className={`transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`}>▾</span>}
                  </button>
                  {perfil.isAuthenticated ? (
                    <a
                      href={`/docs/${doc.slug}.pdf`}
                      download={`${doc.titulo} - Documentación.pdf`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-papel no-underline transition-colors hover:bg-papel/10"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" /></svg>
                      PDF
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
            {perfil.isAuthenticated && abierto && (
              <div id={`doc-${doc.slug}`} className="border-t p-5 animate-entrar sm:p-8" style={{ borderColor: t.linea }}>
                <DocProyecto doc={doc} />
              </div>
            )}
          </article>
        )
      })}

      {sinDoc.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sinDoc.map((p) => (
            <article key={p.id} className="flex flex-col gap-3 rounded-2xl border p-5" style={{ borderColor: '#3A2D30' }}>
              <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color }}>{p.tipo}</span>
              <span className="text-lg font-semibold">{p.titulo}</span>
              {p.descripcion && <span className="text-sm text-niebla">{p.descripcion}</span>}
              <div>
                <Boton variante="secundario" onClick={() => perfil.verDetalle(p)}>Ver detalle</Boton>
              </div>
            </article>
          ))}
        </div>
      )}

      {demo && <DemoModal doc={demo} onCerrar={() => setDemo(null)} />}
    </div>
  )
}
