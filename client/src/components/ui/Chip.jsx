// Etiqueta chica en mono para tecnologías del stack o estados.
// <Chip>React</Chip>   <Chip tono="exito">Respondida</Chip>

const tonos = {
  neutro: 'border-pizarra text-papel',
  exito: 'border-exito/50 text-exito',
  error: 'border-error/50 text-error',
  info: 'border-info/50 text-info',
  advertencia: 'border-advertencia/50 text-advertencia',
}

export function Chip({ tono = 'neutro', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-xs ${tonos[tono]} ${className}`}
    >
      {children}
    </span>
  )
}
