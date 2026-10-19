import { useSyncExternalStore } from 'react'

const consulta = '(prefers-reduced-motion: reduce)'

function suscribir(avisar) {
  const mq = window.matchMedia(consulta)
  mq.addEventListener('change', avisar)
  return () => mq.removeEventListener('change', avisar)
}

export function useMovimientoReducido() {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(consulta).matches,
    () => false,
  )
}
