import { useRef, useState } from 'react'
import { api } from '../../data/api'
import { useAparecer } from '../../hooks/useAparecer'
import { Boton, Campo, useToast } from '../ui'
import { Encabezado } from './Encabezado'

const emailValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
const MAX = 1000

// Gonzi: esto manda POST /api/contact con { nombre, email, tipo, mensaje }. Cuando lo tengas avisame - Rojo
export function Contacto() {
  const raiz = useRef(null)
  const { mostrar } = useToast()
  const [datos, setDatos] = useState({ nombre: '', email: '', tipo: 'general', mensaje: '' })
  const [intentado, setIntentado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  useAparecer(raiz)

  const errores = {
    nombre: datos.nombre.trim().length < 2 ? 'Ingresá tu nombre (al menos 2 letras).' : '',
    email: !emailValido(datos.email) ? 'Revisá el formato del email (ej: nombre@correo.com).' : '',
    mensaje:
      datos.mensaje.trim().length < 10
        ? 'Contanos un poco más (al menos 10 caracteres).'
        : datos.mensaje.length > MAX
          ? `Máximo ${MAX} caracteres.`
          : '',
  }
  const mostrarError = (campo) => (intentado || (campo === 'email' && datos.email.length > 4) ? errores[campo] : '')
  const cambiar = (campo) => (e) => setDatos((d) => ({ ...d, [campo]: e.target.value }))

  const enviar = async (e) => {
    e.preventDefault()
    setIntentado(true)
    if (Object.values(errores).some(Boolean)) return
    setEnviando(true)
    try {
      await api('/contact', { method: 'POST', body: datos })
      mostrar({ tipo: 'exito', titulo: 'Mensaje enviado', mensaje: 'Te respondemos por email.' })
      setDatos({ nombre: '', email: '', tipo: 'general', mensaje: '' })
      setIntentado(false)
    } catch {
      mostrar({ tipo: 'error', titulo: 'No se pudo enviar', mensaje: 'Probá de nuevo en un rato.' })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section ref={raiz} id="contacto" aria-labelledby="t-contacto" className="flex flex-wrap gap-14 rounded-[32px] bg-grafito/60 p-6 sm:p-10 lg:p-14">
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-8">
        <Encabezado
          id="t-contacto"
          etiqueta="Contacto"
          color="text-rojo"
          titulo="¿Tenés un proyecto en mente?"
          bajada="Escribinos para una consulta, una cotización o asesoría técnica. Respondemos por email."
        />
        <ul data-aparecer className="m-0 flex list-none flex-col gap-4 p-0">
          <li className="flex items-center gap-3 text-niebla">
            <span className="size-2 rounded-full bg-fexx" />
            Consultas generales
          </li>
          <li className="flex items-center gap-3 text-niebla">
            <span className="size-2 rounded-full bg-ssanty" />
            Cotización de proyectos
          </li>
          <li className="flex items-center gap-3 text-niebla">
            <span className="size-2 rounded-full bg-ultronzi" />
            Asesoría técnica
          </li>
        </ul>
      </div>

      <form data-aparecer onSubmit={enviar} noValidate className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Campo etiqueta="Nombre" autoComplete="name" value={datos.nombre} onChange={cambiar('nombre')} error={mostrarError('nombre')} placeholder="Tu nombre" />
          <Campo etiqueta="Email" type="email" autoComplete="email" value={datos.email} onChange={cambiar('email')} error={mostrarError('email')} placeholder="nombre@correo.com" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contacto-tipo" className="text-sm font-semibold">Tipo de consulta</label>
          <select
            id="contacto-tipo"
            value={datos.tipo}
            onChange={cambiar('tipo')}
            className="min-h-12 w-full cursor-pointer rounded-xl border-[1.5px] border-pizarra bg-grafito px-4 text-base text-papel outline-none focus:border-fexx"
          >
            <option value="general">Consulta general</option>
            <option value="cotizacion">Cotización de proyecto</option>
            <option value="asesoria">Asesoría técnica</option>
          </select>
        </div>

        <Campo
          etiqueta="Mensaje"
          multilinea
          value={datos.mensaje}
          onChange={cambiar('mensaje')}
          error={mostrarError('mensaje')}
          ayuda={`${datos.mensaje.length} / ${MAX}`}
          placeholder="Contanos qué necesitás"
        />

        <Boton type="submit" tamaño="lg" color="rojo" cargando={enviando} className="self-start">
          {enviando ? 'Enviando…' : 'Enviar mensaje'}
        </Boton>
      </form>
    </section>
  )
}
