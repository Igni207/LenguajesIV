const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const ETIQUETA_TIPO = {
  general: 'Consulta general',
  cotizacion: 'Cotización',
  asesoria: 'Asesoría técnica'
};

// Avisa al equipo que llegó una consulta nueva
async function enviarConsulta({ nombre, email, tipo, mensaje }) {
  await transporter.sendMail({
    from: `"Portfolio" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    replyTo: email,
    subject: `Nueva consulta: ${ETIQUETA_TIPO[tipo]}`,
    text: `De: ${nombre} (${email})\nTipo: ${ETIQUETA_TIPO[tipo]}\n\n${mensaje}`
  });
}

module.exports = { enviarConsulta };