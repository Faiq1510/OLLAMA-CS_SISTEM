// test-alur.js
const fs = require("fs");
const path = require("path");

async function main() {
  // 1. Baca data FAQ dari file JSON
  const faqPath = path.join(__dirname, "data", "faq.json");
  const rawData = fs.readFileSync(faqPath, "utf-8");
  const faqs = JSON.parse(rawData);

  // 2. Rangkai menjadi System Prompt (Instruksi ketat anti-halusinasi)
  let contextFaq =
    "Berikut adalah basis pengetahuan resmi yang WAJIB kamu patuhi:\n";
  faqs.forEach((item, index) => {
    contextFaq += `${index + 1}. Tanya: ${item.pertanyaan}\n   Jawab: ${item.jawaban}\n`;
  });

  const systemPrompt = `Kamu adalah Customer Service profesional untuk Jasa Pembuatan Website.
Tugasmu:
- Jawab pertanyaan calon klien dengan ramah, sopan, dan dalam Bahasa Indonesia.
- Jawab HANYA berdasarkan basis pengetahuan FAQ berikut.
- Jika informasi tidak ada di dalam FAQ, katakan dengan jujur bahwa Anda belum memiliki informasi tersebut dan sarankan menghubungi WhatsApp resmi 0812-3456-7890. JANGAN mengarang jawaban.

${contextFaq}`;

  // 3. Pertanyaan uji coba dari calon klien
  const pertanyaanUser = "Berapa harga ayam geprek yang ada?";
  console.log(`[User]: ${pertanyaanUser}\n`);

  console.log("Sedang mengirim ke Ollama (qwen2.5:3b)...");
  const startTime = Date.now();

  // 4. Panggil API Ollama lokal
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "qwen2.5:3b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: pertanyaanUser },
      ],
      stream: false,
    }),
  });

  const data = await response.json();
  const latency = ((Date.now() - startTime) / 1000).toFixed(2);

  // 5. Tampilkan hasil balasan CS
  console.log(`\n[CS Bot (${latency}s)]:`);
  console.log(data.message.content);
}

main().catch((err) => console.error("Error:", err.message));
