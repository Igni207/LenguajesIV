-- Esto es por si quieren recrear la base 

-- Carga inicial de integrantes (generada desde client/src/data/integrantes.js)
-- Ejecutar UNA sola vez, despues de crear las tablas nuevas.
-- Va dentro de una transaccion: o se carga todo o no se carga nada.
BEGIN;

-- ===== Fexx =====
INSERT INTO integrantes
  (slug, alias, nombre, nombre_corto, rol, color, color_profundo, bio_corta, bio_larga,
   titulo_cv, ciudad, email_contacto, telefono, whatsapp, foto_url)
VALUES
  ('ezequiel-silvera', 'Fexx', 'Ezequiel Silvera Sandoval', 'Ezequiel', 'Fullstack & Analytics', '#7C9CE4', '#2C3E66',
   'Me gusta convertir datos en paneles claros y fáciles de leer. En el equipo me ocupo del panel de administración, las métricas y que todo llegue andando a producción.', 'Estudiante de la Universidad Católica de Salta desde 2024. Formé parte del equipo de Gonzi The Orc Slayer, un juego 2D, y hoy me ocupo del panel de administración y las métricas de este portfolio. Me gusta que los datos se entiendan de un vistazo y que todo llegue andando a producción.', 'Desarrollador fullstack', 'Salta, Argentina', 'ezequiel.silvera.sandoval@gmail.com', '+54 9 387 586-6708', '5493875866708', NULL);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'ezequiel-silvera'), 'React', 75, 0);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'ezequiel-silvera'), 'Recharts', 80, 1);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'ezequiel-silvera'), 'Node.js + Express', 65, 2);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'ezequiel-silvera'), 'SQL', 60, 3);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'ezequiel-silvera'), 'Vercel y deploy', 75, 4);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'ezequiel-silvera'), 'Git', 75, 5);
INSERT INTO idiomas (integrante_id, nombre, nivel) VALUES ((SELECT id FROM integrantes WHERE slug = 'ezequiel-silvera'), 'Español', 'Nativo');
INSERT INTO idiomas (integrante_id, nombre, nivel) VALUES ((SELECT id FROM integrantes WHERE slug = 'ezequiel-silvera'), 'Inglés', 'Intermedio');
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'ezequiel-silvera'), 'experiencia', 'Octubre de 2026', 'Actualidad', 'Fullstack y analytics', 'Portfolio del equipo · Lenguajes IV, UCASAL', 'Panel de administración con métricas y gráficos interactivos, gestión de proyectos y consultas, y despliegue del sitio en Vercel. Es esta misma web.', 0);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'ezequiel-silvera'), 'experiencia', '2024', 'Inicios de 2025', 'Desarrollo del videojuego', 'Gonzi The Orc Slayer · videojuego 2D', 'Parte del equipo que desarrolló Gonzi The Orc Slayer, un juego 2D. Texto de ejemplo para contar qué parte del juego hiciste.', 1);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'ezequiel-silvera'), 'educacion', '2024', 'En curso', 'Carrera de grado', 'Universidad Católica de Salta', NULL, 0);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'ezequiel-silvera'), 'educacion', NULL, '2023', 'Bachiller en Ciencias Económicas', 'Educación secundaria', NULL, 1);

-- ===== Ssanty =====
INSERT INTO integrantes
  (slug, alias, nombre, nombre_corto, rol, color, color_profundo, bio_corta, bio_larga,
   titulo_cv, ciudad, email_contacto, telefono, whatsapp, foto_url)
VALUES
  ('santiago-chocobar', 'Ssanty', 'Santiago Daniel Chocobar', 'Santiago', 'Lead Frontend', '#C29FE6', '#45305E',
   'Armo interfaces en React pensando en que se entiendan y respondan rápido. En el equipo llevo la estructura del frontend, las rutas y el manejo de sesión.', 'Estudiante de la Universidad Católica de Salta desde 2024. Formé parte del equipo de Gonzi The Orc Slayer, un juego 2D, y hoy llevo el frontend de este portfolio. Me gusta armar interfaces en React que se entiendan solas y separar todo en componentes fáciles de reutilizar.', 'Desarrollador frontend', 'Salta, Argentina', 'santichocovarios@gmail.com', '+54 9 387 449-7921', '5493874497921', NULL);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'santiago-chocobar'), 'React', 80, 0);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'santiago-chocobar'), 'React Router', 80, 1);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'santiago-chocobar'), 'JavaScript', 75, 2);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'santiago-chocobar'), 'Vite', 70, 3);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'santiago-chocobar'), 'Tailwind CSS', 65, 4);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'santiago-chocobar'), 'Git', 75, 5);
INSERT INTO idiomas (integrante_id, nombre, nivel) VALUES ((SELECT id FROM integrantes WHERE slug = 'santiago-chocobar'), 'Español', 'Nativo');
INSERT INTO idiomas (integrante_id, nombre, nivel) VALUES ((SELECT id FROM integrantes WHERE slug = 'santiago-chocobar'), 'Inglés', 'Intermedio');
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'santiago-chocobar'), 'experiencia', 'Octubre de 2026', 'Actualidad', 'Lead frontend', 'Portfolio del equipo · Lenguajes IV, UCASAL', 'Estructura del frontend en React con Vite, rutas con React Router, rutas protegidas, manejo de sesión con Context y validación de formularios. Es esta misma web.', 0);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'santiago-chocobar'), 'experiencia', '2024', 'Inicios de 2025', 'Desarrollo del videojuego', 'Gonzi The Orc Slayer · videojuego 2D', 'Parte del equipo que desarrolló Gonzi The Orc Slayer, un juego 2D. Texto de ejemplo para contar qué parte del juego hiciste.', 1);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'santiago-chocobar'), 'educacion', '2024', 'En curso', 'Carrera de grado', 'Universidad Católica de Salta', NULL, 0);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'santiago-chocobar'), 'educacion', NULL, '2023', 'Bachiller en Ciencias Sociales y Humanidades', 'Educación secundaria', NULL, 1);

-- ===== Ultronzi =====
INSERT INTO integrantes
  (slug, alias, nombre, nombre_corto, rol, color, color_profundo, bio_corta, bio_larga,
   titulo_cv, ciudad, email_contacto, telefono, whatsapp, foto_url)
VALUES
  ('gonzalo-luna', 'Ultronzi', 'Gonzalo Nahuel Luna', 'Gonzalo', 'Tech Lead & Backend', '#B6D76E', '#3F5326',
   'Me ocupo de lo que no se ve: la base de datos, la API y la seguridad. Me gusta que los datos estén ordenados y que cada consulta sea rápida y segura.', 'Estudiante de la Universidad Católica de Salta desde 2024 y nuevo en el mundo del desarrollo. Empecé programando el movimiento y la recolección de ítems de Gonzi The Orc Slayer, un juego 2D, después trabajé con bases de datos en Numerika AI y hoy llevo el backend de este portfolio. Disfruto pensar cómo se relacionan las tablas y construir APIs ordenadas, seguras y fáciles de mantener.', 'Desarrollador backend', 'Salta, Argentina', 'gonchylaluna@gmail.com', '+54 9 387 516-2690', '5493875162690', NULL);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'gonzalo-luna'), 'PostgreSQL', 85, 0);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'gonzalo-luna'), 'Node.js + Express', 80, 1);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'gonzalo-luna'), 'SQL', 85, 2);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'gonzalo-luna'), 'JWT y seguridad', 70, 3);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'gonzalo-luna'), 'Supabase', 70, 4);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'gonzalo-luna'), 'Git', 75, 5);
INSERT INTO idiomas (integrante_id, nombre, nivel) VALUES ((SELECT id FROM integrantes WHERE slug = 'gonzalo-luna'), 'Español', 'Nativo');
INSERT INTO idiomas (integrante_id, nombre, nivel) VALUES ((SELECT id FROM integrantes WHERE slug = 'gonzalo-luna'), 'Inglés', 'Intermedio');
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'gonzalo-luna'), 'experiencia', 'Octubre de 2026', 'Actualidad', 'Tech Lead y backend', 'Portfolio del equipo · Lenguajes IV, UCASAL', 'Base de datos en PostgreSQL (Supabase), API REST con Node y Express, registro y login con contraseñas cifradas y JWT, y rutas protegidas por rol. Es esta misma web.', 0);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'gonzalo-luna'), 'experiencia', '2025', '2026', 'Bases de datos', 'Numerika AI', 'Trabajé con la base de datos de Numerika AI, una calculadora con inteligencia artificial integrada.', 1);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'gonzalo-luna'), 'experiencia', '2024', 'Inicios de 2025', 'Motor de movimiento y recolección de ítems', 'Gonzi The Orc Slayer · videojuego 2D', 'Encargado del motor de movimiento del personaje y del sistema para recolectar ítems en Gonzi The Orc Slayer, un juego 2D que hicimos en equipo.', 2);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'gonzalo-luna'), 'educacion', '2024', 'En curso', 'Carrera de grado', 'Universidad Católica de Salta', NULL, 0);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'gonzalo-luna'), 'educacion', NULL, '2023', 'Bachiller en Ciencias Económicas', 'Educación secundaria', NULL, 1);

-- ===== Rojo =====
INSERT INTO integrantes
  (slug, alias, nombre, nombre_corto, rol, color, color_profundo, bio_corta, bio_larga,
   titulo_cv, ciudad, email_contacto, telefono, whatsapp, foto_url)
VALUES
  ('juan-quinteros', 'Rojo', 'Juan Ignacio Quinteros Navarro', 'Juan', 'UI/UX & Animación', '#EE8E80', '#6A3530',
   'Diseño y animo interfaces que se sientan vivas sin cansar la vista. En el equipo me encargo de la identidad visual, el sistema de diseño y las animaciones.', 'Estudiante de la Universidad Católica de Salta desde 2024. Empecé haciendo la interfaz de Gonzi The Orc Slayer, después hice su secuela completa, Gonzi The Orc Slayer: Luna Llena, e invitaciones web para eventos. Hice la página del torneo BFC, trabajo en el asistente Aura Ekiz y diseño la identidad de este portfolio. Me gusta que las interfaces se sientan vivas sin cansar la vista y que cada movimiento tenga un motivo.', 'Diseñador UI/UX y animación', 'Salta, Argentina', 'ignirq2006@gmail.com', '+54 9 387 567-5809', '5493875675809', NULL);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'Diseño UI/UX', 85, 0);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'GSAP', 80, 1);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'Tailwind CSS', 85, 2);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'React', 70, 3);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'Figma', 75, 4);
INSERT INTO habilidades (integrante_id, nombre, nivel, orden) VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'Animación web', 80, 5);
INSERT INTO idiomas (integrante_id, nombre, nivel) VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'Español', 'Nativo');
INSERT INTO idiomas (integrante_id, nombre, nivel) VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'Inglés', 'Intermedio');
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'experiencia', 'Octubre de 2026', 'Actualidad', 'UI/UX y animación', 'Portfolio del equipo · Lenguajes IV, UCASAL', 'Manual de marca, sistema de diseño en Tailwind, componentes base, maquetación responsive y animaciones con GSAP. Es esta misma web.', 0);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'experiencia', 'Inicios de 2026', 'Actualidad', 'Diseño y desarrollo web', 'BFC · página de un torneo', 'Hice la página del torneo de punta a punta: identidad, estructura de las secciones, interfaz y desarrollo.', 1);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'experiencia', 'Fines de 2025', 'Actualidad', 'Diseño, 3D y animación', 'Aura Ekiz · asistente IA para Windows', 'Asistente con IA integrado a Windows, con total libertad creativa. Me encargo del diseño de la interfaz, el modelado 3D y las animaciones.', 2);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'experiencia', '2025', '2025', 'Diseño y desarrollo web', 'Invitaciones web · eventos', 'Invitaciones web para eventos como bodas, pensadas para verse bien en el celular y con animaciones suaves.', 3);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'experiencia', '2025', '2025', 'Desarrollo completo del juego', 'Gonzi The Orc Slayer: Luna Llena · secuela', 'Hice la secuela de Gonzi The Orc Slayer completa: programación, interfaz, menús y todo el apartado visual.', 4);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'experiencia', '2024', 'Inicios de 2025', 'Interfaz y apartado visual', 'Gonzi The Orc Slayer · videojuego 2D', 'Arranqué con la interfaz del personaje, los menús y todo lo visual del juego.', 5);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'educacion', '2024', 'En curso', 'Carrera de grado', 'Universidad Católica de Salta', NULL, 0);
INSERT INTO trayectoria (integrante_id, tipo, desde, hasta, titulo, lugar, descripcion, orden)
VALUES ((SELECT id FROM integrantes WHERE slug = 'juan-quinteros'), 'educacion', NULL, '2023', 'Bachiller en Ciencias Económicas', 'Educación secundaria', NULL, 1);

COMMIT;

-- Verificacion: deberia dar 4 integrantes
SELECT i.alias,
  (SELECT COUNT(*) FROM habilidades h WHERE h.integrante_id = i.id) AS habilidades,
  (SELECT COUNT(*) FROM idiomas d WHERE d.integrante_id = i.id) AS idiomas,
  (SELECT COUNT(*) FROM trayectoria t WHERE t.integrante_id = i.id AND t.tipo = 'experiencia') AS experiencias,
  (SELECT COUNT(*) FROM trayectoria t WHERE t.integrante_id = i.id AND t.tipo = 'educacion') AS educacion
FROM integrantes i ORDER BY i.id;