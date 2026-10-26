// faqService.js
// Tugas: membaca data/faq.json dan merakit System Prompt untuk model AI

const fs = require("fs");
const path = require("path");

// Path ke file FAQ (dihitung dari root proyek)
const FAQ_PATH = path.join(__dirname, "..", "..", "data", "faq.json");

/**
 * Membaca faq.json dan mengubahnya menjadi teks System Prompt
 * yang dikirim ke model AI sebagai instruksi utama.
 * @returns {string} System Prompt lengkap
 */
function getSystemPrompt() {
  const rawData = fs.readFileSync(FAQ_PATH, "utf-8");
  const faqs = JSON.parse(rawData);

  // Susun daftar FAQ menjadi teks terstruktur
  let konteksFaq =
    "Berikut basis pengetahuan resmi yang WAJIB kamu patuhi:\n\n";
  faqs.forEach((item, index) => {
    konteksFaq += `${index + 1}. Tanya : ${item.pertanyaan}\n`;
    konteksFaq += `   Jawab : ${item.jawaban}\n\n`;
  });

  // Rakit System Prompt lengkap dengan aturan anti-halusinasi
  const systemPrompt = `Kamu adalah Customer Service profesional untuk Jasa Pembuatan Website.

Aturan yang WAJIB dipatuhi:
- Jawab pertanyaan dengan ramah, sopan, dan dalam Bahasa Indonesia.
- Jawab HANYA berdasarkan basis pengetahuan FAQ di bawah ini.
- Jika pertanyaan berada di luar FAQ, jawab jujur bahwa informasi belum tersedia \
dan arahkan ke WhatsApp 0812-3456-7890. JANGAN mengarang jawaban.

${konteksFaq}`;

  return systemPrompt;
}

module.exports = { getSystemPrompt };
