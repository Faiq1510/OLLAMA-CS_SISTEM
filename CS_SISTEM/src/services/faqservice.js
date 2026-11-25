// src/services/faqservice.js
// Tugas: Mengambil data FAQ dari database PostgreSQL secara dinamis dan merakit System Prompt

const { query } = require("../config/db");

// Kata-kata yang terlalu umum / muncul di hampir semua data FAQ
// Dibuang dari keyword search agar tidak mencemari hasil
const STOPWORDS = new Set([
  "microdata", "apakah", "bagaimana", "berapa", "dimana", "kapan",
  "siapa", "mengapa", "kenapa", "yang", "dan", "atau", "untuk",
  "bisa", "dapat", "ada", "tidak", "jika", "kalau", "dengan",
  "dari", "pada", "ini", "itu", "apa", "saja", "nya", "kami",
  "kita", "anda", "klien", "cara", "juga", "sudah", "akan",
  "setelah", "sebelum", "dalam", "oleh", "saat", "maka"
]);

/**
 * Mengambil data FAQ dari PostgreSQL berdasarkan relevansi pesan pengguna
 * @param {string} userMessage - Pesan/pertanyaan yang dikirim pengguna
 * @returns {Promise<string>} System Prompt lengkap dengan konteks spesifik
 */
async function getSystemPrompt(userMessage = "") {
  let faqs = [];

  // 1. Ekstrak kata kunci — buang stopwords dan kata pendek
  const cleanWords = userMessage
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));

  console.log(`[FAQ] Keywords setelah filter: ${cleanWords.join(", ") || "(kosong)"}`);

  if (cleanWords.length > 0) {
    // 2. Susun kondisi WHERE
    const whereClauses = cleanWords
      .map(
        (_, i) =>
          `(pertanyaan ILIKE $${i + 1} OR tags ILIKE $${i + 1} OR kategori ILIKE $${i + 1})`
      )
      .join(" OR ");

    // 3. Susun skor relevansi — baris yang cocok dengan lebih banyak keyword
    //    mendapat skor lebih tinggi dan muncul di atas
    const scoreParts = cleanWords
      .map(
        (_, i) =>
          `(CASE WHEN pertanyaan ILIKE $${i + 1} THEN 2 ELSE 0 END) +
           (CASE WHEN tags ILIKE $${i + 1} THEN 1 ELSE 0 END) +
           (CASE WHEN kategori ILIKE $${i + 1} THEN 1 ELSE 0 END)`
      )
      .join(" + ");

    const params = cleanWords.map((word) => `%${word}%`);

    const searchResult = await query(
      `SELECT id, kategori, pertanyaan, jawaban,
              (${scoreParts}) AS skor
       FROM faqs
       WHERE ${whereClauses}
       ORDER BY skor DESC
       LIMIT 12`,
      params
    );

    faqs = searchResult.rows;
    console.log(`[FAQ] Hasil pencarian: ${faqs.length} baris`);
    if (faqs.length > 0) {
      console.log(`[FAQ] Top result: [${faqs[0].id}] skor=${faqs[0].skor} — ${faqs[0].pertanyaan.substring(0, 60)}`);
    }
  }

  // 4. Jika tidak ada kecocokan, ambil 15 FAQ inti sebagai default
  if (faqs.length === 0) {
    console.log("[FAQ] Tidak ada hasil — menggunakan default 15 FAQ");
    const defaultResult = await query(
      "SELECT id, kategori, pertanyaan, jawaban FROM faqs ORDER BY id ASC LIMIT 15"
    );
    faqs = defaultResult.rows;
  }

  // 5. Susun daftar FAQ ke teks konteks
  let konteksFaq = "BASIS PENGETAHUAN RESMI MICRODATA (DARI DATABASE):\n\n";
  faqs.forEach((item, index) => {
    konteksFaq += `[DATA ${index + 1} - ${item.kategori}]\n`;
    konteksFaq += `Pertanyaan: ${item.pertanyaan}\n`;
    konteksFaq += `Jawaban: ${item.jawaban}\n\n`;
  });

  // 6. Rakit System Prompt
  const systemPrompt = `Kamu adalah Customer Service Virtual resmi dari MicroData (Penyedia Jasa Pembuatan Website & Produk Digital).

TUGAS DAN BATASAN MUTLAK:
1. Kamu HANYA melayani informasi seputar layanan MicroData (Jasa Pembuatan Web, Template Digital, Add-on Fitur, Cloud Hosting/VPS, estimasi waktu, harga, dan alur pemesanan).
2. DILARANG KERAS menjawab pertanyaan tentang politik, tokoh/pejabat, sejarah, sains, resep, tugas sekolah, atau pengetahuan umum di luar MicroData.
3. Jawab pertanyaan dengan ramah, profesional, dan padat HANYA berdasarkan "BASIS PENGETAHUAN RESMI MICRODATA" di bawah ini.
4. JIKA PERTANYAAN DI LUAR LAYANAN MICRODATA atau tidak ada di data, jawab dengan sopan:
"Maaf, saya adalah asisten virtual khusus layanan MicroData. Saya hanya dapat membantu seputar paket website, template, hosting, dan pemesanan kami. Untuk pertanyaan lainnya, silakan hubungi tim kami via WhatsApp di 0812-3456-7890."
5. DILARANG MENGARANG FAKTA ATAU MENAMBAHKAN HARGA/FITUR YANG TIDAK ADA DI BASIS DATA.

${konteksFaq}`;

  return systemPrompt;
}

module.exports = { getSystemPrompt };
