import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProyectosDe } from '../../hooks/useProyectosDe'
import { Boton, IconoCandado, Modal, useToast } from '../ui'
import { linksContacto } from './Contacto'

// lo que comparten todas las páginas de integrante: qué se ve con y sin sesión, el modal y los avisos - Rojo
export function usePerfil(integrante) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { mostrar } = useToast()
  const { proyectos, cargando } = useProyectosDe(integrante)
  const [modal, setModal] = useState(false)

  const cv = integrante.cv
  const experiencia = isAuthenticated ? cv.experiencia : cv.experiencia.slice(0, 2)
  const proyVisibles = isAuthenticated ? proyectos : proyectos.filter((p) => p.destacado).slice(0, 2)

  return {
    cv,
    isAuthenticated,
    contacto: linksContacto(integrante),
    experiencia,
    expOcultas: cv.experiencia.length - experiencia.length,
    proyectos,
    proyVisibles,
    proyOcultos: proyectos.length - proyVisibles.length,
    cargando,
    modal,
    cerrarModal: () => setModal(false),
    pedirSesion: () => setModal(true),
    irALogin: () => {
      setModal(false)
      navigate('/login', { state: { from: location } })
    },
    descargarCv: () =>
      isAuthenticated
        ? mostrar({ tipo: 'info', titulo: 'CV en camino', mensaje: 'El PDF todavía no está cargado.' })
        : setModal(true),
    verDetalle: () =>
      isAuthenticated
        ? mostrar({ tipo: 'info', titulo: 'Próximamente', mensaje: 'El detalle de cada proyecto está en camino.' })
        : setModal(true),
  }
}

export function ModalMiembros({ perfil, integrante }) {
  return (
    <Modal
      abierto={perfil.modal}
      onCerrar={perfil.cerrarModal}
      titulo="Esto es para miembros"
      icono={
        <span className="flex size-[72px] items-center justify-center rounded-full" style={{ background: `${integrante.claro}26`, color: integrante.claro }}>
          <IconoCandado className="" />
        </span>
      }
    >
      <p className="m-0 leading-normal text-niebla">Con una cuenta gratis ves la experiencia completa, todos los proyectos y el CV para descargar.</p>
      <div className="mt-2 flex w-full flex-col gap-2.5">
        <Boton color={integrante.clase} tamaño="lg" onClick={perfil.irALogin}>Crear cuenta</Boton>
        <Boton variante="secundario" tamaño="lg" onClick={perfil.irALogin}>Ya tengo cuenta</Boton>
      </div>
    </Modal>
  )
}

// período lindo: "2024 — 2025" o solo "2023" (si arranca y termina el mismo año también va solo)
export const periodo = (e) => (e.desde && e.desde !== e.hasta ? `${e.desde} — ${e.hasta}` : e.hasta)

// año numérico para ubicar cosas en una línea de tiempo ("Actualidad" = este año, "Inicios de 2025" = 2025.2, "Fines de 2025" = 2025.8, "Octubre de 2026" = 2026.75)
const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export function anio(texto) {
  if (/actualidad|en curso/i.test(texto)) return new Date().getFullYear() + (new Date().getMonth() + 1) / 12
  const n = Number((texto.match(/\d{4}/) ?? [])[0])
  if (/inicios/i.test(texto)) return n + 0.2
  if (/fines/i.test(texto)) return n + 0.8
  const mes = meses.findIndex((m) => new RegExp(m, 'i').test(texto))
  if (mes >= 0) return n + mes / 12
  return n
}
