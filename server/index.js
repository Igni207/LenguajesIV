
// fexx: GET /api/projects ya lee de la base (metrics y POST siguen de prueba). --gonzi
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors());
app.use(express.json());

// datos hardcodeados temporalmente
const metricasTotales = { visitas: 1248, usuarios: 42, consultas: 5 };
const datosEvolucion = [
  { dia: 'Lun', visitas: 120, usuarios: 4 },
  { dia: 'Mar', visitas: 150, usuarios: 7 },
  { dia: 'Mie', visitas: 180, usuarios: 5 },
  { dia: 'Jue', visitas: 220, usuarios: 12 },
  { dia: 'Vie', visitas: 250, usuarios: 8 },
  { dia: 'Sab', visitas: 190, usuarios: 4 },
  { dia: 'Dom', visitas: 138, usuarios: 2 }
];
const datosOrigen = [
  { origen: 'Proyectos', cantidad: 18 },
  { origen: 'Demos', cantidad: 15 },
  { origen: 'Descarga CV', cantidad: 9 }
];

// endpoints para el dashboard
app.get('/api/metrics', (req, res) => {
  res.json({
    totales: metricasTotales,
    evolucion: datosEvolucion,
    origen: datosOrigen
  });
});

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

// Columnas de un proyecto con los nombres que ve el frontend.
// Es una constante nuestra: nunca se mete un dato del usuario dentro del SQL.
const COLUMNAS_PROYECTO = `id, titulo, descripcion,
  imagen_url AS "imagenUrl", demo_url AS "demoUrl", repo_url AS "repoUrl",
  tipo, autor, tecnologias, destacado`;

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

    pool.query('INSERT INTO logins (usuario_id, proveedor) VALUES ($1, $2)', [u.id, 'email'])
        .catch((err) => console.error('No se pudo guardar el login:', err.message));

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

// santi: este endpoint recibe los proyectos nuevos desde el modal, aclaro por las ddas - fexx
// Crear proyecto (admin)
app.post('/api/projects', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { errores, datos: d } = validarProyecto(req.body);
    if (Object.keys(errores).length > 0) {
      return res.status(400).json({ mensaje: 'Revisá los datos', errores });
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

//Editar proyecto (Admin) (reemplaza los datos editables)
app.put('/api/projects/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ mensaje: 'Id inválido.' });

    const {errores, datos: d} = validarProyecto(req.body);
    if (Object.keys(errores).length > 0) {
      return res.status(400).json({ mensaje: 'Revisá los datos', errores });
    }

    const r = await pool.query(
      `UPDATE proyectos
       SET titulo = $1, descripcion = $2, imagen_url = $3, demo_url = $4, repo_url = $5,
           tipo = $6, autor = $7, tecnologias = $8, destacado = $9
       WHERE id = $10 AND activo = true
       RETURNING ${COLUMNAS_PROYECTO}`,
      [d.titulo, d.descripcion, d.imagenUrl, d.demoUrl, d.repoUrl, d.tipo, d.autor, d.tecnologias, d.destacado, id]
    );

    if (r.rows.length === 0 ) return res.status(404).json({ mensaje: 'Proyecto no encontrado.' });

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`servidor corriendo en http://localhost:${PORT}`);
});