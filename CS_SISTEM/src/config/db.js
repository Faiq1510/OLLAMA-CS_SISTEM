// src/config/db.js
// Tugas: Mengelola koneksi pool ke database PostgreSQL

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "webstudio_db",
});

// Event listener saat koneksi berhasil tersambung
pool.on("connect", () => {
  // Terkoneksi ke PostgreSQL
});

pool.on("error", (err) => {
  console.error("[Database Error]:", err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
