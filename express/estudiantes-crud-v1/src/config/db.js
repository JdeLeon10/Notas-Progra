import mysql from 'mysql2/promise';
import 'dotenv/config';

// Un pool es mejor práctica que una única conexión: reutiliza conexiones
// en vez de abrir/cerrar una por cada request (más rendimiento y evita
// que se te agoten las conexiones bajo carga).
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Función auxiliar para verificar la conexión al iniciar el servidor.
export async function checkConnection() {
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
}
