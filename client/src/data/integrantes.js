// Datos de los integrantes. Lo que está entre [corchetes] lo completa cada uno.
// Más adelante esto vendrá de la API (GET /api/integrantes); por ahora es local.
//
// foto: ruta a un PNG/WebP recortado SIN fondo (ej: '/fotos/ssanty.webp',
// guardado en client/public/fotos/). Mientras sea null se muestra una silueta.

export const integrantes = [
  {
    id: 'fexx',
    slug: 'fexx55',
    nombre: 'Fexx55',
    nombreHero: 'FEXX',
    rol: 'Fullstack & Analytics',
    clase: 'fexx', // nombre del color en Tailwind (bg-fexx, bg-fexx-profundo…)
    claro: '#7C9CE4',
    profundo: '#2C3E66',
    bio: '[Bio breve de Fexx: 2 o 3 líneas sobre qué hace y qué le gusta construir.]',
    chips: ['Dashboards', 'Chart.js', 'CI/CD'],
    foto: null,
    codigo: [
      "const visitas = await api.get('/metrics');",
      'chart.render(visitas.porDia);',
      'contador.animate(visitas.total);',
      "deploy('vercel', { ci: true });",
      "const usuarios = db.count('users');",
      'panel.update(usuarios);',
    ],
  },
  {
    id: 'ssanty',
    slug: 'ssanty',
    nombre: 'Ssanty',
    nombreHero: 'SSANTY',
    rol: 'Lead Frontend',
    clase: 'ssanty',
    claro: '#6FCDBE',
    profundo: '#1F5650',
    bio: '[Bio breve de Ssanty: 2 o 3 líneas sobre qué hace y qué le gusta construir.]',
    chips: ['React', 'React Router', 'Vite'],
    foto: null,
    codigo: [
      'export default function App() {',
      '  const [user, setUser] = useState(null);',
      '  return (',
      '    <BrowserRouter>',
      '      <Route path="/" element={<Home />} />',
      '    </BrowserRouter>',
      '  );',
      '}',
    ],
  },
  {
    id: 'ultronzi',
    slug: 'ultronzi',
    nombre: 'Ultronzi',
    nombreHero: 'ULTRONZI',
    rol: 'Tech Lead & Backend',
    clase: 'ultronzi',
    claro: '#B6D76E',
    profundo: '#3F5326',
    bio: '[Bio breve de Ultronzi: 2 o 3 líneas sobre qué hace y qué le gusta construir.]',
    chips: ['Node + Express', 'JWT', 'SQL'],
    foto: null,
    codigo: [
      "app.post('/api/auth/login', async (req, res) => {",
      '  const user = await db.users.find(req.body.email);',
      '  const token = jwt.sign({ id: user.id }, SECRET);',
      '  res.json({ token });',
      '});',
      "app.post('/api/contact', sendMail);",
    ],
  },
  {
    id: 'rojo',
    slug: 'rojo',
    nombre: 'Rojo',
    nombreHero: 'ROJO',
    rol: 'UI/UX & Animación',
    clase: 'rojo',
    claro: '#EE8E80',
    profundo: '#6A3530',
    bio: '[Bio breve de Rojo: 2 o 3 líneas sobre qué hace y qué le gusta construir.]',
    chips: ['GSAP', 'Lottie', 'Tailwind'],
    foto: null,
    codigo: [
      "gsap.from('.silueta', {",
      '  yPercent: 100,',
      '  duration: 1.2,',
      "  ease: 'expo.out',",
      "  scrollTrigger: '.ventana',",
      '});',
      "lottie.play('check');",
    ],
  },
]

// Clases completas por color. Tailwind solo genera clases que aparecen
// escritas enteras en el código, así que no se pueden armar con `bg-${x}`.
export const coloresIntegrante = {
  fexx: { bg: 'bg-fexx', text: 'text-fexx', border: 'border-fexx', bgProfundo: 'bg-fexx-profundo' },
  ssanty: { bg: 'bg-ssanty', text: 'text-ssanty', border: 'border-ssanty', bgProfundo: 'bg-ssanty-profundo' },
  ultronzi: { bg: 'bg-ultronzi', text: 'text-ultronzi', border: 'border-ultronzi', bgProfundo: 'bg-ultronzi-profundo' },
  rojo: { bg: 'bg-rojo', text: 'text-rojo', border: 'border-rojo', bgProfundo: 'bg-rojo-profundo' },
}
