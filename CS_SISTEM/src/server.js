// src/server.js
// Tugas: Inisialisasi server Express, middleware, dan pendefinisian rute

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const express = require("express");

// Import Controller yang baru kita buat
const { handleChat } = require("./controllers/chat-controller");
const { chatLimiter } = require("./middlewares/ratelimiter");

const app = express();

// Middleware parsing JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// ─── Definisi Rute (Diarahkan langsung ke Controller) ───
app.post("/api/chat", chatLimiter, handleChat);

// ─── Menjalankan Server ───
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ CS-Bot server berjalan di http://localhost:${PORT}`);
  console.log(`   Model AI : ${process.env.DEFAULT_MODEL}`);
  console.log(`   Ollama   : ${process.env.OLLAMA_HOST}`);
});
