import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { integrantes } from '../../data/integrantes'
import { useMovimientoReducido } from '../../hooks/useMovimientoReducido'
import { useAparecer } from '../../hooks/useAparecer'

// cantidad de tecnologías = las que pusieron en sus chips, sin repetir - Rojo
const tecnologias = new Set(integrantes.flatMap((m) => m.chips)).size

export function Nosotros({ cantidadProyectos }) {
  const raiz = useRef(null)
  const reducido = useMovimientoReducido()
  useAparecer(raiz)

  const contadores = [
    { valor: integrantes.length, texto: 'integrantes', color: 'text-fexx' },
    { valor: cantidadProyectos, texto: 'proyectos', color: 'text-ssanty' },
    { valor: tecnologias, texto: 'tecnologías', color: 'text-ultronzi' },
  ]

  // los números suben de 0 al valor cuando aparecen en pantalla
  useGSAP(
    () => {
      if (reducido) return
      gsap.utils.selector(raiz)('[data-contador]').forEach((el) => {
        const final = Number(el.dataset.contador)
        if (!final) return
        const obj = { n: 0 }
        gsap.to(obj, {
          n: final,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => (el.textContent = Math.round(obj.n)),
        })
      })
    },
    { scope: raiz, dependencies: [reducido, cantidadProyectos] },
  )

  return (
    <section ref={raiz} id="nosotros" aria-labelledby="t-nosotros" className="flex flex-wrap items-end justify-between gap-16">
      <div data-aparecer className="flex min-w-0 max-w-2xl flex-[1_1_520px] flex-col gap-6">
        <span className="etiqueta text-fexx">Nosotros</span>
        <h2 id="t-nosotros" className="m-0 text-[clamp(28px,3.2vw,44px)] leading-[1.1]">
          Cuatro perfiles, un mismo stack.
        </h2>
        <p className="m-0 text-[19px] leading-relaxed text-niebla">
          [Cómo trabajamos como equipo: en qué nos especializamos, cómo nos repartimos un proyecto y qué tipo de soluciones construimos. 2 o 3 líneas.]
        </p>
      </div>
      <div data-aparecer className="grid min-w-0 flex-[1_1_360px] grid-cols-3 gap-3 sm:gap-4">
        {contadores.map((c) => (
          <div key={c.texto} className="flex flex-col gap-1.5 rounded-2xl bg-grafito p-5 sm:p-6">
            <span
              data-contador={c.valor ?? ''}
              className={`font-display text-[clamp(32px,4vw,44px)] font-bold ${c.color}`}
            >
              {c.valor ?? '—'}
            </span>
            <span className="text-sm text-niebla">{c.texto}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
