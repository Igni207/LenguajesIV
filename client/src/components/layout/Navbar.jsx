import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useAuth } from '../../context/AuthContext'
import { DURACION, EASE } from '../../data/movimiento'
import { Boton } from '../ui/Boton'

const links = [
  { id: 'equipo', texto: 'Equipo' },
  { id: 'servicios', texto: 'Servicios' },
  { id: 'proyectos', texto: 'Proyectos' },
  { id: 'contacto', texto: 'Contacto' },
]

// Santy: uso tu useAuth para mostrar Ingresar o el nombre del usuario - Rojo
export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolleado, setScrolleado] = useState(false)
  const [activa, setActiva] = useState('')
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef(null)
  // fuera de la home los links llevan a /#seccion - Rojo
  const enInicio = location.pathname === '/'
  const prefijo = enInicio ? '' : '/'

  useEffect(() => {
    const alScrollear = () => setScrolleado(window.scrollY > 40)
    alScrollear()
    window.addEventListener('scroll', alScrollear, { passive: true })
    return () => window.removeEventListener('scroll', alScrollear)
  }, [])

  // marca en la navbar la sección que se está viendo
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setActiva(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach((l) => {
      const el = document.getElementById(l.id)
      if (el) observador.observe(el)
    })
    return () => observador.disconnect()
  }, [])

  useEffect(() => {
    if (!menuAbierto) return
    document.body.style.overflow = 'hidden'
    const q = gsap.utils.selector(menuRef)
    gsap.fromTo(menuRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: DURACION.media })
    gsap.fromTo(q('[data-link]'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: DURACION.lenta, ease: EASE.salida, stagger: 0.07, delay: 0.1 })
    const alTeclear = (e) => e.key === 'Escape' && setMenuAbierto(false)
    window.addEventListener('keydown', alTeclear)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', alTeclear)
    }
  }, [menuAbierto])

  const irALogin = () => {
    setMenuAbierto(false)
    navigate('/login', { state: { from: location } })
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-300 ${
          scrolleado ? 'border-b border-pizarra/60 bg-tinta/80 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <nav aria-label="Principal" className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-8 lg:px-12">
          <a href={enInicio ? '#inicio' : '/'} className="font-display text-[22px] font-bold tracking-[-0.02em] text-papel no-underline">
            [equipo]<span className="text-fexx">_</span>
          </a>

          <ul className="m-0 hidden list-none items-center gap-8 p-0 md:flex">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`${prefijo}#${l.id}`}
                  aria-current={activa === l.id ? 'true' : undefined}
                  className={`relative py-2 text-[15px] font-medium no-underline transition-colors duration-150 hover:text-papel ${
                    activa === l.id ? 'text-papel' : 'text-papel/70'
                  }`}
                >
                  {l.texto}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-fexx transition-transform duration-300 ease-salida ${
                      activa === l.id ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="hidden items-center gap-3 md:flex">
                <button
                  type="button"
                  onClick={() => navigate('/perfil')}
                  title="Mi perfil"
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-transparent pr-2 text-sm font-semibold text-papel hover:text-fexx"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-papel font-display text-tinta">
                    {(user?.name ?? 'U').slice(0, 1).toUpperCase()}
                  </span>
                  {user?.name}
                </button>
                {user?.role === 'admin' && (
                  <Boton variante="secundario" onClick={() => navigate('/admin')}>Panel</Boton>
                )}
                <Boton variante="fantasma" onClick={logout}>Salir</Boton>
              </div>
            ) : (
              <Boton variante="secundario" className="hidden border-papel/50! md:inline-flex" onClick={irALogin}>
                Ingresar
              </Boton>
            )}

            <button
              type="button"
              onClick={() => setMenuAbierto(true)}
              aria-label="Abrir menú"
              aria-expanded={menuAbierto}
              className="flex size-11 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-xl border-[1.5px] border-papel/40 bg-transparent md:hidden"
            >
              <span className="block h-0.5 w-[18px] rounded-full bg-papel" />
              <span className="block h-0.5 w-[18px] rounded-full bg-papel" />
            </button>
          </div>
        </nav>
      </header>

      {menuAbierto && (
        <div ref={menuRef} role="dialog" aria-modal="true" aria-label="Menú" className="fixed inset-0 z-50 flex flex-col bg-tinta px-4 pb-8 md:hidden">
          <div className="flex h-[72px] items-center justify-between">
            <span className="font-display text-[22px] font-bold">
              [equipo]<span className="text-fexx">_</span>
            </span>
            <button
              type="button"
              onClick={() => setMenuAbierto(false)}
              aria-label="Cerrar menú"
              className="flex size-11 cursor-pointer items-center justify-center rounded-xl border-[1.5px] border-papel/40 bg-transparent text-papel"
              autoFocus
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <ul className="m-0 mt-10 flex list-none flex-col gap-2 p-0">
            {links.map((l, i) => (
              <li key={l.id} data-link>
                <a
                  href={`${prefijo}#${l.id}`}
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-baseline gap-4 py-3 font-display text-[40px] font-bold text-papel no-underline"
                >
                  <span className="font-mono text-sm font-normal text-niebla">0{i + 1}</span>
                  {l.texto}
                </a>
              </li>
            ))}
          </ul>
          <div data-link className="mt-auto flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-center text-sm text-niebla">Sesión iniciada como {user?.name}</span>
                <Boton tamaño="lg" onClick={() => { setMenuAbierto(false); navigate('/perfil') }}>Mi perfil</Boton>
                {user?.role === 'admin' && (
                  <Boton variante="secundario" tamaño="lg" onClick={() => { setMenuAbierto(false); navigate('/admin') }}>Panel admin</Boton>
                )}
                <Boton variante="fantasma" tamaño="lg" onClick={logout}>Salir</Boton>
              </>
            ) : (
              <Boton tamaño="lg" onClick={irALogin}>Ingresar</Boton>
            )}
          </div>
        </div>
      )}
    </>
  )
}
