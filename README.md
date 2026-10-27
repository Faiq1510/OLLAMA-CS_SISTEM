# Panduan Inisiasi Model Ollama & Konfigurasi API Lokal

Dokumen ini memuat alur langkah demi langkah mulai dari persiapan model AI di Ollama lokal hingga konfigurasinya pada REST API Node.js.

---

## 1. Inisiasi Model di Ollama Lokal

### Langkah 1.1: Pastikan Layanan Ollama Aktif
Pastikan aplikasi Ollama sudah terpasang dan berjalan di komputer. Secara default, Ollama membuka port lokal:
```text
http://localhost:11434
```
Untuk memverifikasi bahwa layanan aktif, buka terminal atau browser:
```bash
curl http://localhost:11434
```
*Respons sukses:* `Ollama is running`.

### Langkah 1.2: Unduh dan Jalankan Model Ringan (`qwen2.5:3b`)
Jalankan perintah berikut di terminal untuk mengunduh (*pull*) dan menginisialisasi model:
```bash
ollama run qwen2.5:3b
```
- Model `qwen2.5:3b` berukuran ~1.9 GB VRAM, sesuai untuk spesifikasi laptop standar.
- Setelah proses unduhan selesai, model siap menerima panggilan API.

---

## 2. Konfigurasi Environment Backend (`.env`)

Pada folder `CS_SISTEM`, buat atau sesuaikan berkas `.env` agar mengarah ke host dan model lokal tersebut:

```env
PORT=3000
OLLAMA_HOST=http://localhost:11434
DEFAULT_MODEL=qwen2.5:3b
```

---

## 3. Konfigurasi Pemanggilan API Ollama di Node.js

Pemanggilan model lokal dilakukan melalui endpoint bawaan Ollama `POST /api/chat`.

### Implementasi pada `src/services/ollamaservice.js`:
```javascript
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
        temperature: 0.1, // Nilai rendah agar jawaban konsisten dan tidak berhalusinasi
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.message.content;
}

module.exports = { chat };
```

---

## 4. Pengujian Koneksi API

Jalankan server backend:
```bash
cd D:\BELAJAR\PROJEK\CS_SISTEM
node src/server.js
```

Kirim pengujian request menggunakan curl atau REST client:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Halo, apa saja layanan yang tersedia?"}'
```
*Respons:* API akan mengembalikan jawaban berbasis data FAQ dari model `qwen2.5:3b` lokal.
