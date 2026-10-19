import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { DURACION, EASE } from '../../data/movimiento'
// El provider ya está puesto en main.jsx - Rojo
const ContextoToast = createContext(null)

const estilos = {
  exito: { color: 'text-exito', barra: 'bg-exito', fondo: 'bg-exito/15', icono: 'M5 12.5l4.5 4.5L19 7.5' },
  error: { color: 'text-error', barra: 'bg-error', fondo: 'bg-error/15', icono: 'M12 7v6M12 17h.01' },
  info: { color: 'text-info', barra: 'bg-info', fondo: 'bg-info/15', icono: 'M12 11v6M12 7h.01' },
  advertencia: { color: 'text-advertencia', barra: 'bg-advertencia', fondo: 'bg-advertencia/15', icono: 'M12 8v5M12 17h.01' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const quitar = useCallback((id) => setToasts((lista) => lista.filter((t) => t.id !== id)), [])

  const mostrar = useCallback(({ tipo = 'info', titulo, mensaje = '', duracion = 4 }) => {
    const id = crypto.randomUUID()
    setToasts((lista) => [...lista, { id, tipo, titulo, mensaje, duracion }])
    return id
  }, [])

  return (
    <ContextoToast.Provider value={{ mostrar }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[340px] max-w-[calc(100%-2rem)] flex-col gap-3 sm:bottom-6 sm:right-6"
      >
        {toasts.map((t) => (
          <ItemToast key={t.id} {...t} onFin={() => quitar(t.id)} />
        ))}
      </div>
    </ContextoToast.Provider>
  )
}

function ItemToast({ tipo, titulo, mensaje, duracion, onFin }) {
  const raiz = useRef(null)
  const barra = useRef(null)
  const tiempo = useRef(null)
  const e = estilos[tipo] ?? estilos.info

  const cerrar = useCallback(() => {
    tiempo.current?.kill()
    gsap.to(raiz.current, { opacity: 0, x: 24, duration: DURACION.media, ease: EASE.suave, onComplete: onFin })
  }, [onFin])

  useLayoutEffect(() => {
    gsap.fromTo(raiz.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: DURACION.media + 0.1, ease: EASE.salida })
    tiempo.current = gsap.fromTo(
      barra.current,
      { scaleX: 1 },
      { scaleX: 0, duration: duracion, ease: 'none', transformOrigin: 'left', onComplete: cerrar },
    )
    return () => tiempo.current?.kill()
  }, [duracion, cerrar])

  return (
    <div
      ref={raiz}
      role="status"
      onMouseEnter={() => tiempo.current?.pause()}
      onMouseLeave={() => tiempo.current?.resume()}
      className="pointer-events-auto overflow-hidden rounded-2xl border border-pizarra bg-grafito"
    >
      <div className="flex items-start gap-3.5 px-[18px] py-4">
        <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${e.fondo}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={e.color}>
            <path d={e.icono} />
          </svg>
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[15px] font-semibold">{titulo}</span>
          {mensaje && <span className="text-sm text-niebla">{mensaje}</span>}
        </div>
        <button type="button" onClick={cerrar} aria-label="Cerrar aviso" className="-mr-2 -mt-1 flex size-8 cursor-pointer items-center justify-center rounded-full text-niebla hover:text-papel">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <span ref={barra} className={`block h-[3px] ${e.barra}`} />
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ContextoToast)
  if (!ctx) throw new Error('useToast tiene que usarse dentro de <ToastProvider>')
  return ctx
}
