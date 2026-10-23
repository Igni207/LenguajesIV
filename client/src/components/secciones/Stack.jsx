const fila1 = ['React', 'Vite', 'Tailwind CSS', 'GSAP', 'Lottie', 'React Router', 'Recharts']
const fila2 = ['Node.js', 'Express', 'PostgreSQL', 'Supabase', 'JWT', 'Git', 'Vercel']
const colores = ['#7C9CE4', '#C29FE6', '#B6D76E', '#EE8E80']

// cinta que se mueve sola, se frena con el mouse encima. La lista está duplicada para que el bucle no se corte - Rojo
function Cinta({ items, reversa }) {
  const lista = [...items, ...items]
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <ul
        className={`m-0 flex w-max shrink-0 list-none gap-3 p-0 pr-3 hover:[animation-play-state:paused] ${
          reversa ? 'animate-cinta-reversa' : 'animate-cinta'
        }`}
      >
        {lista.map((t, i) => (
          <li
            key={i}
            aria-hidden={i >= items.length}
            className="flex items-center gap-3 whitespace-nowrap rounded-full border border-pizarra px-5 py-3 font-mono text-[15px]"
          >
            <span className="size-2 rounded-full" style={{ background: colores[i % colores.length] }} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Stack() {
  return (
    <section aria-label="Tecnologías que usamos" className="flex flex-col gap-3">
      <Cinta items={fila1} />
      <Cinta items={fila2} reversa />
    </section>
  )
}
