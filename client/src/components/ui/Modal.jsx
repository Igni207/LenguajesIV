import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { DURACION, EASE } from '../../data/movimiento'

// Modal animado: fondo desenfocado + panel que escala de 0.96 a 1.
// Cierra con Escape, con clic en el fondo o con el botón ×.
// Bloquea el scroll de la página y devuelve el foco al cerrar.
//
// <Modal abierto={abierto} onCerrar={() => setAbierto(false)} titulo="Esto es para miembros">
//   ...contenido...
// </Modal>

const enfocables =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

export function Modal({ abierto, onCerrar, titulo, icono = null, children, ancho = 440 }) {
  const [montado, setMontado] = useState(abierto)
  const fondoRef = useRef(null)
  const panelRef = useRef(null)
  const focoPrevio = useRef(null)
  const idTitulo = useId()

  // Montar al abrir; al cerrar, primero animar y después desmontar.
  // (Ajustar estado durante el render es el patrón recomendado por React
  // para derivar estado de props, en lugar de hacerlo en un efecto.)
  if (abierto && !montado) setMontado(true)

  useEffect(() => {
    if (!montado) return
    const fondo = fondoRef.current
    const panel = panelRef.current
    if (abierto) {
      focoPrevio.current = document.activeElement
      document.body.style.overflow = 'hidden'
      gsap.fromTo(fondo, { opacity: 0 }, { opacity: 1, duration: DURACION.media })
      gsap.fromTo(
        panel,
        { opacity: 0, scale: 0.96, y: 8 },
        { opacity: 1, scale: 1, y: 0, duration: DURACION.media + 0.1, ease: EASE.salida },
      )
      panel.querySelector(enfocables)?.focus()
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = ''
          focoPrevio.current?.focus?.()
          setMontado(false)
        },
      })
      tl.to(panel, { opacity: 0, scale: 0.97, duration: DURACION.rapida + 0.05 })
      tl.to(fondo, { opacity: 0, duration: DURACION.rapida + 0.05 }, 0)
    }
  }, [abierto, montado])

  useEffect(() => () => (document.body.style.overflow = ''), [])

  if (!montado) return null

  const alTeclear = (e) => {
    if (e.key === 'Escape') onCerrar?.()
    // Mantener el foco dentro del modal con Tab
    if (e.key === 'Tab') {
      const lista = [...panelRef.current.querySelectorAll(enfocables)]
      if (!lista.length) return
      const primero = lista[0]
      const ultimo = lista[lista.length - 1]
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={alTeclear}>
      <div
        ref={fondoRef}
        aria-hidden="true"
        onClick={onCerrar}
        className="absolute inset-0 bg-tinta/70 backdrop-blur-md"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        className="relative flex w-full flex-col items-center gap-4 rounded-3xl border border-pizarra bg-grafito px-8 pb-8 pt-10 text-center"
        style={{ maxWidth: ancho }}
      >
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute right-3 top-3 flex size-11 cursor-pointer items-center justify-center rounded-full text-niebla hover:text-papel"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {icono}
        <h2 id={idTitulo} className="m-0 text-[28px]">
          {titulo}
        </h2>
        {children}
      </div>
    </div>,
    document.body,
  )
}

// Ícono de candado para el modal de acceso y el contenido bloqueado.
export function IconoCandado({ tamaño = 32, className = 'text-ssanty' }) {
  return (
    <svg width={tamaño} height={tamaño} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}
