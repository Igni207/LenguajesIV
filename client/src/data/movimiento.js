// Tokens de movimiento del Manual de Marca, para usar con GSAP.
// (Los mismos valores están en CSS como --dur-* y ease-salida / ease-suave.)

export const DURACION = {
  rapida: 0.15, // hover, foco
  media: 0.3, // modales, toasts, menús
  lenta: 0.6, // entrada de secciones con scroll
  escena: 1.2, // cambio de integrante en el hero, siluetas
}

export const EASE = {
  salida: 'expo.out', // lo que entra en pantalla
  suave: 'sine.inOut', // cambios de estado y de color de fondo
}
