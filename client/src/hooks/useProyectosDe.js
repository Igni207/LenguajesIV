import { useEffect, useState } from 'react'
import { api } from '../data/api'
import { mezclarConDocs, proyectosDoc } from '../data/documentacion'

// trae los proyectos de /api/projects y se queda con los del integrante (por alias o nombre) - Rojo
// suma los que tienen documentación en data/documentacion.js aunque todavía no estén en la base
export function useProyectosDe(integrante) {
  const [proyectos, setProyectos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const nombres = [integrante.alias, integrante.nombre, integrante.nombreCorto].map((n) => n.toLowerCase())
    api('/projects')
      .then((data) => setProyectos(mezclarConDocs((Array.isArray(data) ? data : []).filter((p) => nombres.includes((p.autor ?? '').toLowerCase())), proyectosDoc(integrante))))
      .catch(() => setProyectos(proyectosDoc(integrante)))
      .finally(() => setCargando(false))
  }, [integrante])

  return { proyectos, cargando }
}
