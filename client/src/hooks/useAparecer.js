import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { DURACION, EASE } from '../data/movimiento'
import { useMovimientoReducido } from './useMovimientoReducido'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// a todo lo que tenga data-aparecer adentro de ref lo hace entrar de abajo cuando aparece en pantalla - Rojo
export function useAparecer(ref) {
  const reducido = useMovimientoReducido()

  useGSAP(
    () => {
      if (reducido) return
      const q = gsap.utils.selector(ref)
      q('[data-aparecer]').forEach((el) => {
        gsap.from(el, {
          y: 32,
          autoAlpha: 0,
          duration: DURACION.lenta,
          ease: EASE.salida,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      })
    },
    { scope: ref, dependencies: [reducido] },
  )
}
