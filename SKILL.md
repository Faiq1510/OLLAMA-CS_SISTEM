---
name: webstudio-cs-system-guide
description: Panduan arsitektur, batasan teknologi, dan tata cara pengembangan sistem CS WebStudio AI berbasis Node.js, PostgreSQL RAG, dan Ollama lokal.
---

# Panduan Arsitektur & Aturan Sistem CS AI (MicroData WebStudio)

Dokumen ini berfungsi sebagai acuan resmi (*knowledge contract*) bagi siapa saja (developer & AI Assistant) yang mengembangkan atau memelihara sistem CS ini.

---

## 📌 Batasan & Prinsip Desain Kritis

1. **Backend Murni Node.js (CommonJS)**:
   - Endpoint utama adalah `POST /api/chat`.
   - Menggunakan Express.js tanpa framework bahasa lain.
2. **Basis Data Pengetahuan (RAG PostgreSQL)**:
   - Data knowledge resmi tersimpan di database PostgreSQL (`webstudio_db`), tabel `faqs` (100 entri).
   - Menggunakan query pencarian berbobot (*weighted scoring*) dan pembersihan stopword bahasa Indonesia.
   - Master dataset tersimpan di `data/faqs_dummy_100.json` dan diinisialisasi melalui `npm run seed`.
3. **Model AI Lokal & Hemat Sumber Daya**:
   - Wajib menggunakan **Ollama** lokal (`http://localhost:11434`).
   - Model acuan utama adalah `qwen2.5:3b` (~1.9 GB VRAM), ramah untuk spesifikasi laptop standar.
4. **Anti-Halusinasi Terikat Knowledge (Strict Guardrails)**:
   - AI dilarang mengarang harga, estimasi waktu, atau jaminan di luar data FAQ resmi.
   - Pertanyaan di luar konteks harus ditolak secara sopan dan diarahkan ke kontak WhatsApp resmi MicroData.
5. **Frontend Ringan & Terpisah (Vite ESM)**:
   - `CS_LANDING` beroperasi di port 5175 dan meneruskan panggilan `/api` via reverse proxy Vite ke `CS_SISTEM` di port 3000.
   - Menggunakan Tailwind CSS v4, Crystal Glassmorphism, dan arsitektur komponen DOM modular.
