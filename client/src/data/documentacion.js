// documentación de cada proyecto: se engancha con el proyecto de la base por el título - Rojo
// Fexx: si cargás un proyecto con alguno de estos nombres en el panel, su detalle sale de acá

const LUNA = '/proyectos/luna-llena'
const BFC = '/proyectos/bfc'

export const documentacion = [
  {
    slug: 'gts',
    coincide: /orc slayer(?!: luna)|\bgts\b/i,
    titulo: 'Gonzi The Orc Slayer',
    tipo: 'Videojuego',
    autor: 'Equipo',
    autores: ['Juan', 'Ezequiel', 'Santiago', 'Gonzalo'],
    otros: ['Alzogaray', 'López'],
    periodo: 'Octubre de 2024',
    contexto: 'Proyecto de equipo · primer año',
    rol: 'Primer proyecto en equipo de la carrera',
    bajada:
      'El juego con el que empezamos: un shooter de oleadas en pixel art hecho en Python y Pygame por seis compañeros de primer año, en cinco días y trabajando con ramas y pull requests en GitHub.',
    tema: 'mazmorra',
    destacado: true,
    descripcion: 'Nuestro primer proyecto en equipo: un juego de oleadas en Python y Pygame, hecho entre seis en cinco días.',
    portada: '/proyectos/gts/portada.webp',
    tecnologias: ['Python', 'Pygame', 'Git', 'GitHub'],
    cifras: [
      { valor: '6', texto: 'desarrolladores' },
      { valor: '5 días', texto: 'de desarrollo' },
      { valor: '127', texto: 'commits' },
      { valor: '25', texto: 'ramas' },
    ],
    capturas: [
      { src: '/proyectos/gts/menu.webp', titulo: 'Menú principal con control de volumen' },
      { src: '/proyectos/gts/oleada.webp', titulo: 'Primera oleada: los orcos entran por los bordes' },
      { src: '/proyectos/gts/portada.webp', titulo: 'Combate con arco en la mazmorra' },
      { src: '/proyectos/gts/combate.webp', titulo: 'Corazones, oleada y monedas en pantalla' },
      { src: '/proyectos/gts/monedas.webp', titulo: 'Monedas que sueltan los enemigos' },
      { src: '/proyectos/gts/victoria.webp', titulo: 'Pantalla de victoria con los créditos' },
      { src: '/proyectos/gts/game-over.webp', titulo: 'Game over' },
    ],
    ficha: [
      ['Lenguaje', 'Python 3'],
      ['Librería', 'Pygame'],
      ['Resolución', '1024 × 768 a 60 FPS'],
      ['Arte', 'Tiny RPG Character Asset Pack (sprites de terceros) y mapa propio con colisiones'],
      ['Sonido', 'Música de menú, combate, victoria y game over'],
      ['Trabajo en equipo', 'Git y GitHub con ramas por funcionalidad y pull requests'],
    ],
    roadmap: [
      { estado: 'hecho', etiqueta: '25 de octubre', titulo: 'Base y reglas de trabajo', detalle: 'Repositorio, estructura inicial y un README con cómo subir cambios sin pisarnos.' },
      { estado: 'hecho', etiqueta: '26 de octubre', titulo: 'Enemigos, vida y pantallas', detalle: 'Tres tipos de orcos, oleadas desde los bordes, barra de corazones, menú, música y game over.' },
      { estado: 'hecho', etiqueta: '27 de octubre', titulo: 'Mapa, ataque y versiones alfa', detalle: 'Mazmorra con colisiones, disparo de flechas con el mouse y las primeras versiones jugables.' },
      { estado: 'hecho', etiqueta: '28 de octubre', titulo: 'Ítems y oleadas', detalle: 'Monedas y pociones de curación, descanso entre oleadas y un minijefe preparado.' },
      { estado: 'hecho', etiqueta: '29 de octubre', titulo: 'Integración final', detalle: 'Todas las ramas juntas, condición de victoria y pantalla de créditos.' },
      { estado: 'hecho', etiqueta: '2026', titulo: 'La secuela', detalle: 'Gonzi The Orc Slayer: Luna Llena retoma la idea y la lleva mucho más lejos.' },
    ],
    secciones: [
      {
        titulo: 'De qué se trata',
        parrafos: ['El jugador defiende una mazmorra de oleadas de orcos que entran por los cuatro bordes. Cada oleada trae más enemigos que la anterior, con un descanso corto entre una y otra.'],
        lista: [
          'Tres tipos de orco: normal, rápido y pesado, cada uno con su velocidad y su vida.',
          'Movimiento con WASD y disparo de flechas hacia el mouse, con tiempo de recarga.',
          'Cinco corazones y un segundo y medio de invulnerabilidad después de cada golpe.',
          'Los enemigos sueltan monedas y pociones de curación; con diez monedas se gana la partida.',
          'Menú principal con control de volumen, pantalla de victoria con créditos y game over.',
        ],
      },
      {
        titulo: 'Cómo trabajamos',
        parrafos: ['Fue la primera vez que usamos Git en equipo. Cada funcionalidad se hizo en su propia rama y se sumó al proyecto con un pull request, siguiendo las reglas que dejamos escritas en el README desde el primer día.'],
        lista: [
          '25 ramas y 127 commits en cinco días.',
          'Versiones alfa numeradas para probar el juego entero antes de seguir sumando cosas.',
          'Comentarios en el código para que el resto entendiera qué había cambiado.',
        ],
      },
      {
        titulo: 'Quién hizo qué',
        lista: [
          'Juan Ignacio Quinteros Navarro: base del proyecto y reglas de trabajo, interfaz (menú, volumen, corazones, contadores, pantallas de victoria y game over), música e integración final.',
          'Ezequiel Silvera Sandoval: movimiento y ataque del jugador, enemigos, monedas al derrotarlos y condición de victoria.',
          'Santiago Daniel Chocobar: mapa de la mazmorra y sus colisiones.',
          'Gonzalo Nahuel Luna: ítems, monedas y pociones de curación.',
          'Alzogaray: enemigos y sus colisiones, ataque y versiones alfa.',
          'López: oleadas, escenarios, minijefe y descanso entre oleadas.',
        ],
      },
      {
        titulo: 'Arquitectura',
        parrafos: ['Un bucle principal en main.py maneja cuatro estados: menú, juego, victoria y game over. El resto está separado en módulos chicos.'],
        lista: [
          'jugador.py y proyectil.py: el personaje y las flechas, que rotan según la dirección del disparo.',
          'estructure_enemy.py y type_enemy.py: una clase base de enemigo y los tipos que heredan de ella.',
          'control_oleada.py: dónde y qué enemigo aparece en cada oleada.',
          'items.py e interfaz.py: monedas, pociones, corazones y contadores.',
          'constantes.py: tamaño de la ventana y las cajas de colisión del mapa.',
        ],
      },
    ],
  },
  {
    slug: 'luna-llena',
    coincide: /luna llena/i,
    titulo: 'Gonzi The Orc Slayer: Luna Llena',
    tipo: 'Videojuego',
    autor: 'Juan',
    periodo: 'Inicios de 2026 — Actualidad',
    contexto: 'Proyecto personal',
    rol: 'Desarrollo completo: diseño de juego, programación y arte',
    bajada:
      'Juego de supervivencia por oleadas en pixel art, desarrollado de punta a punta en Python. Corre en la PC y en el navegador, con teclado, joystick o pantalla táctil.',
    tema: 'luna',
    destacado: true,
    descripcion: 'Juego de supervivencia por oleadas en pixel art, hecho en Python. Se puede jugar en el navegador.',
    portada: `${LUNA}/portada.webp`,
    tecnologias: ['Python', 'Pygame', 'pygbag', 'WebAssembly'],
    cifras: [
      { valor: '24.000', texto: 'líneas de Python' },
      { valor: '59', texto: 'tipos de enemigos' },
      { valor: '18', texto: 'armas con evolución' },
      { valor: '31', texto: 'logros' },
    ],
    demo: {
      src: '/demos/luna-llena/index.html',
      aviso: 'La primera vez tarda unos segundos: el navegador descarga Python. Después queda en caché.',
      controles: [
        ['Moverse', 'WASD o flechas'],
        ['Esquivar', 'Espacio'],
        ['Pausa', 'Esc'],
        ['Joystick', 'Xbox o PlayStation, se detecta solo'],
        ['Celular', 'Girarlo y deslizar el dedo para moverse'],
      ],
      nota: 'En esta demo el progreso se guarda en tu navegador.',
    },
    capturas: [
      { src: `${LUNA}/menu.webp`, titulo: 'Menú principal' },
      { src: `${LUNA}/personajes.webp`, titulo: 'Elección de personaje' },
      { src: `${LUNA}/armas.webp`, titulo: 'Arsenal: 18 armas' },
      { src: `${LUNA}/bosque.webp`, titulo: 'Bosque Lunar, primeras oleadas' },
      { src: `${LUNA}/mejoras.webp`, titulo: 'Subida de nivel y mejoras' },
      { src: `${LUNA}/jefe.webp`, titulo: 'Jefe: el Orco Rojo' },
      { src: `${LUNA}/luna-llena.webp`, titulo: 'Evento de Luna Llena' },
      { src: `${LUNA}/horda-dorada.webp`, titulo: 'Horda Dorada' },
      { src: `${LUNA}/montana.webp`, titulo: 'Paso de la Montaña, oleada 41' },
      { src: `${LUNA}/altar.webp`, titulo: 'Altar de la Luna: mejoras permanentes' },
      { src: `${LUNA}/logros.webp`, titulo: 'Récords y logros' },
    ],
    ficha: [
      ['Lenguaje', 'Python 3'],
      ['Motor', 'Pygame'],
      ['Versión web', 'pygbag (Python compilado a WebAssembly)'],
      ['Resolución', '1280 × 720 a 60 FPS'],
      ['Plataformas', 'Windows y navegador (PC y celular)'],
      ['Controles', 'Teclado, joystick y táctil'],
      ['Arte', 'Pixel art generado por código'],
      ['Guardado', 'Local o sincronizado con una cuenta web'],
    ],
    roadmap: [
      { estado: 'hecho', etiqueta: 'v0 — v1.4', titulo: 'La base del juego', detalle: 'Oleadas, subida de nivel con mejoras, hechizos y el Orco Rojo como primer jefe.' },
      { estado: 'hecho', etiqueta: 'v1.5 — v1.6', titulo: 'Mundo infinito', detalle: 'Mapa generado por partes, obstáculos con colisión y zonas con enemigos propios.' },
      { estado: 'hecho', etiqueta: 'v1.8 — v1.9', titulo: 'Eventos y evoluciones', detalle: 'Estampidas con aviso, evoluciones de armas con cinemática y los Círculos del Infierno.' },
      { estado: 'hecho', etiqueta: 'v2.0 — v2.1', titulo: 'Progresión permanente', detalle: 'Modo Prueba para el balance, cromos coleccionables y el Altar de la Luna.' },
      { estado: 'hecho', etiqueta: 'v2.2 — v2.4', titulo: 'Versión web', detalle: 'El juego corre en el navegador, con cuenta sincronizada, controles táctiles y joystick.' },
      { estado: 'hecho', etiqueta: 'v2.5 — v3.0', titulo: 'El Rival y el arsenal completo', detalle: 'Un jefe que habla y pelea como el jugador, tienda de cromos, recuperación ante errores y 18 armas.' },
      { estado: 'en-curso', etiqueta: 'Ahora', titulo: 'Balance con jugadores reales', detalle: 'Ajustes de daño, vida y aparición de enemigos a partir de las partidas de los jugadores.' },
    ],
    secciones: [
      {
        titulo: 'De qué se trata',
        parrafos: [
          'El jugador elige uno de cuatro personajes y un arma inicial, y sobrevive a oleadas cada vez más grandes de orcos y goblins. Con la experiencia sube de nivel y elige mejoras entre tres cartas, con la opción de rehacer o descartar.',
        ],
        lista: [
          'Cada 5 oleadas llega la Luna Llena: más enemigos, más rápidos y un orco propio del evento.',
          'Cada 20 oleadas aparece un jefe; además hay Hombres Lobo, estampidas y Hordas Doradas.',
          'Cuatro zonas que cambian el mapa y los enemigos: Bosque Lunar, Ruinas Olvidadas, Pantano Brumoso y Paso de la Montaña.',
          'Desde la oleada 40 empiezan los Círculos del Infierno, con versiones más fuertes de cada enemigo.',
        ],
      },
      {
        titulo: 'Progresión',
        parrafos: [
          'Además de cada partida, hay una progresión que se mantiene entre partidas para que siempre haya un objetivo.',
        ],
        lista: [
          'Piedras Lunares para comprar 11 mejoras permanentes en el Altar de la Luna.',
          '113 cromos coleccionables que salen de los Cofres Lunares, con rareza, acabado y color.',
          '31 logros, récord por partida y un modo difícil, la Luna Roja, que se desbloquea en la oleada 40.',
          'Cada arma tiene su evolución: 18 en total, con su propia cinemática.',
        ],
      },
      {
        titulo: 'Arquitectura',
        parrafos: [
          'El código está separado por responsabilidad. Una máquina de estados ordena los menús, la partida, la pausa, la subida de nivel y las cinemáticas, y cada estado tiene su propia lógica y su propio dibujo.',
        ],
        lista: [
          'core: el bucle principal y los estados del juego.',
          'entities: jugador, enemigos, jefes, proyectiles y efectos.',
          'systems: oleadas, mundo, mejoras, hechizos, logros, guardado y conexión con la web.',
          'gfx: el pixel art y la animación de cada sprite.',
          'ui: HUD, menús, diálogos y controles táctiles.',
        ],
      },
      {
        titulo: 'Decisiones técnicas',
        lista: [
          'Todo el pixel art está escrito en código: cada sprite es una grilla de texto donde cada letra es un color. No hay archivos de imagen que mantener.',
          'El mundo es infinito y se genera por partes. Una grilla espacial hace que cada enemigo revise solo los obstáculos cercanos, aunque haya cientos en pantalla.',
          'El bucle es asíncrono, así el mismo código corre igual en la PC y en el navegador.',
          'En la web, si un error se repite, la partida se cierra y vuelve al menú en vez de congelarse, y el error queda registrado para corregirlo.',
          'Hay un tope de efectos visuales simultáneos para que el rendimiento no caiga en las oleadas grandes.',
        ],
      },
      {
        titulo: 'Integración web',
        parrafos: [
          'La versión web corre dentro de una página y se comunica con ella por almacenamiento local: la página le pasa la sesión y los récords, y el juego le devuelve el progreso en una cola numerada que se confirma cuando se guarda en la base de datos. Así no se pierde nada aunque se recargue la página a mitad de camino.',
        ],
      },
    ],
  },
  {
    slug: 'bfc',
    coincide: /based fighting cup|\bbfc\b/i,
    titulo: 'Based Fighting Cup',
    tipo: 'Web',
    autor: 'Juan',
    periodo: 'Inicios de 2026 — Actualidad',
    contexto: 'Proyecto personal',
    rol: 'Diseño y desarrollo completo',
    bajada:
      'Plataforma web de un torneo de videojuegos: ediciones, llaves, pronósticos, estadísticas en tiempo real y una sección de juegos para jugar en el navegador con tu cuenta.',
    tema: 'ring',
    destacado: true,
    descripcion: 'Plataforma web de un torneo de videojuegos, con llaves, pronósticos y tablas en tiempo real.',
    portada: `${BFC}/portada.webp`,
    tecnologias: ['HTML', 'CSS', 'JavaScript', 'Firebase Auth', 'Cloud Firestore', 'PWA'],
    cifras: [
      { valor: '30.000', texto: 'líneas de JavaScript' },
      { valor: '15', texto: 'páginas' },
      { valor: '5', texto: 'juegos propios' },
      { valor: 'En vivo', texto: 'tablas y llaves' },
    ],
    capturas: [
      { src: `${BFC}/portada.webp`, titulo: 'Inicio' },
      { src: `${BFC}/edicion.webp`, titulo: 'Página de la edición' },
      { src: `${BFC}/fecha.webp`, titulo: 'Sede, horario y cuenta regresiva' },
      { src: `${BFC}/juegos-torneo.webp`, titulo: 'Juegos del torneo y reglamento' },
      { src: `${BFC}/prode.webp`, titulo: 'Prode: pronósticos de cada cruce' },
      { src: `${BFC}/tabla-historica.webp`, titulo: 'Tabla histórica' },
      { src: `${BFC}/logros.webp`, titulo: 'Logros de los jugadores' },
      { src: `${BFC}/archivo.webp`, titulo: 'Archivo de ediciones' },
      { src: `${BFC}/arcade.webp`, titulo: 'Sección de juegos' },
      { src: `${BFC}/hax.webp`, titulo: 'Hax BFC: fútbol online' },
      { src: `${BFC}/party.webp`, titulo: 'Party BFC: salas por código' },
      { src: `${BFC}/defensas.webp`, titulo: 'Las Defensas de Terrenia' },
      { src: `${BFC}/la-cima.webp`, titulo: 'La Cima: roguelite de cartas' },
    ],
    ficha: [
      ['Frontend', 'HTML, CSS y JavaScript, sin frameworks'],
      ['Usuarios', 'Firebase Authentication'],
      ['Base de datos', 'Cloud Firestore, sincronizada en tiempo real'],
      ['Seguridad', 'Reglas de acceso propias en Firestore'],
      ['Instalable', 'PWA con manifest y service worker'],
      ['Respaldo', 'Archivo JSON de cada edición finalizada'],
    ],
    roadmap: [
      { estado: 'hecho', etiqueta: 'Ediciones 1 y 2', titulo: 'El sitio del torneo', detalle: 'Jugadores, tablas por edición, tabla histórica, salón de la fama y archivo de ediciones.' },
      { estado: 'hecho', etiqueta: 'Cuentas', titulo: 'Usuarios y tiempo real', detalle: 'Inicio de sesión, perfiles y sincronización en vivo con Firestore, con reglas de acceso propias.' },
      { estado: 'hecho', etiqueta: 'Arcade', titulo: 'Juegos en el navegador', detalle: 'Luna Llena integrado a la cuenta, tienda de cromos, Hax BFC y Las Defensas de Terrenia.' },
      { estado: 'hecho', etiqueta: 'Octubre 2026', titulo: 'Tercera Edición y Party BFC', detalle: 'Cronograma con cuenta regresiva, juegos confirmados, llaves, prode y un juego grupal para el celular.' },
      { estado: 'en-curso', etiqueta: 'Beta', titulo: 'La Cima', detalle: 'Roguelite de cartas: quince noches subiendo una montaña contra rivales cada vez más difíciles.' },
      { estado: 'futuro', etiqueta: '23 de diciembre', titulo: 'Tercera Edición en vivo', detalle: 'Llaves, prode y tablas actualizándose durante el torneo, y el cierre con el archivo de la edición.' },
    ],
    secciones: [
      {
        titulo: 'El torneo',
        parrafos: [
          'El sitio organiza cada edición del torneo de principio a fin y guarda la historia de las anteriores.',
        ],
        lista: [
          'Cronograma con sede, horarios y cuenta regresiva.',
          'Juegos confirmados, cada uno con su formato, rondas y sistema de puntos.',
          'Llaves por juego que se actualizan en vivo y un prode para pronosticar cada cruce.',
          'Tabla de la edición, tabla histórica, salón de la fama y logros por jugador.',
          'Archivo de ediciones: al finalizar una, se guarda un respaldo completo que el sitio puede leer aunque no haya conexión con la base.',
        ],
      },
      {
        titulo: 'Cuentas y tiempo real',
        lista: [
          'Inicio de sesión y perfil propio para cada usuario.',
          'Las tablas y las llaves se sincronizan entre todos los navegadores abiertos.',
          'Si no hay conexión con la base, el sitio sigue funcionando en modo local.',
          'Se puede instalar en el celular como una app.',
        ],
      },
      {
        titulo: 'Juegos en el navegador',
        lista: [
          'Hax BFC: fútbol con físicas, partidas online con salas por código, ligas, torneos y bots.',
          'Party BFC: juego grupal multijugador que se juega desde el celular.',
          'Las Defensas de Terrenia: tower defense con progresión entre partidas.',
          'La Cima: roguelite de cartas.',
          'Gonzi The Orc Slayer: Luna Llena, integrado con la cuenta del sitio, y una tienda para intercambiar cromos con la moneda del juego.',
        ],
      },
      {
        titulo: 'Arquitectura',
        parrafos: [
          'Es un sitio multipágina estático: cada sección tiene su propio módulo de JavaScript y los datos viven en Firestore. Los juegos se cargan dentro del sitio y comparten la sesión del usuario.',
        ],
      },
    ],
  },
  {
    slug: 'aura',
    coincide: /\baura\b/i,
    titulo: 'Aura Ekiz',
    tipo: 'Escritorio · IA',
    autor: 'Juan',
    periodo: 'Fines de 2025 — Actualidad',
    contexto: 'Proyecto personal',
    rol: 'Diseño, desarrollo, modelado 3D y animación',
    bajada:
      'Asistente para Windows con un avatar 3D animado que conversa por voz y maneja la computadora: abre programas, lee la pantalla, navega y trabaja dentro de Word y Excel.',
    tema: 'aura',
    destacado: false,
    descripcion: 'Asistente de escritorio con IA y un avatar 3D que maneja la PC por voz.',
    portada: null,
    tecnologias: ['Electron', 'Vue 3', 'Three.js', 'Python', 'FastAPI', 'Ollama'],
    cifras: [
      { valor: '85', texto: 'herramientas' },
      { valor: '3', texto: 'servicios' },
      { valor: '15', texto: 'emociones del avatar' },
      { valor: 'Local', texto: 'modelos en la propia PC' },
    ],
    capturas: [],
    arquitectura: [
      { titulo: 'Interfaz', items: ['Electron + Vue 3', 'Avatar 3D en Three.js', 'Ventana flotante sobre el escritorio'] },
      { titulo: 'Orquestador', items: ['Python + FastAPI', 'Modelos locales con Ollama', 'Memoria con búsqueda (RAG)', '85 herramientas'] },
      { titulo: 'Voz', items: ['Reconocimiento con faster-whisper', 'Síntesis de voz', 'Palabra de activación'] },
    ],
    ficha: [
      ['Interfaz', 'Electron, Vue 3 y Three.js'],
      ['Orquestador', 'Python con FastAPI'],
      ['IA', 'Modelos locales con Ollama, de texto y de visión'],
      ['Voz', 'faster-whisper, edge-tts y Piper'],
      ['Memoria', 'Búsqueda sobre notas en Markdown (RAG)'],
      ['Automatización', 'UI Automation de Windows, OCR, navegador por CDP, Word y Excel'],
    ],
    roadmap: [
      { estado: 'hecho', etiqueta: 'Base', titulo: 'Voz y avatar 3D', detalle: 'Conversación por voz con palabra de activación, avatar con emociones y boca sincronizada.' },
      { estado: 'hecho', etiqueta: 'Manejo de la PC', titulo: 'Controlar Windows', detalle: 'Ventanas, botones y campos por nombre, mouse y teclado con confirmación para lo delicado.' },
      { estado: 'hecho', etiqueta: 'Visión e investigación', titulo: 'Ver y buscar', detalle: 'Lectura de pantalla, modelo de visión y un navegador propio que investiga y cita fuentes.' },
      { estado: 'hecho', etiqueta: 'Oficina y memoria', titulo: 'Trabajo real', detalle: 'Word y Excel por dentro, memoria de largo plazo y habilidades que aprende por voz.' },
      { estado: 'hecho', etiqueta: 'Rendimiento', titulo: 'Se adapta al equipo', detalle: 'Mide la PC al arrancar y elige qué modelos y funciones usar, para andar también en equipos chicos.' },
      { estado: 'en-curso', etiqueta: 'En desarrollo', titulo: 'Instalador de un paso', detalle: 'Versión compilada de la interfaz y un instalador que deja todo listo con un solo comando.' },
      { estado: 'en-curso', etiqueta: 'En desarrollo', titulo: 'Capa de plataforma', detalle: 'Separar todo lo que depende de Windows para que el resto del código no sepa en qué sistema corre.' },
      { estado: 'futuro', etiqueta: 'A futuro', titulo: 'Versión para Linux', detalle: 'Las mismas herramientas implementadas para Linux, empezando por la notebook.' },
      { estado: 'futuro', etiqueta: 'A futuro', titulo: 'Memoria compartida', detalle: 'Sincronizar lo aprendido entre la PC y la notebook sin pasar por la nube.' },
      { estado: 'futuro', etiqueta: 'A futuro', titulo: 'Pruebas en un entorno aislado', detalle: 'Probar las acciones riesgosas en Windows Sandbox antes de hacerlas de verdad.' },
      { estado: 'futuro', etiqueta: 'A futuro', titulo: 'Más habilidades y voz propia', detalle: 'Llegar a unas cien habilidades y retomar la voz personalizada.' },
    ],
    secciones: [
      {
        titulo: 'Qué hace',
        lista: [
          'Conversa por voz, con palabra de activación o con un atajo, y responde mientras piensa: habla por frases con la siguiente ya preparada.',
          'Abre programas, busca archivos en la PC y encuentra botones y campos por su nombre.',
          'Lee la pantalla con OCR y entiende imágenes con un modelo de visión.',
          'Controla un navegador propio para buscar información y responde con fuentes.',
          'Trabaja dentro de Word y Excel: escribe, da formato, arma tablas y gráficos y exporta.',
          'Recordatorios y temporizadores que avisan hablando.',
          'Aprende recetas de varios pasos que se activan con una frase.',
        ],
      },
      {
        titulo: 'Seguridad',
        lista: [
          'Pide confirmación antes de cualquier acción delicada: eliminar, pagar o enviar mensajes.',
          'Las herramientas funcionan con una lista de acciones permitidas.',
          'Los modelos, la memoria y los registros quedan en la computadora del usuario.',
        ],
      },
      {
        titulo: 'Avatar',
        parrafos: [
          'El avatar es un modelo 3D con 15 movimientos y 15 emociones, mirada que sigue al cursor, parpadeo, modo dormido y boca sincronizada con el audio. El modelado y las animaciones son propios.',
        ],
      },
      {
        titulo: 'Procesos',
        parrafos: [
          'Son tres procesos que se comunican por HTTP. La interfaz en Electron levanta el orquestador y el servicio de voz como procesos hijos, así todo arranca con un solo comando y, si un servicio falla, la app sigue abierta y lo informa.',
        ],
      },
    ],
  },
]

export const docPorSlug = Object.fromEntries(documentacion.map((d) => [d.slug, d]))

// los documentados de un integrante, armados como si vinieran de la base (id doc-slug)
export function proyectosDoc(integrante) {
  return documentacion
    .filter((d) => d.autor === integrante.nombreCorto || d.autores?.includes(integrante.nombreCorto))
    .map((d) => ({ id: `doc-${d.slug}`, titulo: d.titulo, descripcion: d.descripcion, tipo: d.tipo, autor: d.autor, destacado: d.destacado, doc: d.slug }))
}

// junta los de la base con los documentados, sin repetir
export function mezclarConDocs(lista, docs) {
  const enBase = new Set(lista.map((p) => docDe(p)?.slug).filter(Boolean))
  const unicos = docs.filter((p, i) => docs.findIndex((q) => q.doc === p.doc) === i)
  return [...unicos.filter((p) => !enBase.has(p.doc)), ...lista]
}

// busca la documentación de un proyecto de la base por su título
export function docDe(proyecto) {
  if (proyecto?.doc) return docPorSlug[proyecto.doc] ?? null
  if (!proyecto?.titulo) return null
  return documentacion.find((d) => d.coincide.test(proyecto.titulo)) ?? null
}
