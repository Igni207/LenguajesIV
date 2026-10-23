import { Navbar } from '../layout/Navbar'
import { Footer } from '../layout/Footer'
import { Silueta } from '../animaciones/Silueta'
import { Boton, Chip } from '../ui'
import { IconoContacto, linksContacto } from './Contacto'

// página base para quien todavía no tiene su tema propio - Rojo
export function PerfilSimple({ integrante }) {
  const contacto = linksContacto(integrante)
  const filas = [
    { tipo: 'email', texto: contacto.email.texto, href: contacto.email.href },
    { tipo: 'telefono', texto: contacto.telefono.texto, href: contacto.telefono.href },
    { tipo: 'whatsapp', texto: contacto.whatsapp.texto, href: contacto.whatsapp.href, externo: true },
    { tipo: 'ciudad', texto: integrante.ciudad },
  ]

  return (
    <>
      <Navbar />
      <header style={{ background: integrante.profundo }}>
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-end gap-10 px-4 pt-28 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-12">
          <div className="flex flex-col gap-5 pb-16">
            <span className="etiqueta" style={{ color: integrante.claro }}>{integrante.rol}</span>
            <h1 className="m-0 text-[clamp(40px,6vw,76px)] leading-[0.95]">{integrante.nombre}</h1>
            <p className="m-0 max-w-xl text-lg leading-relaxed text-papel/85">{integrante.bio}</p>
            <div className="flex flex-wrap gap-2">
              {integrante.chips.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              <Boton href={contacto.email.href} color={integrante.clase}>Escribirme</Boton>
              <Boton href={contacto.whatsapp.href} target="_blank" rel="noreferrer" variante="secundario" className="border-papel/40!">WhatsApp</Boton>
            </div>
          </div>
          <div className="relative hidden h-[360px] lg:block">
            <div className="absolute inset-x-0 bottom-0 mx-auto h-[360px] w-[240px]">
              <Silueta integrante={integrante} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-20 sm:px-8 lg:px-12">
        <section aria-labelledby="p-contacto" className="flex flex-col gap-6">
          <h2 id="p-contacto" className="m-0 text-[clamp(28px,3vw,40px)]">Contacto</h2>
          <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
            {filas.map((f) => (
              <li key={f.tipo} className="flex items-center gap-4 rounded-2xl bg-grafito px-5 py-4">
                <span style={{ color: integrante.claro }}>
                  <IconoContacto tipo={f.tipo} />
                </span>
                {f.href ? (
                  <a href={f.href} {...(f.externo ? { target: '_blank', rel: 'noreferrer' } : {})} className="break-all text-papel no-underline hover:underline">
                    {f.texto}
                  </a>
                ) : (
                  <span>{f.texto}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
        {integrante.cv?.educacion && (
          <section aria-labelledby="p-educacion" className="flex flex-col gap-6">
            <h2 id="p-educacion" className="m-0 text-[clamp(28px,3vw,40px)]">Educación</h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {integrante.cv.educacion.map((e) => (
                <li key={e.titulo} className="flex flex-col gap-1 rounded-2xl bg-grafito px-5 py-4 sm:flex-row sm:items-center sm:gap-6">
                  <span className="shrink-0 font-mono text-sm sm:w-40" style={{ color: integrante.claro }}>
                    {e.desde ? `${e.desde} — ${e.hasta}` : e.hasta}
                  </span>
                  <span className="font-semibold">{e.titulo}</span>
                  <span className="text-niebla sm:ml-auto">{e.lugar}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <p className="m-0 rounded-2xl border border-dashed border-pizarra px-6 py-5 text-niebla">
          La página completa de {integrante.nombreCorto} está en construcción.
        </p>
      </main>
      <Footer />
    </>
  )
}
