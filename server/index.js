// gonzi: te dejo el server levantado con express, despues conecta la bdd - fexx
const express = require('express');
const cors = require('cors');
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
app.get('/api/projects', (req, res) => {
  res.json(proyectos);
});
// santi: este endpoint recibe los proyectos nuevos desde el modal, aclaro por las ddas - fexx
app.post('/api/projects', (req, res) => {
  const nuevoProyecto = { id: Date.now(), ...req.body };
  proyectos.push(nuevoProyecto);
  res.status(201).json(nuevoProyecto);
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`servidor corriendo en http://localhost:${PORT}`);
});