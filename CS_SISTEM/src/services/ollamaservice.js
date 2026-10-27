// ollamaService.js
// Tugas: mengirim pesan ke Ollama lokal dan mengembalikan teks jawaban model AI

/**
 * Mengirim percakapan ke Ollama dan mendapatkan balasan dari model AI.
 * @param {Array} messages - Array riwayat pesan [ {role, content}, ... ]
 * @returns {string} Teks jawaban dari model AI
 */
async function chat(messages) {
  const ollamaHost = process.env.OLLAMA_HOST || "http://localhost:11434";
  const modelName = process.env.DEFAULT_MODEL || "qwen2.5:3b";

  const response = await fetch(`${ollamaHost}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: modelName,
      messages: messages,
      stream: false,
      options: {
        temperature: 0.1, // Nilai rendah agar model disiplin dan tidak halusinasi
      },
    }),
  });

  // Tangani jika Ollama tidak dapat dijangkau atau error
  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.message.content;
}

module.exports = { chat };
