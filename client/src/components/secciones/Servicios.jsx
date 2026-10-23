import { useRef } from 'react'
import { useAparecer } from '../../hooks/useAparecer'
import { Encabezado } from './Encabezado'

// Gonzi: por ahora están a mano. Cuando hagas GET /api/services los traigo de ahí (tabla servicios) - Rojo
const servicios = [
  {
    titulo: 'Desarrollo web',
    texto: 'Sitios y aplicaciones web a medida, rápidas y adaptadas a celular y escritorio.',
    color: '#7C9CE4',
    icono: 'M4 6h16v12H4zM4 9h16',
  },
  {
    titulo: 'APIs y backend',
    texto: 'Servidores, bases de datos, autenticación y envío de emails para que tu app funcione.',
    color: '#B6D76E',
    icono: 'M8 8l-4 4 4 4M16 8l4 4-4 4M13 6l-2 12',
  },
  {
    titulo: 'Paneles y métricas',
    texto: 'Dashboards con gráficos para ver tus datos y tomar decisiones.',
    color: '#C29FE6',
    icono: 'M5 19V11M12 19V5M19 19v-6',
  },
  {
    titulo: 'Diseño UI/UX',
    texto: 'Identidad visual, prototipos y animaciones que hacen que tu producto se sienta vivo.',
    color: '#EE8E80',
    icono: 'M12 3a9 9 0 100 18c1 0 1.5-.7 1.5-1.5 0-.9-.7-1.2-.7-2 0-.8.7-1.5 1.5-1.5H17a4 4 0 004-4c0-5-4-9-9-9zM7.5 12h.01M10 8h.01M14 8h.01',
  },
]

export function Servicios() {
  const raiz = useRef(null)
  useAparecer(raiz)

  return (
    <section ref={raiz} id="servicios" aria-labelledby="t-servicios" className="flex flex-col gap-12">
      <Encabezado
        id="t-servicios"
        etiqueta="Servicios"
        titulo="Lo que podemos hacer por vos."
        bajada="Desde la idea hasta el deploy: diseñamos, programamos y lo dejamos andando."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {servicios.map((s) => (
          <div key={s.titulo} data-aparecer className="flex">
          <article
            className="group relative flex w-full flex-col gap-4 overflow-hidden rounded-3xl bg-grafito p-7 transition-transform duration-300 ease-salida hover:-translate-y-1.5"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 ease-salida group-hover:scale-x-100"
              style={{ background: s.color }}
            />
            <span
              className="flex size-12 items-center justify-center rounded-2xl"
              style={{ background: `${s.color}26`, color: s.color }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={s.icono} />
              </svg>
            </span>
            <h3 className="m-0 text-[22px]">{s.titulo}</h3>
            <p className="m-0 leading-relaxed text-niebla">{s.texto}</p>
          </article>
          </div>
        ))}
      </div>
    </section>
  )
}
