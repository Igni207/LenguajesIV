const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {rejectUnauthorized: false}
});

pool.query('SELECT NOW()')
    .then(()=> console.log('Se estableció correctamente la conexión a PostgreSQL'))
    .catch((err)=> console.error('Error al conectar con la base de datos: ', err.message));

module.exports = pool;

