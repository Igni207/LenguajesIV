import { useId, useState } from 'react'
export function Campo({
  etiqueta,
  error = '',
  ayuda = '',
  type = 'text',
  multilinea = false,
  extra = null,
  className = '',
  id,
  ...props
}) {
  const idAuto = useId()
  const idCampo = id ?? idAuto
  const idMensaje = `${idCampo}-mensaje`
  const [ver, setVer] = useState(false)

  const esPassword = type === 'password'
  const tipoReal = esPassword && ver ? 'text' : type
  const hayError = Boolean(error)

  const clasesInput = [
    'w-full rounded-xl border-[1.5px] bg-grafito px-4 text-base text-papel placeholder:text-niebla/70',
    'outline-none transition-[border-color,box-shadow] duration-150',
    'focus:border-fexx focus:shadow-[0_0_0_3px_rgba(124,156,228,0.25)]',
    hayError ? 'border-error' : 'border-pizarra',
    multilinea ? 'min-h-32 py-3' : 'min-h-12',
    esPassword ? 'pr-24' : '',
  ].join(' ')

  const comunes = {
    id: idCampo,
    className: clasesInput,
    'aria-invalid': hayError || undefined,
    'aria-describedby': hayError || ayuda ? idMensaje : undefined,
    ...props,
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={idCampo} className="text-sm font-semibold text-papel">
          {etiqueta}
        </label>
        {extra}
      </div>

      <div className="relative">
        {multilinea ? <textarea {...comunes} /> : <input type={tipoReal} {...comunes} />}
        {esPassword && (
          <button
            type="button"
            onClick={() => setVer((v) => !v)}
            aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 cursor-pointer rounded-lg px-3 text-[13px] font-semibold text-niebla hover:text-papel"
          >
            {ver ? 'Ocultar' : 'Ver'}
          </button>
        )}
      </div>

      {hayError ? (
        <span id={idMensaje} role="alert" className="animate-entrar text-[13px] text-error">
          {error}
        </span>
      ) : ayuda ? (
        <span id={idMensaje} className="text-[13px] text-niebla">
          {ayuda}
        </span>
      ) : null}
    </div>
  )
}
