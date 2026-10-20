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


/*
const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
        console.log('Se estableció la conexión a SQL Server');
        return pool;
    })
    .catch((err) =>{
        console.error('Se produjo un error al conectarse a la Base de Datos: ', err.message);
    });

    module.exports = {sql, poolPromise};
*/