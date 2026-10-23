import { useParams } from 'react-router-dom'
import { integrantes } from '../data/integrantes'
import { PerfilBaseDeDatos } from '../components/perfiles/PerfilBaseDeDatos'
import { PerfilSimple } from '../components/perfiles/PerfilSimple'
import NoEncontrada from './NoEncontrada'

// /equipo/:slug — cada integrante puede tener su propio tema de página - Rojo
const temas = {
  'base-de-datos': PerfilBaseDeDatos,
}

export default function PerfilIntegrante() {
  const { slug } = useParams()
  const integrante = integrantes.find((m) => m.slug === slug)
  if (!integrante) return <NoEncontrada />

  const Pagina = temas[integrante.tema] ?? PerfilSimple
  return <Pagina integrante={integrante} />
}
