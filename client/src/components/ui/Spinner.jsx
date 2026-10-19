// Loader circular. Hereda el color del texto (currentColor).
export function Spinner({ tamaño = 18, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 animate-girar rounded-full border-[2.5px] border-current border-t-transparent ${className}`}
      style={{ width: tamaño, height: tamaño }}
    />
  )
}

// Bloque de carga con brillo que recorre (para tarjetas y tablas mientras llegan los datos).
export function Esqueleto({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-brillo rounded-xl bg-[length:200%_100%] bg-gradient-to-r from-grafito via-pizarra to-grafito ${className}`}
    />
  )
}
