// Foto recortada del integrante. Mientras no haya foto (integrante.foto === null)
// muestra una silueta de reemplazo con el borde de su color.

export function Silueta({ integrante, className = '' }) {
  if (integrante.foto) {
    return (
      <img
        src={integrante.foto}
        alt={`Foto de ${integrante.nombre}`}
        className={`h-full w-full object-contain object-bottom ${className}`}
        draggable="false"
      />
    )
  }

  return (
    <svg
      viewBox="0 0 240 360"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={`Lugar para la foto de ${integrante.nombre}`}
      preserveAspectRatio="xMidYMax meet"
    >
      <path
        d="M8 360 C8 252 58 196 120 196 C182 196 232 252 232 360 Z"
        fill="#20242F"
        stroke={integrante.claro}
        strokeWidth="2.5"
      />
      <rect x="98" y="118" width="44" height="96" rx="12" fill="#20242F" stroke={integrante.claro} strokeWidth="2.5" />
      <path d="M100 196 H140" stroke="#20242F" strokeWidth="6" />
      <circle cx="120" cy="78" r="54" fill="#20242F" stroke={integrante.claro} strokeWidth="2.5" />
      <text x="120" y="300" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#9BA1B3">
        [foto {integrante.nombre}]
      </text>
    </svg>
  )
}
