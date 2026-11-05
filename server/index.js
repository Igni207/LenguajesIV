
// fexx: GET /api/projects ya lee de la base (metrics y POST siguen de prueba). --gonzi
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { enviarConsulta, enviarRespuesta } = require('./mailer');
const app = express();
app.use(cors());
app.use(express.json());


//Guardia(middleware): Exige un token válido
function requireAuth(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({mensaje: 'Necesitás iniciar sesión'});
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch {
    res.status(401).json({mensaje: 'Tu sesión venció o no es válida. Iniciá sesión de nuevo.'});
  }
}

//Guardia(middleware): Exige ser Admin (se usa Después de requireAuth)
function requireAdmin (req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ mensaje: 'No tenés permiso para hacer esto.' });
  }
  next();
}

//Guardia(middleware) opcional: si hay un token válido, anota quién es; si no, deja pasar igual
function optionalAuth(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo === 'Bearer' && token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    } catch {
      // token inválido: se trata como visitante
    }
  }
  next();
}

// Columnas de un proyecto con los nombres que ve el frontend.
// Es una constante nuestra: nunca se mete un dato del usuario dentro del SQL.
const COLUMNAS_PROYECTO = `id, titulo, descripcion,
  imagen_url AS "imagenUrl", demo_url AS "demoUrl", repo_url AS "repoUrl",
  tipo, autor, tecnologias, destacado`;


// Acepta también los nombres que usa el panel (repositorio y demo)
function normalizarBodyProyecto(body) {
  const b = (body && typeof body === 'object' && !Array.isArray(body)) ? { ...body } : {};
  if (b.repoUrl === undefined && b.repositorio !== undefined) b.repoUrl = b.repositorio;
  if (b.demoUrl === undefined && b.demo !== undefined) b.demoUrl = b.demo;
  return b;
}

// Valida y limpia los datos de un proyecto (sirve para crear y para editar)
function validarProyecto (body) {
  const b = body || {};
  const errores = {};
  const texto = (v) => (typeof v === 'string' ? v.trim() : '');
  const urlValida = (v) => {
    try {
      const u = new URL(v);
      return (u.protocol === 'http:' || u.protocol === 'https:') && v.length <= 500;
    } catch {
      return false;
    }
  };

  const titulo = texto(b.titulo);
  if (titulo.length < 2 || titulo.length > 150) {
    errores.titulo = 'El título debe tener entre 2 y 150 caracteres.';
  }

  const descripcion = texto(b.descripcion) || null;
  if (descripcion && descripcion.length > 5000) errores.descripcion = 'La descripción es demasiado larga.';
  const tipo = texto(b.tipo) || null;
  if (tipo && tipo.length > 50) errores.tipo = 'El tipo es demasiado largo.';
  const autor = texto(b.autor) || null;
  if (autor && autor.length > 100) errores.autor = 'El autor es demasiado largo.';
  const tecnologias = texto(b.tecnologias) || null;
  if (tecnologias && tecnologias.length > 300) errores.tecnologias = 'Las tecnologías son demasiado largas.';

  const imagenUrl = texto(b.imagenUrl) || null;
  if (imagenUrl && !urlValida(imagenUrl)) errores.imagenUrl = 'Ingresá una URL válida (http o https).';
  const demoUrl = texto(b.demoUrl) || null;
  if (demoUrl && !urlValida(demoUrl)) errores.demoUrl = 'Ingresá una URL válida (http o https).';
  const repoUrl = texto(b.repoUrl) || null;
  if (repoUrl && !urlValida(repoUrl)) errores.repoUrl = 'Ingresá una URL válida (http o https).';

  const destacado = b.destacado === true;

  return {
    errores,
    datos: { titulo, descripcion, imagenUrl, demoUrl, repoUrl, tipo, autor, tecnologias, destacado }
  };
}

// Reglas que dependen de la base: autor válido y máximo 2 destacados por integrante
async function reglasDeProyecto(d, idActual) {
  const errores = {};
  if (!d.autor) return errores;

  // Proyecto de todo el equipo: es válido y no cuenta para el límite de destacados
  if (d.autor.toLowerCase() === 'equipo') {
    d.autor = 'Equipo';
    return errores;
  }

  const r = await pool.query(
    `SELECT alias FROM integrantes
     WHERE lower($1::text) IN (lower(alias), lower(nombre), lower(nombre_corto))`,
    [d.autor]
  );
  if (r.rows.length === 0) {
    errores.autor = 'Elegí un integrante del equipo (Fexx, Ssanty, Ultronzi o Rojo) o "Equipo".';
    return errores;
  }

  d.autor = r.rows[0].alias; // se guarda siempre con el alias exacto
  if (d.destacado) {
    const c = await pool.query(
      `SELECT COUNT(*)::int AS n
       FROM proyectos
       WHERE activo = true AND destacado = true
         AND lower(autor) = lower($1::text) AND id <> $2`,
      [d.autor, idActual]
    );
    if (c.rows[0].n >= 2) {
      errores.destacado = 'Cada integrante puede tener como máximo 2 proyectos destacados.';
    }
  }
  return errores;
}

app.get('/api/projects', async (req, res) => {
  try{
    const resultado = await pool.query(
      `SELECT id, titulo, descripcion, tipo, destacado, autor
      FROM proyectos
      WHERE activo = true
      ORDER BY creado_en DESC`
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener proyectos: ', error.message);
    res.status(500).json({ mensaje: 'Error al obtener los proyectos' });
  }
});

//registro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, acceptTerms, origin } = req.body || {};

    //normalizacion de lo que llega
    const nombre= typeof name === 'string' ? name.trim() : '';
    const emailLimpio= typeof email === 'string' ? email.trim().toLowerCase() : '';
    const clave= typeof password == 'string' ? password : '';

    const errores = {};
    if (nombre.length < 2) {
      errores.name = 'El nombre debe tener al menos 2 letras.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)) {
      errores.email = 'Ingresá un correo electrónico válido.';
    }
    if (clave.length < 8 || clave.length > 72) {
      errores.password = 'La contraseña debe tener entre 8 y 72 caracteres.';
    }
    if (Object.keys(errores).length > 0) {
      return res.status(400).json({mensaje: 'Revisá los datos', errores});
    }

    const ORIGENES = ['proyecto', 'demo', 'cv', 'ver_todo'];
    const origen = ORIGENES.includes(origin) ? origin : null;

    const hash = await bcrypt.hash(clave, 10);
    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, acepta_terminos, origen_registro)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, email, rol`,
       [nombre, emailLimpio, hash, acceptTerms === true, origen]
    );

    const u = resultado.rows[0];
    const user = {id: u.id, name: u.nombre, email: u.email, role: u.rol};
    const token = jwt.sign({id: u.id, role: u.rol}, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(201).json({token, user});
  } catch (error) {
    // 23505 es el código de PostgreSQL para "ya existe" (email repetido)
    if (error.code === '23505') {
      return res.status(409).json({
        mensaje: 'Revisá los datos',
        errores: {email: 'Ese email ya está registrado'}
      });
    }
    console.error('Error en el registro:', error.message);
    res.status(500).json({ mensaje: 'Error al registrar el usuario' });
  }
});

// Hash de relleno: se usa cuando el email no existe, para que la respuesta
// tarde lo mismo y no se pueda adivinar qué emails están registrados
const HASH_FALSO = bcrypt.hashSync('relleno-no-es-una-clave-real', 10);

//Inicio de sesion
app.post('/api/auth/login', async (req, res) => {
  try {
    const {email, password} = req.body || {};
    const emailLimpio = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const clave = typeof password === 'string' ? password : '';

    const errores = {};
    if (!emailLimpio) errores.email = 'Ingresá tu correo electrónico.';
    if (!clave) errores.password = 'Ingresá tu contraseña.';
    if (Object.keys(errores).length > 0) {
      return res.status(400).json({ mensaje: 'Revisá los datos', errores });
    }

    const resultado = await pool.query(
      `SELECT id, nombre, email, password_hash, rol FROM usuarios WHERE email = $1`,
      [emailLimpio]
    );
    const u = resultado.rows[0];

    const coincide = await bcrypt.compare(clave, u ? u.password_hash : HASH_FALSO);
    if (!u || !coincide) {
      return res.status(401).json({ mensaje: 'Email o contraseña incorrectos.' });
    }

    // 4. Guardar el login para las métricas (si falla, no bloquea el ingreso)
    try {
      await pool.query('INSERT INTO logins (usuario_id, proveedor) VALUES ($1, $2)', [u.id, 'email']);
    } catch (err) {
      console.error('No se pudo guardar el login:', err.message);
    }

    const user = {id: u.id, name: u.nombre, email: u.email, role: u.rol};
    const token = jwt.sign({id: u.id, role: u.rol}, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({token, user});
  } catch (error) {
    console.error('Error en el login: ', error.message);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const r = await pool.query(
      'SELECT id, nombre, email, rol FROM usuarios WHERE id = $1',
      [req.user.id]
    );
    const u = r.rows[0];
    if (!u) return res.status(401).json({ mensaje: 'El usuario ya no existe.' });
    res.json({ user: { id: u.id, name: u.nombre, email: u.email, role: u.rol } });
  } catch (error) {
    console.error('Error en /me:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener el usuario' });
  }
});

app.get('/api/projects/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ mensaje: 'Id inválido.' });
    }
    const r = await pool.query(
      `SELECT ${COLUMNAS_PROYECTO}
       FROM proyectos
       WHERE id = $1 AND activo = true`,
      [id]
    );
    if (r.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Proyecto no encontrado.' });
    }
    res.json(r.rows[0]);
  } catch (error) {
    console.error('Error al obtener el proyecto:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener el proyecto' });
  }
});

const ETIQUETA_ORIGEN = {
  proyecto: 'Proyectos',
  demo: 'Demos',
  cv: 'Descarga CV',
  ver_todo: 'Ver todo'
};

app.get('/api/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const r = await pool.query(
      'SELECT id, nombre, email, rol, origen_registro FROM usuarios ORDER BY creado_en DESC'
    );
    res.json(r.rows.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      origen: ETIQUETA_ORIGEN[u.origen_registro] || 'sin dato',
      rol: u.rol === 'admin' ? 'Administrador' : 'Usuario'
    })));
  } catch (error) {
    console.error('Error al listar usuarios:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
  }
});

// Eliminar un usuario (admin)
app.delete('/api/users/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ mensaje: 'Id inválido.' });
    if (id === req.user.id) {
      return res.status(400).json({ mensaje: 'No podés eliminar tu propia cuenta.' });
    }

    const buscado = await pool.query('SELECT rol FROM usuarios WHERE id = $1', [id]);
    if (buscado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }
    if (buscado.rows[0].rol === 'admin') {
      return res.status(403).json({ mensaje: 'No se pueden eliminar administradores desde el panel.' });
    }

    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error al eliminar el usuario:', error.message);
    res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
  }
});

// Registrar una visita (público; si viene con token, se asocia al usuario)
app.post('/api/visits', optionalAuth, async (req, res) => {
  try {
    const { ruta } = req.body || {};
    const rutaLimpia = typeof ruta === 'string' ? ruta.trim() : '';
    if (!rutaLimpia.startsWith('/') || rutaLimpia.length > 200) {
      return res.status(400).json({ mensaje: 'Revisá los datos', errores: { ruta: 'Ruta no válida.' } });
    }
    await pool.query(
      'INSERT INTO visitas (ruta, usuario_id) VALUES ($1, (SELECT id FROM usuarios WHERE id = $2))',
      [rutaLimpia, req.user?.id ?? null]
    );
    res.sendStatus(204);
  } catch (error) {
    console.error('Error al registrar la visita:', error.message);
    res.status(500).json({ mensaje: 'Error al registrar la visita' });
  }
});

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Métricas del dashboard 
app.get('/api/metrics', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [totales, evolucion, origen, perfiles] = await Promise.all([
      pool.query(
        `SELECT
           (SELECT COUNT(*) FROM visitas)::int AS visitas,
           (SELECT COUNT(*) FROM usuarios)::int AS usuarios,
           (SELECT COUNT(*) FROM consultas WHERE estado = 'pendiente')::int AS consultas`
      ),
      pool.query(
        `WITH hoy AS (SELECT (NOW() AT TIME ZONE 'America/Argentina/Salta')::date AS d),
              dias AS (SELECT hoy.d - g AS dia FROM hoy, generate_series(0, 6) AS g)
         SELECT EXTRACT(DOW FROM dias.dia)::int AS dow,
           (SELECT COUNT(*) FROM visitas v
             WHERE (v.creado_en AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Salta')::date = dias.dia)::int AS visitas,
           (SELECT COUNT(*) FROM usuarios u
             WHERE (u.creado_en AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Salta')::date = dias.dia)::int AS usuarios
         FROM dias
         ORDER BY dias.dia`
      ),
      pool.query(
        `SELECT origen_registro, COUNT(*)::int AS cantidad
         FROM usuarios
         GROUP BY origen_registro
         ORDER BY cantidad DESC`
      ),
      pool.query(
        `SELECT ruta, COUNT(*)::int AS visitas
         FROM visitas
         WHERE ruta LIKE '/equipo/%'
         GROUP BY ruta
         ORDER BY visitas DESC`
      )
    ]);

    res.json({
      totales: totales.rows[0],
      evolucion: evolucion.rows.map((r) => ({ dia: DIAS_SEMANA[r.dow], visitas: r.visitas, usuarios: r.usuarios })),
      origen: origen.rows.map((r) => ({ origen: ETIQUETA_ORIGEN[r.origen_registro] || 'Sin dato', cantidad: r.cantidad })),
      perfiles: perfiles.rows
    });
  } catch (error) {
    console.error('Error al calcular las métricas:', error.message);
    res.status(500).json({ mensaje: 'Error al calcular las métricas' });
  }
});

// santi: este endpoint recibe los proyectos nuevos desde el modal, aclaro por las ddas - fexx
// Crear proyecto (admin)
app.post('/api/projects', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { errores, datos: d } = validarProyecto(normalizarBodyProyecto(req.body));
    if (Object.keys(errores).length > 0) {
      return res.status(400).json({ mensaje: 'Revisá los datos', errores });
    }
    const erroresBD = await reglasDeProyecto(d, 0);
    if (Object.keys(erroresBD).length > 0) {
      return res.status(400).json({ mensaje: 'Revisá los datos', errores: erroresBD });
    }

    const r = await pool.query(
      `INSERT INTO proyectos
         (titulo, descripcion, imagen_url, demo_url, repo_url, tipo, autor, tecnologias, destacado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING ${COLUMNAS_PROYECTO}`,
      [d.titulo, d.descripcion, d.imagenUrl, d.demoUrl, d.repoUrl, d.tipo, d.autor, d.tecnologias, d.destacado]
    );
    res.status(201).json(r.rows[0]);
  } catch (error) {
    console.error('Error al crear proyecto:', error.message);
    res.status(500).json({ mensaje: 'Error al crear el proyecto' });
  }
});

// Editar proyecto (admin): los campos que no se mandan se conservan
app.put('/api/projects/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ mensaje: 'Id inválido.' });

    const actual = await pool.query(
      `SELECT ${COLUMNAS_PROYECTO} FROM proyectos WHERE id = $1 AND activo = true`,
      [id]
    );
    if (actual.rows.length === 0) return res.status(404).json({ mensaje: 'Proyecto no encontrado.' });

    const { errores, datos: d } = validarProyecto({ ...actual.rows[0], ...normalizarBodyProyecto(req.body) });
    if (Object.keys(errores).length > 0) {
      return res.status(400).json({ mensaje: 'Revisá los datos', errores });
    }
    
    const erroresBD = await reglasDeProyecto(d, id);
    if (Object.keys(erroresBD).length > 0) {
      return res.status(400).json({ mensaje: 'Revisá los datos', errores: erroresBD });
    }

    const r = await pool.query(
      `UPDATE proyectos
       SET titulo = $1, descripcion = $2, imagen_url = $3, demo_url = $4, repo_url = $5,
           tipo = $6, autor = $7, tecnologias = $8, destacado = $9
       WHERE id = $10 AND activo = true
       RETURNING ${COLUMNAS_PROYECTO}`,
      [d.titulo, d.descripcion, d.imagenUrl, d.demoUrl, d.repoUrl, d.tipo, d.autor, d.tecnologias, d.destacado, id]
    );
    if (r.rows.length === 0) return res.status(404).json({ mensaje: 'Proyecto no encontrado.' });
    res.json(r.rows[0]);

  } catch (error) {
    console.error('Error al editar proyecto:', error.message);
    res.status(500).json({ mensaje: 'Error al editar el proyecto' });
  }
});

// Dar de baja un proyecto (admin) (no se borra, se oculta)
app.delete('/api/projects/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ mensaje: 'Id inválido.' });

    const r = await pool.query(
      'UPDATE proyectos SET activo = false WHERE id = $1 AND activo = true RETURNING id',
      [id]
    );

    if (r.rows.length === 0) return res.status(404).json({mensaje: 'Proyecto no encontrado'});

    res.sendStatus(204);
  } catch (error) {
    console.error('Error al dar de baja el proyecto:', error.message);
    res.status(500).json({ mensaje: 'Error al dar de baja el proyecto' });
  }
});

// Contacto: guarda la consulta (público)
app.post('/api/contact', async (req, res) => {
  try {
    const {nombre, email, tipo, mensaje} = req.body || {};

    const nombreLimpio = typeof nombre === 'string' ? nombre.trim() : '';
    const emailLimpio = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const mensajeLimpio = typeof mensaje === 'string' ? mensaje.trim() : '';
    const tipoFinal = tipo === undefined ? 'general' : tipo;

    const errores = {};
    if (nombreLimpio.length < 2 || nombreLimpio.length > 100) {
      errores.nombre = 'Ingresá tu nombre (entre 2 y 100 caracteres).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailLimpio) || emailLimpio.length > 150) {
      errores.email = 'Revisá el formato del email.';
    }
    if (mensajeLimpio.length < 10 || mensajeLimpio.length > 1000) {
      errores.mensaje = 'El mensaje debe tener entre 10 y 1000 caracteres.';
    }
    if (!['general', 'cotizacion', 'asesoria'].includes(tipoFinal)) {
      errores.tipo = 'Tipo de consulta no válido.';
    }
    if (Object.keys(errores).length > 0) {
      return res.status(400).json({ mensaje: 'Revisá los datos', errores });
    }

    await pool.query(
      `INSERT INTO consultas (nombre, email, tipo, mensaje)
       VALUES ($1, $2, $3, $4)`,
      [nombreLimpio, emailLimpio, tipoFinal, mensajeLimpio]
    );

    try {
      await enviarConsulta({
        nombre: nombreLimpio,
        email: emailLimpio,
        tipo: tipoFinal,
        mensaje: mensajeLimpio
      });
    } catch (err) {
      console.error('No se pudo enviar el email:', err.message);
    }

    res.status(201).json({ mensaje: 'Consulta recibida' });
  } catch (error) {
    console.error('Error al guardar la consulta:', error.message);
    res.status(500).json({ mensaje: 'Error al enviar la consulta' });
  }
});

const ETIQUETA_TIPO = { general: 'General', cotizacion: 'Cotización', asesoria: 'Asesoría' };

// Listar consultas (admin) con las pendientes primero
app.get('/api/consultas', requireAuth, requireAdmin, async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT id, nombre, email, tipo, mensaje, estado, respuesta,
              to_char(creado_en AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Salta', 'DD/MM/YYYY') AS fecha
       FROM consultas
       ORDER BY (estado = 'pendiente') DESC, creado_en DESC`
    );
    res.json(r.rows.map((c) => ({
      id: c.id,
      remitente: c.nombre,
      email: c.email,
      tipo: ETIQUETA_TIPO[c.tipo] || c.tipo,
      estado: c.estado === 'pendiente' ? 'Pendiente' : 'Respondida',
      fecha: c.fecha,
      mensaje: c.mensaje,
      respuesta: c.respuesta
    })));
  } catch (error) {
    console.error('Error al listar consultas:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener las consultas' });
  }
});

// Responder una consulta por email (admin)
app.post('/api/consultas/:id/responder', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ mensaje: 'Id inválido.' });

    const { respuesta } = req.body || {};
    const texto = typeof respuesta === 'string' ? respuesta.trim() : '';
    if (texto.length < 2 || texto.length > 5000) {
      return res.status(400).json({
        mensaje: 'Revisá los datos',
        errores: { respuesta: 'La respuesta debe tener entre 2 y 5000 caracteres.' }
      });
    }

    const buscada = await pool.query('SELECT nombre, email, mensaje FROM consultas WHERE id = $1', [id]);
    const c = buscada.rows[0];
    if (!c) return res.status(404).json({ mensaje: 'Consulta no encontrada.' });

    // Primero el email: si falla, la consulta sigue pendiente
    try {
      await enviarRespuesta({ para: c.email, nombre: c.nombre, respuesta: texto, mensajeOriginal: c.mensaje });
    } catch (err) {
      console.error('No se pudo enviar la respuesta:', err.message);
      return res.status(502).json({ mensaje: 'No se pudo enviar el email. La consulta sigue pendiente.' });
    }

    await pool.query(
      "UPDATE consultas SET respuesta = $1, estado = 'respondida' WHERE id = $2",
      [texto, id]
    );
    res.json({ id, estado: 'Respondida', respuesta: texto });
  } catch (error) {
    console.error('Error al responder la consulta:', error.message);
    res.status(500).json({ mensaje: 'Error al responder la consulta' });
  }
});

// Valida y limpia los datos de un servicio (sirve para crear y para editar)
function validarServicio(body) {
  const b = body || {};
  const errores = {};
  const texto = (v) => (typeof v === 'string' ? v.trim() : '');

  const titulo = texto(b.titulo);
  if (titulo.length < 2 || titulo.length > 150) {
    errores.titulo = 'El título debe tener entre 2 y 150 caracteres.';
  }

  const descripcion = texto(b.descripcion) || null;
  if (descripcion && descripcion.length > 2000) {
    errores.descripcion = 'La descripción es demasiado larga.';
  }

  let precioDesde = null;
  const crudo = b.precioDesde;
  if (crudo !== undefined && crudo !== null && crudo !== '') {
    const n = (typeof crudo === 'number' || typeof crudo === 'string') ? Number(crudo) : NaN;
    if (!Number.isFinite(n) || n < 0 || n > 99999999.99) {
      errores.precioDesde = 'Ingresá un precio válido (un número mayor o igual a 0).';
    } else {
      precioDesde = Math.round(n * 100) / 100;
    }
  }

  return { errores, datos: { titulo, descripcion, precioDesde } };
}

// PostgreSQL devuelve los NUMERIC como texto, asi que lo pasamos a número
const aServicio = (r) => ({
  id: r.id,
  titulo: r.titulo,
  descripcion: r.descripcion,
  precioDesde: r.precio_desde === null ? null : Number(r.precio_desde)
});

// Lista pública de servicios activos
app.get('/api/services', async (req, res) => {
  try {
    const r = await pool.query(
      'SELECT id, titulo, descripcion, precio_desde FROM servicios WHERE activo = true ORDER BY id'
    );
    res.json(r.rows.map(aServicio));
  } catch (error) {
    console.error('Error al obtener servicios:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener los servicios' });
  }
});

// Crear servicio (admin)
app.post('/api/services', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { errores, datos: d } = validarServicio(req.body);
    if (Object.keys(errores).length > 0) {
      return res.status(400).json({ mensaje: 'Revisá los datos', errores });
    }
    const r = await pool.query(
      `INSERT INTO servicios (titulo, descripcion, precio_desde)
       VALUES ($1, $2, $3)
       RETURNING id, titulo, descripcion, precio_desde`,
      [d.titulo, d.descripcion, d.precioDesde]
    );
    res.status(201).json(aServicio(r.rows[0]));
  } catch (error) {
    console.error('Error al crear servicio:', error.message);
    res.status(500).json({ mensaje: 'Error al crear el servicio' });
  }
});

// Editar servicio (admin): reemplaza los datos editables
app.put('/api/services/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ mensaje: 'Id inválido.' });

    const { errores, datos: d } = validarServicio(req.body);
    if (Object.keys(errores).length > 0) {
      return res.status(400).json({ mensaje: 'Revisá los datos', errores });
    }
    const r = await pool.query(
      `UPDATE servicios
       SET titulo = $1, descripcion = $2, precio_desde = $3
       WHERE id = $4 AND activo = true
       RETURNING id, titulo, descripcion, precio_desde`,
      [d.titulo, d.descripcion, d.precioDesde, id]
    );
    if (r.rows.length === 0) return res.status(404).json({ mensaje: 'Servicio no encontrado.' });
    res.json(aServicio(r.rows[0]));
  } catch (error) {
    console.error('Error al editar servicio:', error.message);
    res.status(500).json({ mensaje: 'Error al editar el servicio' });
  }
});

// Dar de baja un servicio (admin): no se borra, se oculta
app.delete('/api/services/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ mensaje: 'Id inválido.' });

    const r = await pool.query(
      'UPDATE servicios SET activo = false WHERE id = $1 AND activo = true RETURNING id',
      [id]
    );
    if (r.rows.length === 0) return res.status(404).json({ mensaje: 'Servicio no encontrado.' });
    res.sendStatus(204);
  } catch (error) {
    console.error('Error al dar de baja el servicio:', error.message);
    res.status(500).json({ mensaje: 'Error al dar de baja el servicio' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`servidor corriendo en http://localhost:${PORT}`);
});