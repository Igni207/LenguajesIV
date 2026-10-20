import { Spinner } from './Spinner'

// Santy: variante = primario / secundario / fantasma, color = el de cada uno.
// Si le pasás href se vuelve un link - Rojo
const rellenos = {
  fexx: 'bg-fexx',
  ssanty: 'bg-ssanty',
  ultronzi: 'bg-ultronzi',
  rojo: 'bg-rojo',
  papel: 'bg-papel',
}

const variantes = {
  primario: 'text-tinta',
  secundario: 'border-[1.5px] border-pizarra text-papel hover:border-niebla',
  fantasma: 'text-papel hover:text-fexx',
}

const tamaños = {
  md: 'min-h-11 px-[22px] text-[15px]',
  lg: 'min-h-[52px] px-7 text-base',
}

export function Boton({
  variante = 'primario',
  color = 'fexx',
  tamaño = 'md',
  cargando = false,
  anchoCompleto = false,
  href,
  className = '',
  children,
  disabled,
  type = 'button',
  ...props
}) {
  const clases = [
    'relative inline-flex items-center justify-center gap-2 rounded-full font-semibold no-underline',
    'transition-transform duration-150 ease-salida hover:scale-[1.03] active:scale-[0.98]',
    'disabled:pointer-events-none disabled:opacity-60',
    'cursor-pointer select-none',
    variantes[variante],
    variante === 'primario' ? rellenos[color] : 'bg-transparent',
    tamaños[tamaño],
    anchoCompleto ? 'w-full' : '',
    className,
  ].join(' ')

  const contenido = (
    <>
      {cargando && <Spinner tamaño={16} />}
      {children}
    </>
  )

  if (href) {
    return (
      <a href={href} className={clases} {...props}>
        {contenido}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={clases}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
      {...props}
    >
      {contenido}
    </button>
  )
}
