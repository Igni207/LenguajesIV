import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { integrantes } from '../../data/integrantes'
import { DURACION, EASE } from '../../data/movimiento'
import { useMovimientoReducido } from '../../hooks/useMovimientoReducido'
import { Silueta } from './Silueta'
import { Boton } from '../ui/Boton'

gsap.registerPlugin(useGSAP)

// Hero con el slider de integrantes.
//
// - Rota sola cada `intervalo` segundos; las barras de abajo muestran el avance.
// - Al cambiar: la foto actual sale, el fondo funde al tono profundo del
//   siguiente, entra su nombre gigante y después su foto.
// - Se pausa con el mouse sobre los indicadores o con el foco adentro.
//   (No con el mouse sobre todo el hero: ocupa la pantalla y nunca arrancaría.)
// - Se puede deslizar con el dedo y cambiar con las flechas del teclado.
// - Con "reducir movimiento" activado: sin autoplay y cambios instantáneos.

export function HeroIntegrantes({ intervalo = 5 }) {
  const raiz = useRef(null)
  const fotos = useRef([])
  const nombres = useRef([])
  const barras = useRef([])
  const anterior = useRef(0)
  const avance = useRef(null)
  const toque = useRef(null)

  const [indice, setIndice] = useState(0)
  const [pausado, setPausado] = useState(false)
  const reducido = useMovimientoReducido()

  const total = integrantes.length
  const actual = integrantes[indice]
  const ir = (i) => setIndice(((i % total) + total) % total)

  // Estado inicial: solo el primero visible.
  useGSAP(
    () => {
      fotos.current.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 }))
      nombres.current.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 0.9 : 0 }))
      gsap.set(raiz.current, { backgroundColor: integrantes[0].profundo })
      if (!reducido) {
        gsap.from(fotos.current[0], { yPercent: 12, autoAlpha: 0, duration: DURACION.escena, ease: EASE.salida, delay: 0.2 })
        gsap.from(nombres.current[0], { y: 40, autoAlpha: 0, duration: DURACION.escena, ease: EASE.salida })
      }
    },
    { scope: raiz },
  )

  // Transición entre integrantes.
  useGSAP(
    () => {
      const de = anterior.current
      const a = indice
      if (de === a) return
      anterior.current = a
      // Hacia adelante (1) o hacia atrás (-1), por el camino más corto en el círculo
      const signo = (a - de + total) % total <= total / 2 ? 1 : -1
      const d = reducido ? 0 : 1

      const tl = gsap.timeline({ defaults: { ease: EASE.salida } })
      tl.to(fotos.current[de], { xPercent: -18 * signo, autoAlpha: 0, duration: 0.7 * d }, 0)
        .to(nombres.current[de], { xPercent: 12 * signo, autoAlpha: 0, duration: 0.9 * d }, 0)
        .to(raiz.current, { backgroundColor: integrantes[a].profundo, duration: DURACION.escena * d, ease: EASE.suave }, 0)
        .fromTo(nombres.current[a], { xPercent: -12 * signo, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 0.9, duration: 1.4 * d }, 0.15 * d)
        .fromTo(fotos.current[a], { xPercent: 18 * signo, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: DURACION.escena * d, ease: 'back.out(1.2)' }, 0.3 * d)
    },
    { dependencies: [indice], scope: raiz },
  )

  // Barra de progreso + autoplay (el tween de la barra es el temporizador).
  useGSAP(
    () => {
      barras.current.forEach((el) => gsap.set(el, { scaleX: 0, transformOrigin: 'left' }))
      if (reducido) return
      avance.current = gsap.fromTo(
        barras.current[indice],
        { scaleX: 0 },
        { scaleX: 1, duration: intervalo, ease: 'none', onComplete: () => ir(indice + 1) },
      )
      if (pausado) avance.current.pause()
    },
    { dependencies: [indice, reducido, intervalo], scope: raiz, revertOnUpdate: true },
  )

  const pausar = (si) => {
    setPausado(si)
    if (si) avance.current?.pause()
    else avance.current?.resume()
  }

  const alTeclear = (e) => {
    if (e.key === 'ArrowRight') ir(indice + 1)
    if (e.key === 'ArrowLeft') ir(indice - 1)
  }

  const alSoltar = (e) => {
    if (toque.current === null) return
    const dx = e.clientX - toque.current
    toque.current = null
    if (Math.abs(dx) > 50) ir(indice + (dx < 0 ? 1 : -1))
  }

  return (
    <section
      ref={raiz}
      aria-roledescription="carrusel"
      aria-label="Integrantes del equipo"
      onFocus={() => pausar(true)}
      onBlur={(e) => !raiz.current.contains(e.relatedTarget) && pausar(false)}
      onKeyDown={alTeclear}
      onPointerDown={(e) => (toque.current = e.clientX)}
      onPointerUp={alSoltar}
      className="relative h-[min(100svh,860px)] min-h-[640px] touch-pan-y overflow-hidden select-none"
    >
      {/* Luz suave del color claro detrás de la foto */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-[background] duration-[1200ms] ease-suave"
        style={{ background: `radial-gradient(circle at 62% 60%, ${actual.claro}2E, transparent 52%)` }}
      />

      {/* Nombres gigantes (detrás de la foto) */}
      {/* Ojo: los elementos que anima GSAP no usan clases translate-* de
          Tailwind (GSAP las pisa). Se centran con un contenedor flex. */}
      {integrantes.map((m, i) => (
        <div
          key={m.id}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[34%] flex justify-center sm:top-[24%]"
        >
          <div
            ref={(el) => (nombres.current[i] = el)}
            className="whitespace-nowrap font-display font-bold leading-[0.9] tracking-[-0.04em]"
            style={{ color: m.claro, fontSize: m.nombreHero.length > 6 ? 'clamp(64px, 12.5vw, 200px)' : 'clamp(88px, 15vw, 220px)' }}
          >
            {m.nombreHero}
          </div>
        </div>
      ))}

      {/* Fotos */}
      {integrantes.map((m, i) => (
        <div
          key={m.id}
          ref={(el) => (fotos.current[i] = el)}
          aria-hidden={i !== indice}
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[62%] w-[min(380px,72vw)] sm:h-[74%]"
        >
          <Silueta integrante={m} />
        </div>
      ))}

      {/* Texto principal */}
      <div className="absolute left-4 right-4 top-24 z-10 flex flex-col gap-4 sm:left-[clamp(16px,4vw,48px)] sm:right-auto sm:top-auto sm:bottom-16 sm:max-w-[420px] sm:gap-5">
        <span className="etiqueta text-papel/75">Equipo de desarrollo fullstack</span>
        <h1 className="m-0 text-[clamp(36px,4.4vw,64px)] leading-[1.05] text-papel">Hacemos la web desde adentro.</h1>
        <p className="m-0 hidden text-lg leading-relaxed text-papel/85 sm:block">
          Somos cuatro desarrolladores de la Universidad Católica de Salta: diseño, frontend, backend y datos en un mismo equipo.
        </p>
        <div className="hidden flex-wrap gap-3 sm:flex">
          <Boton href="#equipo" color={actual.clase} className="transition-colors duration-[1200ms]">
            Conocé al equipo
          </Boton>
          <Boton href="#contacto" variante="secundario" className="border-papel/50!">
            Contactanos
          </Boton>
        </div>
      </div>

      {/* Indicadores (también son botones para elegir integrante) */}
      <div
        onMouseEnter={() => pausar(true)}
        onMouseLeave={() => pausar(false)}
        className="absolute bottom-2 left-4 right-4 z-10 flex gap-2 sm:bottom-auto sm:left-auto sm:right-[clamp(16px,4vw,48px)] sm:top-1/2 sm:w-40 sm:-translate-y-1/2 sm:flex-col sm:gap-1">
        {integrantes.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => ir(i)}
            aria-label={`Ver a ${m.nombre}`}
            aria-current={i === indice}
            className="flex flex-1 cursor-pointer flex-col items-start gap-2 bg-transparent py-4 text-papel sm:py-2.5"
          >
            <span className="block h-1 w-full overflow-hidden rounded-full bg-papel/20">
              <span ref={(el) => (barras.current[i] = el)} className="block h-full w-full origin-left" style={{ background: m.claro, transform: 'scaleX(0)' }} />
            </span>
            <span className={`hidden text-[13px] font-semibold transition-opacity duration-300 sm:block ${i === indice ? 'opacity-100' : 'opacity-55'}`}>
              {m.nombre}
            </span>
          </button>
        ))}
      </div>

      {/* Rol del integrante actual */}
      <div className="absolute bottom-16 right-[clamp(16px,4vw,48px)] z-10 hidden flex-col items-end gap-1.5 sm:flex">
        <span className="font-mono text-[13px] text-papel/70">
          0{indice + 1} / 0{total}
        </span>
        <span className="font-display text-xl font-medium text-papel">{actual.rol}</span>
      </div>

      {/* Para lectores de pantalla: anuncia el cambio solo si el usuario interactúa */}
      <p className="sr-only" aria-live={pausado ? 'polite' : 'off'}>
        {actual.nombre}, {actual.rol}. Integrante {indice + 1} de {total}.
      </p>
    </section>
  )
}
