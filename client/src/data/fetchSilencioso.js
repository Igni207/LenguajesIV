// Gonzi, Santy, Fexx: con esto los errores de la API (401, 400, 404...) no aparecen en rojo en la consola del navegador.
// Le pide al back que mande los errores con 200 y vuelve a armar la respuesta con el estado real,
// así res.ok, res.status y los catch siguen funcionando igual que antes. No hace falta tocar nada más - Rojo

const original = window.fetch.bind(window)

window.fetch = async (entrada, opciones = {}) => {
  const url = new URL(typeof entrada === 'string' || entrada instanceof URL ? entrada : entrada.url, window.location.href)
  if (url.origin !== window.location.origin || !url.pathname.startsWith('/api/')) return original(entrada, opciones)

  const headers = new Headers(opciones.headers ?? (entrada instanceof Request ? entrada.headers : undefined))
  headers.set('X-Errores-Silenciosos', '1')
  const res = await original(entrada, { ...opciones, headers })

  const real = Number(res.headers.get('X-Estado-Real'))
  if (!real) return res
  return new Response(res.body, { status: real, headers: res.headers })
}
