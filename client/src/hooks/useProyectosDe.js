import { useEffect, useState } from 'react'
import { api } from '../data/api'

// trae los proyectos de /api/projects y se queda con los del integrante (por alias o nombre) - Rojo
export function useProyectosDe(integrante) {
  const [proyectos, setProyectos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const nombres = [integrante.alias, integrante.nombre, integrante.nombreCorto].map((n) => n.toLowerCase())
    api('/projects')
      .then((data) => setProyectos((Array.isArray(data) ? data : []).filter((p) => nombres.includes((p.autor ?? '').toLowerCase()))))
      .catch(() => setProyectos([]))
      .finally(() => setCargando(false))
  }, [integrante])

  return { proyectos, cargando }
}
