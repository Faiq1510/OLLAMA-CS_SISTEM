// src/server.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const express = require("express");
const { getSystemPrompt } = require("./services/faqService");
const { chat } = require("./services/ollamaService");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const historiChat = [];

// ─── Endpoint Utama ────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body || {};

    // 1. Validasi Input Klien (Error 400)
    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({
        error: "Pesan tidak boleh kosong dan harus berupa teks.",
      });
    }

    // 2. Baca FAQ & Rakit System Prompt
    const systemPrompt = getSystemPrompt();

    // 3. Susun Riwayat Pesan
    const messages = [
      { role: "system", content: systemPrompt },
      ...historiChat,
      { role: "user", content: message },
    ];

    // 4. Panggil Ollama
    const jawaban = await chat(messages);

    // 5. Simpan Riwayat
    historiChat.push({ role: "user", content: message });
    historiChat.push({ role: "assistant", content: jawaban });

    // 6. Respon Sukses (200 OK)
    res.json({ answer: jawaban });
  } catch (error) {
    console.error("[Server Error]:", error.message);

    // Deteksi jika penyebabnya adalah koneksi ke Ollama gagal
    if (
      error.message.includes("fetch failed") ||
      error.message.includes("ECONNREFUSED")
    ) {
      return res.status(503).json({
        error:
          "Layanan AI (Ollama) sedang offline. Pastikan Ollama sudah dijalankan.",
      });
    }

    // Error umum lainnya (Error 500)
    res.status(500).json({
      error: "Terjadi kesalahan pada server saat memproses pertanyaan Anda.",
    });
  }
});

// ─── Jalankan Server ───────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ CS-Bot server berjalan di http://localhost:${PORT}`);
  console.log(`   Model AI : ${process.env.DEFAULT_MODEL}`);
  console.log(`   Ollama   : ${process.env.OLLAMA_HOST}`);
});
