// Santy: para llamar al back usá esto, ej: api('/proyectos') o api('/auth/login', { method: 'POST', body: datos })
// Gonzi: todas tus rutas tienen que empezar con /api (Vercel no le saca el /api) - Rojo

export async function api(ruta, { body, token, ...opciones } = {}) {
  const res = await fetch(`/api${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opciones.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const datos = await res.json().catch(() => null)
  if (!res.ok) throw { status: res.status, ...datos }
  return datos
}
