import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useAuth } from '../../context/AuthContext'
import { useMovimientoReducido } from '../../hooks/useMovimientoReducido'
import { useAparecer } from '../../hooks/useAparecer'
import { useProyectosDe } from '../../hooks/useProyectosDe'
import { Navbar } from '../layout/Navbar'
import { Footer } from '../layout/Footer'
import { Silueta } from '../animaciones/Silueta'
import { Boton, IconoCandado, Modal, useToast } from '../ui'
import { IconoContacto, linksContacto } from './Contacto'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Gonzi: tu página está ambientada en bases de datos: terminal de postgres, el CV como tablas y un diagrama de fondo - Rojo
const V = {
  claro: '#B6D76E',
  medio: '#8DB04F',
  profundo: '#3F5326',
  panel: '#1B2318',
  linea: '#2E3A27',
}

export function PerfilBaseDeDatos({ integrante }) {
  const raiz = useRef(null)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { mostrar } = useToast()
  const { proyectos, cargando } = useProyectosDe(integrante)
  const [modal, setModal] = useState(false)
  const reducido = useMovimientoReducido()
  useAparecer(raiz)

  const cv = integrante.cv
  const contacto = linksContacto(integrante)
  const experiencia = isAuthenticated ? cv.experiencia : cv.experiencia.slice(0, 2)
  const expOcultas = cv.experiencia.length - experiencia.length
  const proyVisibles = isAuthenticated ? proyectos : proyectos.filter((p) => p.destacado).slice(0, 2)
  const proyOcultos = proyectos.length - proyVisibles.length

  const pedirSesion = () => setModal(true)
  const irALogin = () => {
    setModal(false)
    navigate('/login', { state: { from: location } })
  }

  // las filas de cada tabla entran una por una
  useGSAP(
    () => {
      if (reducido) return
      gsap.utils.selector(raiz)('[data-tabla]').forEach((tabla) => {
        gsap.from(tabla.querySelectorAll('[data-fila]'), {
          x: -16,
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: { trigger: tabla, start: 'top 85%', once: true },
        })
      })
      gsap.utils.selector(raiz)('[data-barra]').forEach((b) => {
        gsap.from(b, { scaleX: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 92%', once: true } })
      })
    },
    { scope: raiz, dependencies: [reducido, isAuthenticated, proyectos.length], revertOnUpdate: true },
  )

  return (
    <div ref={raiz} className="relative min-h-screen overflow-x-clip" style={{ background: `radial-gradient(1200px 600px at 80% -10%, ${V.profundo}66, transparent 60%), #141A12` }}>
      <DiagramaFondo />
      <Navbar />

      <header className="relative mx-auto grid max-w-7xl grid-cols-1 items-end gap-12 px-4 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
        <div className="flex min-w-0 flex-col gap-8">
          <Terminal integrante={integrante} reducido={reducido} />
          <div data-aparecer className="flex flex-col gap-4">
            <span className="etiqueta" style={{ color: V.claro }}>
              03 — {integrante.rol}
            </span>
            <h1 className="m-0 text-[clamp(40px,6vw,76px)] leading-[0.95]">{integrante.nombre}</h1>
            <p className="m-0 max-w-xl text-lg leading-relaxed text-papel/85">{integrante.bio}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Boton href={contacto.email.href} color="ultronzi">
                <IconoContacto tipo="email" />
                Escribirme
              </Boton>
              <Boton href={contacto.whatsapp.href} target="_blank" rel="noreferrer" variante="secundario" className="border-papel/40!">
                <IconoContacto tipo="whatsapp" />
                WhatsApp
              </Boton>
              <Boton
                variante="fantasma"
                onClick={() =>
                  isAuthenticated
                    ? mostrar({ tipo: 'info', titulo: 'CV en camino', mensaje: 'El PDF todavía no está cargado.' })
                    : pedirSesion()
                }
              >
                {!isAuthenticated && <IconoCandado tamaño={16} className="text-papel" />}
                Descargar CV
              </Boton>
            </div>
          </div>
        </div>

        <div className="relative hidden h-[420px] lg:block">
          <div className="absolute inset-x-6 bottom-0 h-[300px] -rotate-3 overflow-hidden rounded-2xl" style={{ background: V.panel }}>
            <div className="absolute inset-x-0 bottom-0 h-[62%] opacity-90" style={{ background: V.claro }} />
            <pre aria-hidden="true" className="absolute inset-x-0 top-0 m-0 animate-codigo whitespace-pre px-6 py-5 font-mono text-[13px] leading-[1.7] text-papel/40">
              {Array(2)
                .fill(
                  'CREATE TABLE proyectos (\n  id SERIAL PRIMARY KEY,\n  titulo VARCHAR(150),\n  destacado BOOLEAN\n);\nCREATE INDEX ON proyectos (autor);\nSELECT * FROM usuarios\n  WHERE rol = \'admin\';\n',
                )
                .join('')}
            </pre>
          </div>
          <div className="pointer-events-none absolute inset-x-6 bottom-0 h-[300px] -rotate-3 [clip-path:inset(-200px_0_0_0)]">
            <div className="absolute inset-x-0 bottom-0 mx-auto h-[380px] w-[250px]">
              <Silueta integrante={integrante} />
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto flex max-w-7xl flex-col gap-24 px-4 pb-28 sm:px-8 lg:px-12">
        <section aria-labelledby="g-contacto" className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div data-aparecer className="flex flex-col gap-4">
            <Consulta>\d contacto</Consulta>
            <h2 id="g-contacto" className="m-0 text-[clamp(28px,3vw,40px)]">Contacto</h2>
            <p className="m-0 max-w-md text-niebla">La forma más rápida es por mail o WhatsApp. Respondo en el día.</p>
          </div>
          <Tabla columnas={['campo', 'valor']} anchos="grid-cols-[110px_1fr] sm:grid-cols-[140px_1fr]">
            <Fila>
              <Celda mono>email</Celda>
              <Celda>
                <a href={contacto.email.href} className="break-all no-underline" style={{ color: V.claro }}>{contacto.email.texto}</a>
              </Celda>
            </Fila>
            <Fila>
              <Celda mono>teléfono</Celda>
              <Celda>
                <a href={contacto.telefono.href} className="no-underline" style={{ color: V.claro }}>{contacto.telefono.texto}</a>
              </Celda>
            </Fila>
            <Fila>
              <Celda mono>whatsapp</Celda>
              <Celda>
                <a href={contacto.whatsapp.href} target="_blank" rel="noreferrer" className="no-underline" style={{ color: V.claro }}>{contacto.whatsapp.texto} ↗</a>
              </Celda>
            </Fila>
            <Fila>
              <Celda mono>ciudad</Celda>
              <Celda>{integrante.ciudad}</Celda>
            </Fila>
          </Tabla>
        </section>

        <section aria-labelledby="g-sobre" className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div data-aparecer className="flex flex-col gap-4">
            <Consulta>COMMENT ON gonzalo</Consulta>
            <h2 id="g-sobre" className="m-0 text-[clamp(28px,3vw,40px)]">Sobre mí</h2>
          </div>
          <p data-aparecer className="m-0 text-lg leading-relaxed text-papel/85">{cv.sobreMi}</p>
        </section>

        <section aria-labelledby="g-exp" className="flex flex-col gap-8">
          <div data-aparecer className="flex flex-col gap-4">
            <Consulta>SELECT * FROM experiencia ORDER BY desde DESC;</Consulta>
            <h2 id="g-exp" className="m-0 text-[clamp(28px,3vw,40px)]">Experiencia</h2>
          </div>
          <Tabla columnas={['período', 'puesto', 'descripción']} anchos="grid-cols-1 md:grid-cols-[150px_1fr_1.4fr]">
            {experiencia.map((e) => (
              <Fila key={e.puesto + e.desde}>
                <Celda mono>{e.desde} — {e.hasta}</Celda>
                <Celda>
                  <span className="block font-semibold">{e.puesto}</span>
                  <span className="text-sm text-niebla">{e.lugar}</span>
                </Celda>
                <Celda className="text-niebla">{e.descripcion}</Celda>
              </Fila>
            ))}
            {expOcultas > 0 && <FilaBloqueada texto={`${expOcultas} ${expOcultas === 1 ? 'fila más' : 'filas más'}`} onClick={pedirSesion} />}
          </Tabla>
          <ContadorFilas n={cv.experiencia.length} />
        </section>

        <section aria-labelledby="g-edu" className="flex flex-col gap-8">
          <div data-aparecer className="flex flex-col gap-4">
            <Consulta>SELECT * FROM educacion;</Consulta>
            <h2 id="g-edu" className="m-0 text-[clamp(28px,3vw,40px)]">Educación</h2>
          </div>
          <Tabla columnas={['período', 'título', 'institución']} anchos="grid-cols-1 md:grid-cols-[150px_1fr_1fr]">
            {cv.educacion.map((e) => (
              <Fila key={e.titulo}>
                <Celda mono>{e.desde ? `${e.desde} — ${e.hasta}` : e.hasta}</Celda>
                <Celda className="font-semibold">{e.titulo}</Celda>
                <Celda className="text-niebla">{e.lugar}</Celda>
              </Fila>
            ))}
          </Tabla>
        </section>

        <section aria-labelledby="g-hab" className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-8">
            <div data-aparecer className="flex flex-col gap-4">
              <Consulta>SELECT nombre, nivel FROM habilidades;</Consulta>
              <h2 id="g-hab" className="m-0 text-[clamp(28px,3vw,40px)]">Habilidades</h2>
            </div>
            <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
              {cv.habilidades.map((h) => (
                <div key={h.nombre} data-aparecer className="flex flex-col gap-2">
                  <div className="flex justify-between text-[15px] font-semibold">
                    <span>{h.nombre}</span>
                    <span className="font-mono text-xs text-niebla">{h.nivel}%</span>
                  </div>
                  <span className="block h-1.5 overflow-hidden rounded-full" style={{ background: V.linea }}>
                    <span data-barra className="block h-full origin-left rounded-full" style={{ width: `${h.nivel}%`, background: V.claro }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div data-aparecer className="flex flex-col gap-4">
              <Consulta>SELECT * FROM idiomas;</Consulta>
              <h2 className="m-0 text-[clamp(28px,3vw,40px)]">Idiomas</h2>
            </div>
            <Tabla columnas={['idioma', 'nivel']} anchos="grid-cols-2">
              {cv.idiomas.map((i) => (
                <Fila key={i.nombre}>
                  <Celda className="font-semibold">{i.nombre}</Celda>
                  <Celda mono>{i.nivel}</Celda>
                </Fila>
              ))}
            </Tabla>
          </div>
        </section>

        <section aria-labelledby="g-proy" className="flex flex-col gap-8">
          <div data-aparecer className="flex flex-col gap-4">
            <Consulta>{`SELECT * FROM proyectos WHERE autor = '${integrante.nombreCorto}';`}</Consulta>
            <h2 id="g-proy" className="m-0 text-[clamp(28px,3vw,40px)]">Proyectos</h2>
          </div>
          {cargando ? (
            <p className="m-0 font-mono text-sm text-niebla">ejecutando consulta…</p>
          ) : proyVisibles.length === 0 && proyOcultos === 0 ? (
            <p className="m-0 font-mono text-sm text-niebla">(0 filas)</p>
          ) : (
            <>
              <Tabla columnas={['id', 'título', 'tipo', '']} anchos="grid-cols-[50px_1fr_auto] md:grid-cols-[60px_1fr_140px_150px]">
                {proyVisibles.map((p) => (
                  <Fila key={p.id}>
                    <Celda mono className="text-niebla">{p.id}</Celda>
                    <Celda>
                      <span className="block font-semibold">{p.titulo}</span>
                      {p.descripcion && <span className="text-sm text-niebla">{p.descripcion}</span>}
                    </Celda>
                    <Celda mono className="hidden md:block">{p.tipo}</Celda>
                    <Celda>
                      <button
                        type="button"
                        onClick={() =>
                          isAuthenticated
                            ? mostrar({ tipo: 'info', titulo: 'Próximamente', mensaje: 'El detalle de cada proyecto está en camino.' })
                            : pedirSesion()
                        }
                        className="min-h-10 cursor-pointer rounded-full border-[1.5px] bg-transparent px-4 text-sm font-semibold text-papel transition-colors hover:text-tinta"
                        style={{ borderColor: V.medio }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = V.claro)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        Ver detalle
                      </button>
                    </Celda>
                  </Fila>
                ))}
                {proyOcultos > 0 && <FilaBloqueada texto={`${proyOcultos} ${proyOcultos === 1 ? 'proyecto más' : 'proyectos más'}`} onClick={pedirSesion} />}
              </Tabla>
              <ContadorFilas n={proyectos.length} />
            </>
          )}
        </section>
      </main>

      <Footer />

      <Modal
        abierto={modal}
        onCerrar={() => setModal(false)}
        titulo="Esto es para miembros"
        icono={
          <span className="flex size-[72px] items-center justify-center rounded-full" style={{ background: `${V.claro}26` }}>
            <IconoCandado className="text-ultronzi" />
          </span>
        }
      >
        <p className="m-0 leading-normal text-niebla">Con una cuenta gratis ves la experiencia completa, todos los proyectos y el CV para descargar.</p>
        <div className="mt-2 flex w-full flex-col gap-2.5">
          <Boton color="ultronzi" tamaño="lg" onClick={irALogin}>Crear cuenta</Boton>
          <Boton variante="secundario" tamaño="lg" onClick={irALogin}>Ya tengo cuenta</Boton>
        </div>
      </Modal>
    </div>
  )
}

// terminal que escribe la consulta sola y después muestra el resultado
function Terminal({ integrante, reducido }) {
  const consulta = `SELECT nombre, rol, ciudad FROM integrantes WHERE nombre = '${integrante.nombreCorto}';`
  const [escrito, setEscrito] = useState(reducido ? consulta.length : 0)
  const listo = escrito >= consulta.length

  useEffect(() => {
    if (reducido) return
    let i = 0
    const t = setInterval(() => {
      i += 1
      setEscrito(i)
      if (i >= consulta.length) clearInterval(t)
    }, 28)
    return () => clearInterval(t)
  }, [consulta, reducido])

  return (
    <div className="overflow-hidden rounded-2xl border shadow-2xl shadow-black/30" style={{ background: '#0F140D', borderColor: V.linea }}>
      <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: V.linea }}>
        <span className="size-3 rounded-full bg-rojo/80" />
        <span className="size-3 rounded-full bg-arena/80" />
        <span className="size-3 rounded-full" style={{ background: V.claro }} />
        <span className="ml-3 font-mono text-xs text-niebla">psql — portfolio</span>
      </div>
      <div className="flex flex-col gap-3 overflow-x-auto px-5 py-4 font-mono text-[13px] leading-relaxed sm:text-sm">
        <p className="m-0 whitespace-pre-wrap break-words">
          <span style={{ color: V.claro }}>portfolio=#</span> {consulta.slice(0, escrito)}
          {!listo && <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse" style={{ background: V.claro }} />}
        </p>
        {listo && (
          <div className="animate-entrar">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="text-niebla">
                  <th className="border-b pb-1 pr-4 font-normal" style={{ borderColor: V.linea }}>nombre</th>
                  <th className="border-b pb-1 pr-4 font-normal" style={{ borderColor: V.linea }}>rol</th>
                  <th className="hidden border-b pb-1 font-normal sm:table-cell" style={{ borderColor: V.linea }}>ciudad</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pr-4 pt-1">{integrante.nombre}</td>
                  <td className="pr-4 pt-1">{integrante.rol}</td>
                  <td className="hidden pt-1 sm:table-cell">{integrante.ciudad}</td>
                </tr>
              </tbody>
            </table>
            <p className="m-0 mt-2 text-niebla">(1 fila)</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Consulta({ children }) {
  return (
    <span className="font-mono text-[13px]" style={{ color: V.claro }}>
      <span className="text-niebla">portfolio=# </span>
      {children}
    </span>
  )
}

const GrillaTabla = createContext('')

function Tabla({ columnas, anchos, children }) {
  return (
    <GrillaTabla.Provider value={anchos}>
      <div data-tabla className="overflow-hidden rounded-2xl border" style={{ borderColor: V.linea, background: `${V.panel}cc` }}>
        <div className={`hidden gap-4 border-b px-5 py-3 font-mono text-xs uppercase tracking-wider text-niebla md:grid ${anchos}`} style={{ borderColor: V.linea }}>
          {columnas.map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </div>
        <div className="flex flex-col">{children}</div>
      </div>
    </GrillaTabla.Provider>
  )
}

function Fila({ children }) {
  const anchos = useContext(GrillaTabla)
  return (
    <div data-fila className={`grid items-center gap-2 border-b px-5 py-4 last:border-b-0 md:gap-4 ${anchos}`} style={{ borderColor: V.linea }}>
      {children}
    </div>
  )
}

function Celda({ children, mono = false, className = '' }) {
  return <div className={`min-w-0 ${mono ? 'font-mono text-sm' : ''} ${className}`}>{children}</div>
}

function FilaBloqueada({ texto, onClick }) {
  return (
    <button
      type="button"
      data-fila
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent px-5 py-4 text-left font-mono text-sm text-niebla transition-colors hover:text-papel"
    >
      <IconoCandado tamaño={16} className="text-ultronzi" />
      … {texto} — iniciá sesión para verlas
    </button>
  )
}

function ContadorFilas({ n }) {
  return <span className="font-mono text-xs text-niebla">({n} {n === 1 ? 'fila' : 'filas'})</span>
}

// diagrama de tablas de fondo, muy suave
function DiagramaFondo() {
  const cajas = [
    { x: 60, y: 120, t: 'integrantes', f: ['id', 'nombre', 'rol'] },
    { x: 420, y: 60, t: 'proyectos', f: ['id', 'titulo', 'autor'] },
    { x: 780, y: 200, t: 'usuarios', f: ['id', 'email', 'rol'] },
    { x: 300, y: 380, t: 'consultas', f: ['id', 'tipo', 'estado'] },
    { x: 980, y: 460, t: 'visitas', f: ['id', 'pagina', 'fecha'] },
  ]
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[700px] w-full opacity-[0.14]" viewBox="0 0 1200 620" preserveAspectRatio="xMidYMin slice">
      <g fill="none" stroke={V.claro} strokeWidth="1.2" strokeDasharray="4 6">
        <path d="M220 160 C 320 160, 320 100, 420 100" />
        <path d="M580 100 C 680 100, 680 240, 780 240" />
        <path d="M220 200 C 260 300, 260 420, 300 420" />
        <path d="M940 240 C 1000 300, 1040 380, 1060 460" />
      </g>
      {cajas.map((c) => (
        <g key={c.t} transform={`translate(${c.x} ${c.y})`}>
          <rect width="160" height="112" rx="8" fill="none" stroke={V.claro} strokeWidth="1.2" />
          <rect width="160" height="28" rx="8" fill={V.claro} fillOpacity="0.35" />
          <text x="12" y="19" fontFamily="JetBrains Mono, monospace" fontSize="13" fill={V.claro}>{c.t}</text>
          {c.f.map((f, i) => (
            <text key={f} x="12" y={52 + i * 22} fontFamily="JetBrains Mono, monospace" fontSize="12" fill={V.claro}>{f}</text>
          ))}
        </g>
      ))}
    </svg>
  )
}
