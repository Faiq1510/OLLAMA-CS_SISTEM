---
name: webstudio-cs-system-guide
description: Panduan arsitektur, batasan teknologi, dan tata cara pengembangan sistem CS WebStudio AI berbasis Node.js, Ollama lokal, dan JSON knowledge base.
---

# Panduan Arsitektur & Aturan Sistem CS AI (WebStudio)

Dokumen ini berfungsi sebagai acuan resmi (*knowledge contract*) bagi siapa saja (termasuk AI Assistant dan developer) yang mengembangkan atau memelihara sistem CS ini.

---

## 📌 Batasan Kritis (Strict Constraints)

Berdasarkan arahan resmi Project Manager (PM):

1. **Backend Murni Node.js**:
   - Dilarang beralih ke Laravel atau framework bahasa lain.
   - Endpoint utama adalah `POST /api/chat`.
2. **Tanpa Database Relasional (No PostgreSQL)**:
   - Dilarang memasang atau mewajibkan database SQL (PostgreSQL, MySQL, dsb).
   - Seluruh data knowledge/FAQ wajib disimpan dalam format berkas flat JSON (`data/faq.json`).
3. **Model AI Lokal & Hemat Sumber Daya**:
   - Wajib menggunakan **Ollama** lokal (`http://localhost:11434`).
   - Model acuan utama adalah `qwen2.5:3b` (~1.9 GB VRAM). Jangan menggunakan model besar yang membebani laptop developer tanpa izin.
4. **Anti-Halusinasi Terikat Knowledge**:
   - AI dilarang mengarang harga, estimasi waktu, atau jaminan di luar data `faq.json`.
   - Pertanyaan di luar konteks harus ditolak secara sopan dan diarahkan ke kontak WhatsApp resmi.

---

## 🧩 Alur Kerja Data (Request Lifecycle)

```
[User di Widget Browser]
         │  (Ketik pesan atau klik kartu saran)
         ▼
[Vite Dev Server (Port 5173)]
         │  (Reverse proxy /api ke port 3000)
         ▼
[Express Server (src/server.js)]
         │
         ├── 1. Baca data/faq.json via faqservice.js
         ├── 2. Susun System Prompt + User Message
         │
         ▼
[Ollama API (http://localhost:11434/api/chat)]
         │  (Model qwen2.5:3b memproses inferensi)
         ▼
[Response JSON { answer: "..." }]
         │
         ▼
[Render Bubble Chat di CS_WIDGET]
```

---

## 🎨 Standar Frontend Widget (`CS_WIDGET`)

- **Gaya Desain**: Terang (*Light Mode*), bersih (*clean*), terinspirasi dari pola onboarding *Orbita AI*.
- **Transisi State**:
  - *Empty State (Hero)*: Menampilkan avatar glowing, teks sapaan, 3 Suggestion Cards, dan Action Pills.
  - *Chat State*: Terpicu otomatis saat pesan pertama dikirim atau kartu saran diklik.
- **Kepatuhan CSS**:
  - Menggunakan Tailwind CSS v4 (`@import "tailwindcss";`).
  - Animasi harus halus (*smooth deceleration*) tanpa glitch garis kotak (*outline/border artifact*).
