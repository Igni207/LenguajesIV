export function Spinner({ tamaño = 18, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 animate-girar rounded-full border-[2.5px] border-current border-t-transparent ${className}`}
      style={{ width: tamaño, height: tamaño }}
    />
  )
}

// Fexx: esto es para cuando cargan las tablas y gráficos del admin - Rojo
export function Esqueleto({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-brillo rounded-xl bg-[length:200%_100%] bg-gradient-to-r from-grafito via-pizarra to-grafito ${className}`}
    />
  )
}
