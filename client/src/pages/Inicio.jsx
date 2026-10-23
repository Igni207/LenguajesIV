import { useCallback, useEffect, useState } from 'react'
import { api } from '../data/api'
import { HeroIntegrantes } from '../components/animaciones/HeroIntegrantes'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Nosotros } from '../components/secciones/Nosotros'
import { Equipo } from '../components/secciones/Equipo'
import { Servicios } from '../components/secciones/Servicios'
import { Stack } from '../components/secciones/Stack'
import { Proyectos } from '../components/secciones/Proyectos'
import { Contacto } from '../components/secciones/Contacto'

// la home armada con todas las secciones. Los proyectos se piden una vez acá y se pasan abajo - Rojo
export default function Inicio() {
  const [proyectos, setProyectos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  const pedir = useCallback(() => {
    api('/projects')
      .then((data) => setProyectos(Array.isArray(data) ? data : []))
      .catch(() => setError(true))
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => {
    pedir()
  }, [pedir])

  // si llegan de otra página a /#proyectos, bajamos a esa sección - Rojo
  useEffect(() => {
    if (!window.location.hash) return
    const t = setTimeout(() => document.querySelector(window.location.hash)?.scrollIntoView(), 150)
    return () => clearTimeout(t)
  }, [])

  const reintentar = () => {
    setCargando(true)
    setError(false)
    pedir()
  }

  return (
    <>
      <Navbar />
      <div id="inicio">
        <HeroIntegrantes />
      </div>
      <main className="mx-auto flex max-w-7xl flex-col gap-32 overflow-x-clip px-4 py-28 sm:gap-40 sm:px-8 lg:px-12">
        <Nosotros cantidadProyectos={proyectos?.length} />
        <Equipo />
        <Servicios />
      </main>
      <Stack />
      <div className="mx-auto flex max-w-7xl flex-col gap-32 overflow-x-clip px-4 py-28 sm:gap-40 sm:px-8 lg:px-12">
        <Proyectos proyectos={proyectos} cargando={cargando} error={error} reintentar={reintentar} />
        <Contacto />
      </div>
      <Footer />
    </>
  )
}
