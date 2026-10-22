import { integrantes } from '../../data/integrantes'
import { VentanaIntegrante } from '../animaciones/VentanaIntegrante'
import { Encabezado } from './Encabezado'
import { useRef } from 'react'
import { useAparecer } from '../../hooks/useAparecer'

// Santy: cuando esté la ruta /equipo/:slug los botones "Ver perfil" ya apuntan ahí - Rojo
export function Equipo() {
  const raiz = useRef(null)
  useAparecer(raiz)

  return (
    <section ref={raiz} id="equipo" aria-labelledby="t-equipo" className="flex flex-col gap-24 sm:gap-28">
      <Encabezado
        id="t-equipo"
        etiqueta="El detrás de la web"
        color="text-rojo"
        titulo="Conocé a quienes están del otro lado del código."
      />
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
  )
}
