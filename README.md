# [Nombre del equipo] — Portfolio Fullstack

Portfolio de equipo para el Trabajo Práctico Integrador de **Lenguajes IV** (Universidad Católica de Salta, 2026).
Una landing compartida del equipo y una página de perfil por integrante, con proyectos y demos que se desbloquean al registrarse y un panel de administración con métricas.

> **Concepto:** *"El detrás de la web"*. Cuatro desarrolladores que salen de adentro del código para presentarse.

**Exposición:** entre el 26 de octubre y el 13 de noviembre de 2026.

---

## Índice

1. [Equipo y roles](#equipo-y-roles)
2. [Stack tecnológico](#stack-tecnológico)
3. [Cómo correr el proyecto](#cómo-correr-el-proyecto)
4. [Cómo trabajamos con Git](#cómo-trabajamos-con-git)
5. [Mapa del sitio y rutas](#mapa-del-sitio-y-rutas)
6. [Niveles de acceso](#niveles-de-acceso)
7. [Modelo de datos (requisitos del front)](#modelo-de-datos-requisitos-del-front)
8. [Sistema de diseño](#sistema-de-diseño)
9. [Animaciones](#animaciones)
10. [Responsive](#responsive)
11. [Pendientes por integrante](#pendientes-por-integrante)
12. [Checklist para promoción](#checklist-para-promoción)

---

## Equipo y roles

| Integrante | Rol | Responsable de | Color |
| --- | --- | --- | --- |
| **Ultronzi modo Bronce** (Gonzi) | Tech Lead & Backend | Base de datos, API REST, auth JWT, envío de emails | 🟩 Lima Mate `#B6D76E` |
| **Ssanty** (Santy) | Lead Frontend | Setup Vite + React, routing, estado global, rutas protegidas, validaciones | 🟦 Turquesa Menta `#6FCDBE` |
| **Rojo** | UI/UX & Animación | Manual de marca, maquetación responsive, animaciones (GSAP, Lottie, CSS) | 🟥 Coral Arcilla `#EE8E80` |
| **Fexx55** (Fexx) | Fullstack & Analytics | Panel admin, CRUD, analytics y gráficos, deploy y CI/CD | 🟪 Azul Bruma `#7C9CE4` |

Cada integrante tiene un **color propio** que lo identifica en todo el sitio: slider del hero, ventana de la sección Equipo, perfil y acentos.

---

## Stack tecnológico

| Capa | Tecnología | Responsable |
| --- | --- | --- |
| Frontend | React + Vite | Ssanty |
| Routing | React Router DOM | Ssanty |
| Framework CSS | **Tailwind CSS** | Rojo / Ssanty |
| Animaciones | GSAP (+ ScrollTrigger), Lottie (`lottie-react`), CSS | Rojo |
| Backend | Node.js + Express | Ultronzi |
| Base de datos | [SQL (PostgreSQL / MySQL) o MongoDB — a definir] | Ultronzi |
| Auth | JWT (+ Google OAuth opcional) | Ultronzi |
| Gráficos | Chart.js / Recharts | Fexx55 |
| Deploy | Vercel (front) + Render (back) | Fexx55 |

---

## Cómo correr el proyecto

Requisitos: Node.js 20 o más nuevo.

```bash
git clone [URL del repo]
cd [carpeta]/client
npm install
npm run dev        # abre http://localhost:5173
```

Por ahora, la app muestra la **guía de estilo**: el hero con el slider, las ventanas de integrantes y todos los componentes base funcionando.

```bash
npm run build      # compila para producción en client/dist
npm run lint       # revisa el código (oxlint)
```

El backend (`server/`) lo suma Ultronzi.

Variables de entorno: copiar `.env.example` a `.env` y completar. **Nunca subir el `.env` al repo.**

### Estructura del frontend

```
client/
├─ index.html                 ← fuentes de Google y metadatos
├─ public/                    ← favicon; acá van las fotos (public/fotos/)
└─ src/
   ├─ index.css               ← tokens del sistema de diseño (@theme)
   ├─ main.jsx                ← monta la app con el ToastProvider
   ├─ App.jsx                 ← por ahora muestra la guía de estilo
   ├─ components/
   │  ├─ ui/                  ← Boton, Campo, Chip, Modal, Spinner/Esqueleto, Toast
   │  └─ animaciones/         ← HeroIntegrantes, VentanaIntegrante, Silueta
   ├─ data/
   │  ├─ integrantes.js       ← nombre, rol, colores, bio, código de cada uno
   │  └─ movimiento.js        ← duraciones y curvas para GSAP
   ├─ hooks/
   │  └─ useMovimientoReducido.js
   └─ pages/
      └─ GuiaDeEstilo.jsx     ← página de muestra (ruta sugerida: /guia)
```

### Cómo usar los componentes

```jsx
import { Boton, Campo, Modal, useToast } from '../components/ui'

<Boton color="ssanty" href="/equipo/ssanty">Ver perfil →</Boton>
<Boton variante="secundario" onClick={cerrar}>Cancelar</Boton>
<Boton type="submit" cargando={enviando}>Ingresar</Boton>

<Campo etiqueta="Email" type="email" value={email}
       onChange={(e) => setEmail(e.target.value)}
       error={valido ? '' : 'Revisá el formato del email.'} />

const { mostrar } = useToast()
mostrar({ tipo: 'exito', titulo: 'Sesión iniciada', mensaje: 'Ya ves todos los proyectos.' })

<Modal abierto={abierto} onCerrar={() => setAbierto(false)} titulo="Esto es para miembros">…</Modal>
```

Cada archivo tiene arriba un comentario con sus opciones.

### Fotos de los integrantes

1. Recortar la foto sin fondo (PNG o WebP, mínimo 1200 px de alto).
2. Guardarla en `client/public/fotos/` (ej: `ssanty.webp`).
3. En `client/src/data/integrantes.js`, cambiar `foto: null` por `foto: '/fotos/ssanty.webp'`.

Mientras sea `null`, se muestra una silueta de reemplazo.

---

## Cómo trabajamos con Git

- `main` es la rama estable: **nadie pushea directo a `main`**.
- Cada uno trabaja en su rama y mergea con **Pull Request**:
  - `feat/design-system` — Rojo
  - `feat/frontend-base` — Ssanty
  - `feat/api` — Ultronzi
  - `feat/admin` — Fexx55
- Commits cortos y en presente: `agrega modal de acceso`, `corrige validación de email`.
- Antes de abrir un PR: `git pull origin main` y resolver conflictos en tu rama.

---

## Mapa del sitio y rutas

| Ruta | Vista | Acceso |
| --- | --- | --- |
| `/` | Home: hero slider, nosotros, ventanas de integrantes, servicios, stack, proyectos, contacto | Pública |
| `/equipo/:nombre` | Perfil individual (una sola plantilla para los 4) | Pública, con más contenido si hay sesión |
| `/ingresar` · `/registro` | Acceso: una pantalla con pestañas Ingresar / Crear cuenta | Pública |
| `/proyectos/:id` | Detalle de proyecto y demo | **Requiere sesión** |
| `/admin` | Panel de administración | **Solo rol admin** |
| `*` | 404 propia | Pública |

### Home, de arriba hacia abajo

1. **Navbar** fija y translúcida.
2. **Hero slider de integrantes:** foto recortada de cada uno que entra deslizándose, nombre gigante detrás y fondo que funde de color en color. Rota sola cada 5 s.
3. **Nosotros:** el equipo en general y contadores animados.
4. **Ventanas de integrantes:** rectángulos inclinados con código corriendo adentro, el color del integrante que sube y su silueta que sobresale del marco. Al lado, bio breve y botón "Ver perfil".
5. **Servicios** (administrables desde el CRUD).
6. **Stack:** cinta de tecnologías en movimiento.
7. **Proyectos:** vista previa; el detalle pide sesión.
8. **Contacto:** formulario con tipo de consulta (general / cotización / asesoría técnica).
9. **Footer.**

---

## Niveles de acceso

Lo público alcanza para conocer al equipo y contactarlo. La cuenta desbloquea la profundidad: todo lo que hizo cada integrante.

| Contenido | Visitante | Usuario registrado | Admin |
| --- | --- | --- | --- |
| Home, equipo, servicios, stack | ✅ | ✅ | ✅ |
| Formulario de contacto | ✅ | ✅ | ✅ |
| Perfil: bio, stack, contacto | ✅ | ✅ | ✅ |
| Perfil: proyectos | Solo los 2 destacados, sin detalle | Todos, con filtros | Todos |
| Detalle de proyecto y demos | ❌ (abre el modal de acceso) | ✅ | ✅ |
| Experiencia | Las 2 más recientes | Completa | Completa |
| Descargar CV | ❌ | ✅ | ✅ |
| Panel `/admin` | ❌ | ❌ | ✅ |

### Comportamiento esperado

- Si alguien **sin sesión** toca algo bloqueado, se abre un **modal de acceso** ("Esto es para miembros") con los botones *Crear cuenta* y *Ya tengo cuenta*. No se redirige directo.
- Al iniciar sesión, el usuario **vuelve a donde estaba** (guardar el origen en `location.state.from`).
- Después del login aparece un toast de "Sesión iniciada".
- **Backend:** los endpoints de detalle de proyecto, demos, experiencia completa y CV devuelven `401` sin token válido. `/admin` y el CRUD devuelven `403` si el rol no es `admin`.

---

## Modelo de datos (requisitos del front)

Lo que el diseño necesita que exista en la base de datos. El esquema final lo define Ultronzi.

**Usuario**
- `nombre`, `email`, `password` (hash), `rol` (`user` | `admin`), `proveedor` (`email` | `google`), `aceptaTerminos`, `creadoEn`

**Integrante**
- `nombre`, `slug` (para `/equipo/:nombre`), `rol`, `color`, `bioCorta`, `bioLarga`, `foto` (PNG recortado), `stack` (tecnología + nivel), `github`, `linkedin`, `cv` (PDF)

**Proyecto**
- `titulo`, `descripcion`, `imagen`, `integrantes` (uno o varios), `tipo` (`Frontend` | `Fullstack`), `tecnologias`, `tieneDemo`, `urlDemo`, `urlRepo`
- **`destacado`** (boolean, máximo 2 por integrante): decide qué ve el visitante en cada perfil.

**Experiencia**
- `integrante`, `fecha`, `titulo`, `descripcion`

**Consulta (formulario de contacto)**
- `nombre`, `email`, `tipo` (`general` | `cotizacion` | `asesoria`), `mensaje`, `estado`, `respuesta`, `creadoEn`

**Eventos para analytics**
- Visitas generales y visitas por perfil (`/equipo/:nombre`)
- Logins exitosos (usuario, fecha, proveedor)
- Origen del registro: desde qué contenido bloqueado llegó (proyecto, demo, CV, "ver todo")

---

## Sistema de diseño

Manual de marca completo: [Manual de Marca](https://claude.ai/code/artifact/f0300d92-28f4-4655-af19-39da736eb9e2)
Mockup interactivo (home, mobile, acceso, perfil): [Mockup](https://claude.ai/artifact/Sz88N4oXwJDKgP48hHweMu)

**Personalidad:** tech, colorida y calma. Pocos colores, en tonos pastel y mate sobre fondo oscuro. La sensación de "vivo" la da el movimiento, no la saturación.

### Paleta

**Neutros**

| Nombre | HEX | Uso |
| --- | --- | --- |
| Tinta | `#161923` | Fondo principal |
| Grafito | `#20242F` | Tarjetas, navbar, paneles |
| Pizarra | `#3A3F52` | Bordes, divisores, inputs |
| Niebla | `#9BA1B3` | Texto secundario |
| Papel | `#EEEBE4` | Texto principal |

**Colores de integrante.** El tono **claro** va en acentos, botones y siluetas; el **profundo**, en fondos grandes.

| Integrante | Nombre | Claro | Profundo |
| --- | --- | --- | --- |
| Fexx55 | Azul Bruma | `#7C9CE4` | `#2C3E66` |
| Ssanty | Turquesa Menta | `#6FCDBE` | `#1F5650` |
| Ultronzi | Lima Mate | `#B6D76E` | `#3F5326` |
| Rojo | Coral Arcilla | `#EE8E80` | `#6A3530` |

**Semánticos:** éxito `#B6D76E` · error `#EE8E80` · info `#7C9CE4` · advertencia `#E6C77E`.

**Reglas**
- Sin negro puro ni blanco puro.
- Sobre botones de color claro, el texto va en Tinta (`#161923`), nunca en blanco.
- El acento general del sitio es Azul Bruma; en el perfil de cada integrante, el acento es su color.
- Gráficos del admin, en este orden: `#7C9CE4`, `#6FCDBE`, `#B6D76E`, `#EE8E80`, `#E6C77E`.
- Todos los textos cumplen contraste WCAG AA o superior.

### Tipografía (Google Fonts)

| Rol | Fuente | Pesos |
| --- | --- | --- |
| Títulos | Space Grotesk | 500, 700 |
| Cuerpo | Inter | 400, 500, 600 |
| Código y etiquetas | JetBrains Mono | 400, 500 |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
```

### Tokens en Tailwind (v4)

Usamos **Tailwind CSS v4**: los tokens no van en `tailwind.config.js`, sino en `client/src/index.css`, dentro de `@theme`. Cada variable genera sus clases solas:

| Variable en `@theme` | Clases que genera |
| --- | --- |
| `--color-tinta`, `--color-papel`, … | `bg-tinta`, `text-papel`, `border-pizarra`… |
| `--color-ssanty`, `--color-ssanty-profundo` | `bg-ssanty`, `text-ssanty`, `bg-ssanty-profundo`… |
| `--color-exito`, `--color-error`, … | `text-exito`, `border-error`… |
| `--font-display`, `--font-mono` | `font-display`, `font-mono` (`font-sans` = Inter, por defecto) |
| `--ease-salida`, `--ease-suave` | `ease-salida`, `ease-suave` |

Ejemplo: `<div className="bg-grafito text-papel font-display">`.

> **Ojo:** Tailwind solo genera las clases que aparecen escritas enteras. No sirve `` `bg-${color}` ``; para eso está `coloresIntegrante` en `client/src/data/integrantes.js`.

### Componentes base (los hace Rojo)

| Componente | Variantes |
| --- | --- |
| Botón | Primario, secundario (borde), fantasma |
| Tarjeta | Servicio, proyecto, proyecto bloqueado, métrica |
| Input | Texto, email, contraseña (con ver/ocultar), select, textarea, archivo con drag & drop |
| Chip | Tecnología, estado de consulta |
| Modal | Acceso, confirmación de borrado |
| Toast | Éxito, error, info, advertencia |
| Loader | Spinner, esqueleto de carga |
| Ventana de integrante | Con silueta, código y color propio |

---

## Animaciones

GSAP para las animaciones principales, Lottie para íconos animados y CSS para hovers. **Solo se anima `transform` y `opacity`**, para mantener 60 fps.

| Token | Valor | Uso |
| --- | --- | --- |
| `--dur-rapida` | 150 ms | Hover, foco |
| `--dur-media` | 300 ms | Modales, toasts, menús |
| `--dur-lenta` | 600 ms | Entrada de secciones con scroll |
| `--dur-escena` | 1200 ms | Cambio de integrante en el hero, siluetas |
| `--ease-salida` | `cubic-bezier(0.22, 1, 0.36, 1)` | Lo que entra (GSAP `expo.out`) |
| `--ease-suave` | `cubic-bezier(0.65, 0, 0.35, 1)` | Cambios de estado y fondo (GSAP `sine.inOut`) |

**Principales**
- **Hero:** la foto sale, el fondo funde al tono profundo del siguiente (`#2C3E66 → #1F5650 → #3F5326 → #6A3530`), entra el nombre y después la foto. Se pausa con el mouse sobre los indicadores o con el foco adentro; en mobile se desliza con el dedo y en desktop se cambia con las flechas del teclado.
- **Ventanas (ScrollTrigger):** el rectángulo se abre con `clip-path`, corre el código, sube el color y emerge la silueta, con la cabeza fuera del marco.
- **Micro-interacciones:** botones con escala, inputs con etiqueta flotante, envío (spinner → check), toasts, modales, contadores, cortina entre páginas y cursor personalizado (solo desktop).

**Accesibilidad:** con `prefers-reduced-motion: reduce` se apaga el autoplay, el parallax, el cursor y el código en movimiento. El contenido nunca depende de una animación para verse.

Dependencias:

Ya instaladas: `gsap`, `@gsap/react` (hook `useGSAP`) y `lottie-react`.

> **Regla con GSAP:** en un elemento que anima GSAP, no usar clases `translate-*` de Tailwind, porque GSAP las pisa. Centrar con `inset-x-0 mx-auto` o con un contenedor flex.

---

## Responsive

Mobile first, con los breakpoints de Tailwind.

| Breakpoint | Ancho | Columnas |
| --- | --- | --- |
| base | < 640 px | 4 |
| `sm` | ≥ 640 px | 8 |
| `md` | ≥ 768 px | 8 |
| `lg` | ≥ 1024 px | 12 |
| `xl` | ≥ 1280 px | 12 (contenido máx. 1280 px) |

- Áreas táctiles de 44 × 44 px como mínimo.
- Todo usable con teclado y foco visible (2 px, Azul Bruma).
- En mobile: menú hamburguesa, ventanas a ancho completo con el texto debajo, y en el admin una barra inferior en lugar de la lateral.

---

## Pendientes por integrante

### Ultronzi (backend)
- [ ] Endpoints públicos vs. protegidos según la [tabla de acceso](#niveles-de-acceso) (`401` sin token, `403` sin rol admin)
- [ ] Campo `destacado` en proyectos, más `tipo`, `tieneDemo` e `integrantes`
- [ ] Experiencia y CV por integrante
- [ ] Registro con validación también del lado del servidor; errores en JSON por campo
- [ ] Guardar logins y origen del registro para analytics
- [ ] (Opcional) Login con Google

### Ssanty (frontend)
- [ ] Revisar el setup inicial de `client/` (Vite + React + Tailwind v4, ya creado) y sumar React Router
- [ ] Rutas de la [tabla de rutas](#mapa-del-sitio-y-rutas), con rutas protegidas
- [ ] Modal de acceso para lo bloqueado y vuelta al origen después del login
- [ ] Perfil como un solo componente con vista según sesión y filtros
- [ ] Validaciones en vivo: email válido, contraseña de mín. 8 caracteres, nombre de mín. 2 letras
- [x] Instalar `gsap`, `@gsap/react` y `lottie-react` (ya están)

### Fexx55 (admin y analytics)
- [ ] Contadores de visitas generales, visitas por perfil y logins
- [ ] Gráficos con la paleta del equipo
- [ ] CRUD de proyectos con los campos de arriba (máximo 2 destacados por integrante)
- [ ] Diseño del panel junto con Rojo
- [ ] Deploy en Vercel y Render

### Rojo (UI/UX)
- [x] Manual de marca
- [x] Mockup de home, mobile, acceso y perfil
- [x] Componentes base en React + Tailwind
- [x] Animaciones del hero y las ventanas con GSAP
- [ ] Diseño del panel admin
- [ ] Auditoría final: paleta, tipografías, 60 fps y responsive

### Todos
- [ ] Foto de cuerpo hasta la cintura (misma luz, mismo encuadre, fondo liso) y versión recortada en PNG/WebP sin fondo, de mínimo 1200 px de alto
- [ ] Bio corta (2 o 3 líneas) y bio larga
- [ ] Stack, experiencia, redes y CV en PDF
- [ ] Elegir sus 2 proyectos destacados
- [ ] Nombre y logo del equipo
- [ ] Confirmar con la cátedra el formato de una página por integrante

---

## Checklist para promoción

- [x] Manual de marca (paleta HEX, tipografía, layouts, responsive, prototipo)
- [ ] Formulario de contacto con envío por email
- [ ] Registración obligatoria para ver proyectos y demos
- [ ] Panel de gestión de consultas con respuesta por email
- [ ] CRUD completo de proyectos, demos y servicios
- [ ] Gestión de usuarios registrados
- [ ] Contador de visitas generales y de usuarios registrados
- [ ] Gráficos interactivos con consultas parametrizadas
- [ ] Animaciones fluidas (GSAP / Lottie / CSS)
- [x] Framework CSS (Tailwind)
- [ ] Validación estricta de campos, archivos e imágenes
- [ ] Deploy en la nube
