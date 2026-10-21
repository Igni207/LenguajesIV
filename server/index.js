// gonzi: te dejo el server levantado con express, despues conecta la bdd - fexx
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
let proyectos = [
  { id: 1, titulo: 'E-commerce React', tipo: 'Frontend', destacado: true, autor: 'Ssanty' },
  { id: 2, titulo: 'API de Facturación', tipo: 'Backend', destacado: false, autor: 'Ultronzi' }
];

// endpoints para el dashboard
app.get('/api/metrics', (req, res) => {
  res.json({
    totales: metricasTotales,
    evolucion: datosEvolucion,
    origen: datosOrigen
  });
});

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
        errores: {email: 'Ese email ya está resgistrado'}
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

// santi: este endpoint recibe los proyectos nuevos desde el modal, aclaro por las ddas - fexx
app.post('/api/projects', (req, res) => {
  const nuevoProyecto = { id: Date.now(), ...req.body };
  proyectos.push(nuevoProyecto);
  res.status(201).json(nuevoProyecto);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`servidor corriendo en http://localhost:${PORT}`);
});