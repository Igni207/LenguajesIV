// las fotos recortadas están en public/fotos, ocupan todo el alto y el ancho sale solo - Rojo

export function Silueta({ integrante, className = '' }) {
  if (integrante.foto) {
    return (
      <div className={`relative h-full w-full ${className}`}>
        <img
          src={integrante.foto}
          alt={`Foto de ${integrante.nombre}`}
          className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 select-none"
          draggable="false"
        />
      </div>
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
        [foto {integrante.nombreCorto}]
      </text>
    </svg>
  )
}
