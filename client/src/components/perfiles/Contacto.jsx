// links de contacto: mail, llamada y WhatsApp
export function linksContacto(integrante) {
  const { email, telefono, whatsapp } = integrante.contacto
  return {
    email: { texto: email, href: `mailto:${email}` },
    telefono: { texto: telefono, href: `tel:+${whatsapp}` },
    whatsapp: { texto: 'Escribir por WhatsApp', href: `https://wa.me/${whatsapp}` },
  }
}

export function IconoContacto({ tipo, className = '' }) {
  const trazos = {
    email: 'M4 6h16v12H4zM4 7l8 6 8-6',
    telefono: 'M6.5 3h3l1.5 4.5-2 1.5a11 11 0 005.5 5.5l1.5-2L20.5 14v3a2 2 0 01-2 2A15.5 15.5 0 015 5a2 2 0 011.5-2z',
    whatsapp: 'M4 20l1.3-4A8 8 0 1112 20a8 8 0 01-4-1.1L4 20z',
    ciudad: 'M12 21s-6-5.6-6-11a6 6 0 0112 0c0 5.4-6 11-6 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={trazos[tipo]} />
    </svg>
  )
}
