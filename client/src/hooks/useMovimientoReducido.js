import { useSyncExternalStore } from 'react'

// true si el usuario pidió reducir el movimiento en su sistema operativo.
// Las animaciones de GSAP lo consultan para no hacer autoplay ni parallax.

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
