// src/services/sessionService.js
// Tugas: Mengelola riwayat percakapan per user berdasarkan sessionId

const crypto = require("crypto");

// Menyimpan sesi di memori: Map<sessionId, Array<pesan>>
const sessions = new Map();

// Batas maksimal riwayat percakapan per sesi yang disimpan (misal 10 pesan terakhir)
// agar prompt tidak melebihi konteks memori Ollama
const MAX_HISTORY_MESSAGES = 10;

/**
 * Mengambil atau membuat sesi percakapan baru
 * @param {string|null} sessionId - ID sesi dari klien (jika ada)
 * @returns {{ id: string, history: Array }}
 */
function getOrCreateSession(sessionId) {
  // Jika sessionId diberikan dan ada di memori, gunakan sesi yang ada
  if (sessionId && sessions.has(sessionId)) {
    return {
      id: sessionId,
      history: sessions.get(sessionId),
    };
  }

  // Jika tidak ada atau belum terdaftar, buat sessionId baru yang unik
  const newSessionId = crypto.randomUUID();
  const emptyHistory = [];
  sessions.set(newSessionId, emptyHistory);

  return {
    id: newSessionId,
    history: emptyHistory,
  };
}

/**
 * Menambahkan percakapan baru ke sesi tertentu
 * @param {string} sessionId
 * @param {string} userMessage
 * @param {string} botReply
 */
function appendToSession(sessionId, userMessage, botReply) {
  if (!sessions.has(sessionId)) return;

  const history = sessions.get(sessionId);
  history.push({ role: "user", content: userMessage });
  history.push({ role: "assistant", content: botReply });

  // Pangkas riwayat jika melebihi batas maksimal agar hemat token/memori
  if (history.length > MAX_HISTORY_MESSAGES) {
    history.splice(0, history.length - MAX_HISTORY_MESSAGES);
  }
}

/**
 * Menghapus sesi jika user memulai chat baru
 * @param {string} sessionId
 */
function clearSession(sessionId) {
  if (sessionId) {
    sessions.delete(sessionId);
  }
}

module.exports = {
  getOrCreateSession,
  appendToSession,
  clearSession,
};
