import { useState } from 'react'
import { integrantes } from '../data/integrantes'
import { HeroIntegrantes } from '../components/animaciones/HeroIntegrantes'
import { VentanaIntegrante } from '../components/animaciones/VentanaIntegrante'
import { Boton, Campo, Chip, Esqueleto, IconoCandado, Modal, Spinner, useToast } from '../components/ui'
// página de prueba nomás, para ver todo junto - Rojo
const neutros = [
  ['Tinta', '#161923', 'bg-tinta border border-pizarra'],
  ['Grafito', '#20242F', 'bg-grafito'],
  ['Pizarra', '#3A3F52', 'bg-pizarra'],
  ['Niebla', '#9BA1B3', 'bg-niebla'],
  ['Papel', '#EEEBE4', 'bg-papel'],
]

const emailValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

export default function GuiaDeEstilo() {
  const { mostrar } = useToast()
  const [modal, setModal] = useState(false)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [intentado, setIntentado] = useState(false)

  const errorEmail =
    (intentado || email.length > 4) && !emailValido(email) ? 'Revisá el formato del email (ej: nombre@correo.com).' : ''
  const errorPass = intentado && pass.length < 8 ? 'La contraseña necesita al menos 8 caracteres.' : ''

  const enviar = (e) => {
    e.preventDefault()
    setIntentado(true)
    if (!emailValido(email) || pass.length < 8) return
    setEnviando(true)
    setTimeout(() => {
      setEnviando(false)
      mostrar({ tipo: 'exito', titulo: 'Sesión iniciada', mensaje: 'Ya ves todos los proyectos.' })
    }, 1300)
  }

  return (
    <>
      <HeroIntegrantes />

      <main className="mx-auto flex max-w-7xl overflow-x-clip flex-col gap-32 px-4 py-28 sm:px-8 lg:px-12">
        <section id="equipo" aria-labelledby="t-equipo" className="flex flex-col gap-28">
          <div className="flex max-w-2xl flex-col gap-4">
            <span className="etiqueta text-rojo">El detrás de la web</span>
            <h2 id="t-equipo" className="m-0 text-[clamp(28px,3.2vw,44px)] leading-[1.1]">
              Conocé a quienes están del otro lado del código.
            </h2>
          </div>
          {integrantes.map((m, i) => (
            <VentanaIntegrante
              key={m.id}
              integrante={m}
              numero={i + 1}
              inclinacion={[-4, 5, -3, 4][i]}
              invertida={i % 2 === 1}
            />
          ))}
        </section>

        <section aria-labelledby="t-comp" className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <span className="etiqueta text-fexx">Guía de estilo</span>
            <h2 id="t-comp" className="m-0 text-[clamp(28px,3.2vw,44px)] leading-[1.1]">
              Componentes base
            </h2>
          </div>

          <Bloque titulo="Paleta">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {neutros.map(([n, hex, cls]) => (
                <div key={n} className="flex flex-col gap-2">
                  <div className={`h-16 rounded-xl ${cls}`} />
                  <span className="text-sm font-semibold">{n}</span>
                  <span className="font-mono text-xs text-niebla">{hex}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {integrantes.map((m) => (
                <div key={m.id} className="flex flex-col gap-2">
                  <div className="flex h-20 overflow-hidden rounded-xl">
                    <div className="flex flex-1 items-end p-2 font-mono text-xs text-tinta" style={{ background: m.claro }}>{m.claro}</div>
                    <div className="flex flex-1 items-end p-2 font-mono text-xs text-papel" style={{ background: m.profundo }}>{m.profundo}</div>
                  </div>
                  <span className="text-sm font-semibold">{m.nombre}</span>
                </div>
              ))}
            </div>
          </Bloque>

          <Bloque titulo="Botones">
            <div className="flex flex-wrap items-center gap-3">
              <Boton>Primario</Boton>
              <Boton color="ssanty">Ssanty</Boton>
              <Boton color="ultronzi">Ultronzi</Boton>
              <Boton color="rojo">Rojo</Boton>
              <Boton variante="secundario">Secundario</Boton>
              <Boton variante="fantasma">Fantasma</Boton>
              <Boton cargando>Cargando</Boton>
              <Boton tamaño="lg" color="papel">Grande</Boton>
            </div>
          </Bloque>

          <Bloque titulo="Formulario con validación en vivo">
            <form onSubmit={enviar} noValidate className="flex max-w-md flex-col gap-5">
              <Campo
                etiqueta="Email"
                type="email"
                autoComplete="email"
                placeholder="nombre@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errorEmail}
              />
              <Campo
                etiqueta="Contraseña"
                type="password"
                autoComplete="current-password"
                placeholder="Mínimo 8 caracteres"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                error={errorPass}
                extra={<a href="#" className="text-[13px] font-medium text-fexx">¿La olvidaste?</a>}
              />
              <Campo etiqueta="Mensaje" multilinea placeholder="Contanos tu proyecto" ayuda="Máximo 1000 caracteres." />
              <Boton type="submit" tamaño="lg" anchoCompleto cargando={enviando}>
                {enviando ? 'Ingresando…' : 'Ingresar'}
              </Boton>
            </form>
          </Bloque>

          <Bloque titulo="Chips, carga y avisos">
            <div className="flex flex-wrap gap-2">
              <Chip>React</Chip>
              <Chip tono="exito">Respondida</Chip>
              <Chip tono="advertencia">Pendiente</Chip>
              <Chip tono="error">Rechazada</Chip>
              <Chip tono="info">Nueva</Chip>
            </div>
            <div className="flex items-center gap-6">
              <Spinner tamaño={28} className="text-fexx" />
              <div className="flex w-64 flex-col gap-2">
                <Esqueleto className="h-24" />
                <Esqueleto className="h-4 w-3/4" />
                <Esqueleto className="h-4 w-1/2" />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Boton variante="secundario" onClick={() => mostrar({ tipo: 'exito', titulo: 'Mensaje enviado', mensaje: 'Te respondemos por email.' })}>Toast éxito</Boton>
              <Boton variante="secundario" onClick={() => mostrar({ tipo: 'error', titulo: 'No se pudo enviar', mensaje: 'Revisá tu conexión e intentá de nuevo.' })}>Toast error</Boton>
              <Boton variante="secundario" onClick={() => mostrar({ tipo: 'advertencia', titulo: 'Sesión por vencer' })}>Toast advertencia</Boton>
              <Boton color="ssanty" onClick={() => setModal(true)}>Abrir modal de acceso</Boton>
            </div>
          </Bloque>
        </section>
      </main>

      <Modal
        abierto={modal}
        onCerrar={() => setModal(false)}
        titulo="Esto es para miembros"
        icono={
          <span className="flex size-[72px] items-center justify-center rounded-full bg-ssanty/15">
            <IconoCandado />
          </span>
        }
      >
        <p className="m-0 text-base leading-normal text-niebla">
          Con una cuenta gratis ves todos los proyectos, las demos, el recorrido completo y el CV de cada integrante.
        </p>
        <div className="mt-2 flex w-full flex-col gap-2.5">
          <Boton color="ssanty" tamaño="lg" href="/registro">Crear cuenta</Boton>
          <Boton variante="secundario" tamaño="lg" href="/ingresar">Ya tengo cuenta</Boton>
        </div>
      </Modal>
    </>
  )
}

function Bloque({ titulo, children }) {
  return (
    <div className="flex flex-col gap-5 rounded-3xl bg-grafito/50 p-6 sm:p-8">
      <h3 className="m-0 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-niebla">{titulo}</h3>
      {children}
    </div>
  )
}
