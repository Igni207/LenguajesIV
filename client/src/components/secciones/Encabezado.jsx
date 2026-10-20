// título de cada sección: etiqueta chiquita arriba, título grande y bajada opcional - Rojo
export function Encabezado({ etiqueta, titulo, bajada, color = 'text-fexx', id }) {
  return (
    <div data-aparecer className="flex max-w-2xl flex-col gap-4">
      <span className={`etiqueta ${color}`}>{etiqueta}</span>
      <h2 id={id} className="m-0 text-[clamp(28px,3.2vw,44px)] leading-[1.1]">
        {titulo}
      </h2>
      {bajada && <p className="m-0 text-lg leading-relaxed text-niebla">{bajada}</p>}
    </div>
  )
}
