import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { integrantes } from '../data/integrantes'
import { Navbar } from '../components/layout/Navbar'
import { Silueta } from '../components/animaciones/Silueta'
import { Boton } from '../components/ui'

// 404: una ventana vacía con alguno de nosotros buscando la página - Rojo
export default function NoEncontrada() {
  const navigate = useNavigate()
  const [m] = useState(() => integrantes[Math.floor(Math.random() * integrantes.length)])

  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[100svh] overflow-x-clip max-w-7xl flex-col items-center justify-center gap-12 px-4 pb-16 pt-28 text-center sm:px-8">
        <div className="relative h-[220px] w-full max-w-[420px] -rotate-3">
          <div className="absolute inset-0 overflow-hidden rounded-2xl bg-grafito">
            <pre aria-hidden="true" className="m-0 animate-codigo whitespace-pre px-6 py-5 text-left font-mono text-[13px] leading-[1.7] text-papel/30">
              {Array(2)
                .fill("GET /esta-pagina\n404 Not Found\nbuscando...\nif (!pagina) return null\n")
                .join('')}
            </pre>
          </div>
          <div className="pointer-events-none absolute inset-0 [clip-path:inset(-120px_0_0_0)]">
            <div className="absolute -bottom-6 left-[58%] h-[250px] w-[170px] rotate-12">
              <Silueta integrante={m} />
            </div>
          </div>
          <span className="absolute -left-4 -top-8 font-display text-[96px] font-bold leading-none" style={{ color: m.claro }}>
            404
          </span>
        </div>

        <div className="flex max-w-md flex-col items-center gap-4">
          <h1 className="m-0 text-[clamp(28px,4vw,40px)] leading-tight">Esta página no existe.</h1>
          <p className="m-0 text-lg text-niebla">
            {m.nombreCorto} la estuvo buscando por todo el código y no la encontró. Capaz el link está mal escrito.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Boton tamaño="lg" color={m.clase} onClick={() => navigate('/')}>Volver al inicio</Boton>
          <Boton tamaño="lg" variante="secundario" onClick={() => navigate(-1)}>Página anterior</Boton>
        </div>
      </main>
    </>
  )
}
