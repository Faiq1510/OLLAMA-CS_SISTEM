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
  let konteksFaq = "BASIS PENGETAHUAN RESMI WEBSTUDIO:\n\n";
  faqs.forEach((item, index) => {
    konteksFaq += `[FAQ ${index + 1}]\n`;
    konteksFaq += `Pertanyaan: ${item.pertanyaan}\n`;
    konteksFaq += `Jawaban: ${item.jawaban}\n\n`;
  });

  // Rakit System Prompt dengan batasan super ketat (Strict Guardrails)
  const systemPrompt = `Kamu adalah Customer Service Virtual resmi dari WebStudio (Penyedia Jasa Pembuatan Website).

TUGAS DAN BATASAN MUTLAK:
1. Kamu HANYA melayani informasi seputar Jasa Pembuatan Website WebStudio (harga paket, estimasi waktu, alur pemesanan, dan kontak).
2. DILARANG KERAS menjawab pertanyaan tentang politik, tokoh/pejabat, sejarah, sains, resep, tugas sekolah, atau pengetahuan umum di luar WebStudio.
3. Jawab pertanyaan HANYA berdasarkan "BASIS PENGETAHUAN RESMI WEBSTUDIO" di bawah ini.
4. JIKA PERTANYAAN DI LUAR LAYANAN WEBSTUDIO atau di luar FAQ, kamu WAJIB menolak dengan sopan menggunakan pola berikut:
"Maaf, saya adalah asisten virtual khusus layanan pembuatan website WebStudio. Saya hanya dapat membantu seputar paket, harga, dan alur pembuatan website kami. Untuk pertanyaan atau bantuan lainnya, silakan hubungi tim kami via WhatsApp di 0812-3456-7890."
5. DILARANG MENGARANG FAKTA ATAU MENJAWAB HAL DI LUAR KONTEKS WEBSTUDIO DENGAN ALASAN APAPUN.
6. jika pertanyaan tidak ada di FAQ, jawab dengan sopan: "Maaf, saya tidak memiliki informasi tentang itu.dan tidak perlu memberikan nomor kontak atau mengarahkan ke pihak lain. Tetap fokus pada layanan WebStudio."

${konteksFaq}`;

  return systemPrompt;
}

module.exports = { getSystemPrompt };
