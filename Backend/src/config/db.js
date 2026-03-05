const mysql = require("mysql2");
require("dotenv").config();

// 1. Creamos el pool original
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

promisePool.getConnection()
    .then(connection => {
        console.log(" Conexión exitosa a la base de datos:", process.env.DB_NAME);
        connection.release();
    })
    .catch(err => {
        console.error(" Error conectando a MySQL:", err.message);
        console.error("Revisa que tu DB_NAME sea 'proyecto' y tu contraseña sea correcta.");
    });

module.exports = promisePool;