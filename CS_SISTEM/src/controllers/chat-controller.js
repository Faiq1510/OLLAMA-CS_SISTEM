// src/controllers/chatController.js
// Tugas: Menangani logika alur chat dengan validasi, session terisolasi, dan Ollama

const { getSystemPrompt } = require("../services/faqservice");
const { chat } = require("../services/ollamaservice");
const {
  getOrCreateSession,
  appendToSession,
} = require("../services/sessionService");

// Batasan panjang maksimal karakter
const MAX_MESSAGE_LENGTH = 500;

async function handleChat(req, res) {
  try {
    const { message, sessionId } = req.body || {};

    // 1. Validasi Input
    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({
        error: "Pesan tidak boleh kosong dan harus berupa teks.",
      });
    }

    const cleanMessage = message.trim();
    if (cleanMessage.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `Pesan terlalu panjang. Maksimal ${MAX_MESSAGE_LENGTH} karakter.`,
      });
    }

    // 2. Ambil atau Buat Sesi Khusus Pengguna Ini
    const session = getOrCreateSession(sessionId);

    // 3. Ambil System Prompt FAQ
    const systemPrompt = getSystemPrompt();

    // 4. Susun Pesan Khusus Sesi Pengguna Ini Saja
    const messages = [
      { role: "system", content: systemPrompt },
      ...session.history,
      { role: "user", content: cleanMessage },
    ];

    // 5. Panggil Model AI Ollama
    const jawaban = await chat(messages);

    // 6. Simpan Pesan Baru ke Sesi Pengguna Ini
    appendToSession(session.id, cleanMessage, jawaban);

    // 7. Kembalikan Jawaban beserta sessionId ke Klien
    return res.json({
      answer: jawaban,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("[ChatController Error]:", error.message);

    if (
      error.message.includes("fetch failed") ||
      error.message.includes("ECONNREFUSED")
    ) {
      return res.status(503).json({
        error:
          "Layanan AI (Ollama) sedang offline. Pastikan Ollama sudah dijalankan.",
      });
    }

    return res.status(500).json({
      error: "Terjadi kesalahan pada server saat memproses pertanyaan Anda.",
    });
  }
}

module.exports = { handleChat };
