import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { coloresIntegrante } from '../../data/integrantes'
import { DURACION, EASE } from '../../data/movimiento'
import { useMovimientoReducido } from '../../hooks/useMovimientoReducido'
import { Silueta } from './Silueta'
import { Boton } from '../ui/Boton'
import { Chip } from '../ui/Chip'

gsap.registerPlugin(useGSAP, ScrollTrigger)
// se anima una sola vez cuando aparece en pantalla - Rojo
export function VentanaIntegrante({ integrante, numero, inclinacion = -4, invertida = false, hrefPerfil }) {
  const raiz = useRef(null)
  const reducido = useMovimientoReducido()
  const c = coloresIntegrante[integrante.clase]
  const lineas = [...integrante.codigo, ...integrante.codigo]

  useGSAP(
    () => {
      if (reducido) return
      const q = gsap.utils.selector(raiz)
      const tl = gsap.timeline({
        defaults: { ease: EASE.salida },
        scrollTrigger: { trigger: raiz.current, start: 'top 75%', once: true },
      })
      tl.from(q('[data-ventana]'), { clipPath: 'inset(50% 50% 50% 50% round 16px)', duration: 0.9 })
        .from(q('[data-relleno]'), { yPercent: 100, duration: DURACION.escena }, 0.4)
        .from(q('[data-silueta]'), { yPercent: 105, duration: DURACION.escena + 0.1 }, 0.75)
        .from(q('[data-texto] > *'), { y: 24, autoAlpha: 0, duration: DURACION.lenta, stagger: 0.08 }, 0.9)
    },
    { scope: raiz, dependencies: [reducido] },
  )

  return (
    <article
      ref={raiz}
      className={`flex flex-col items-center gap-10 md:gap-16 ${invertida ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      <div className="flex w-full min-w-0 flex-1 justify-center">
        <div
          className="group relative mt-24 h-[260px] w-full max-w-[460px] transition-transform duration-500 ease-salida hover:rotate-0! sm:h-[300px]"
          style={{ rotate: `${inclinacion}deg` }}
        >
          <div
            data-ventana
            className="absolute inset-0 overflow-hidden rounded-2xl bg-grafito"
            style={{ clipPath: 'inset(0 0 0 0 round 16px)' }}
          >
            <div data-relleno className={`absolute inset-x-0 bottom-0 h-[64%] opacity-90 ${c.bg}`} />
            <pre
              aria-hidden="true"
              className="absolute inset-x-0 top-0 m-0 animate-codigo whitespace-pre px-6 py-5 font-mono text-[12px] leading-[1.7] text-papel/40 sm:text-[13px]"
            >
              {lineas.join('\n')}
            </pre>
          </div>

          <div className="pointer-events-none absolute inset-0 [clip-path:inset(-200px_0_0_0)]">
            <div data-silueta className="absolute inset-x-0 bottom-0 mx-auto h-[330px] w-[220px] sm:h-[360px] sm:w-[240px]">
              <div className="h-full w-full transition-transform duration-500 ease-salida group-hover:-translate-y-2">
                <Silueta integrante={integrante} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-texto className="flex w-full min-w-0 max-w-[480px] flex-1 flex-col gap-[18px]">
        <span className={`etiqueta ${c.text}`}>
          {String(numero).padStart(2, '0')} — {integrante.rol}
        </span>
        <h3 className="m-0 text-[32px] sm:text-[44px]">{integrante.nombre}</h3>
        <p className="m-0 text-[17px] leading-relaxed text-niebla">{integrante.bio}</p>
        <div className="flex flex-wrap gap-2">
          {integrante.chips.map((ch) => (
            <Chip key={ch}>{ch}</Chip>
          ))}
        </div>
        <div>
          <Boton href={hrefPerfil ?? `/equipo/${integrante.slug}`} color={integrante.clase}>
            Ver perfil →
          </Boton>
        </div>
      </div>
    </article>
  )
}
