// src/middlewares/rateLimiter.js
// Tugas: Membatasi frekuensi request ke API untuk mencegah spam dan overload AI

const rateLimit = require("express-rate-limit");

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // Jendela waktu: 1 menit
  max: 10, // Maksimal 10 permintaan per IP dalam jendela waktu di atas
  standardHeaders: true, // Kirim info sisa kuota di header `RateLimit-*`
  legacyHeaders: false, // Nonaktifkan header lama `X-RateLimit-*`
  message: {
    error:
      "Terlalu banyak permintaan chat. Harap tunggu 1 menit sebelum mencoba kembali.",
  },
  statusCode: 429, // Status HTTP 429 Too Many Requests
});

module.exports = { chatLimiter };
