import { integrantes } from '../../data/integrantes'

export function Footer() {
  return (
    <footer className="border-t border-pizarra/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="flex flex-col gap-4">
            <span className="font-display text-[28px] font-bold tracking-[-0.02em]">
              [equipo]<span className="text-fexx">_</span>
            </span>
            <p className="m-0 max-w-sm text-niebla">Hacemos la web desde adentro. Diseño, frontend, backend y datos en un mismo equipo.</p>
            <div aria-hidden="true" className="flex gap-1.5">
              {integrantes.map((m) => (
                <span key={m.id} className="h-1.5 w-8 rounded-full" style={{ background: m.claro }} />
              ))}
            </div>
          </div>

          <nav aria-label="Pie de página" className="flex flex-wrap gap-x-8 gap-y-3 text-[15px]">
            <a href="#equipo" className="text-papel/80 no-underline hover:text-papel">Equipo</a>
            <a href="#servicios" className="text-papel/80 no-underline hover:text-papel">Servicios</a>
            <a href="#proyectos" className="text-papel/80 no-underline hover:text-papel">Proyectos</a>
            <a href="#contacto" className="text-papel/80 no-underline hover:text-papel">Contacto</a>
            <a href="https://github.com/Igni207/LenguajesIV" target="_blank" rel="noreferrer" className="text-papel/80 no-underline hover:text-papel">
              GitHub ↗
            </a>
          </nav>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-pizarra/60 pt-6 font-mono text-xs text-niebla sm:flex-row">
          <span>Lenguajes IV · Universidad Católica de Salta · 2026</span>
          <span>Hecho por {integrantes.map((m) => m.nombre).join(', ')}</span>
        </div>
      </div>
    </footer>
  )
}
