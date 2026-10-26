# Sistem Customer Service AI (WebStudio Support)

Sistem Customer Service interaktif berbasis AI lokal (**Ollama**) dengan arsitektur REST API **Node.js** dan frontend modern **Vite + Tailwind CSS v4**.

Sistem ini dirancang khusus untuk mematuhi instruksi Project Manager (PM):
- **AI Engine**: Ollama lokal dengan model ringan (`qwen2.5:3b`) sesuai spesifikasi laptop (hemat VRAM).
- **Backend API**: Node.js + Express (tanpa Laravel).
- **Knowledge Base**: Berkas JSON lokal (`data/faq.json`), tanpa ketergantungan PostgreSQL/database SQL.
- **Frontend Widget**: Tampilan desktop modern bergaya *Orbita AI Onboarding* dengan Suggestion Cards interaktif dan transisi mulus ke gelembung chat.

---

## 🏗️ Arsitektur Folder

```text
D:\BELAJAR\PROJEK\
├── CS_SISTEM/              # Backend REST API (Node.js + Express)
│   ├── data/
│   │   └── faq.json        # Knowledge base FAQ & paket layanan
│   ├── src/
│   │   ├── server.js       # Express server & endpoint POST /api/chat
│   │   └── services/
│   │       ├── faqservice.js    # Modul pembaca JSON & builder system prompt
│   │       └── ollamaservice.js # Modul integrasi ke Ollama API lokal
│   ├── .env                # Port & model configuration
│   └── package.json
│
└── CS_WIDGET/              # Frontend User Interface (Vite + Tailwind CSS)
    ├── index.html          # Layout onboarding & chat state
    ├── src/
    │   ├── main.js         # Logika transisi, autosize input, & fetch API
    │   └── style.css       # Tailwind v4 import & custom smooth keyframes
    ├── vite.config.js      # Konfigurasi proxy /api -> port 3000
    └── package.json
```

---

## 🚀 Panduan Menjalankan Sistem

### 1. Pastikan Ollama Berjalan
Pastikan aplikasi **Ollama** aktif di komputer Anda dan model telah tersedia:
```bash
ollama run qwen2.5:3b
```
Endpoint default Ollama berjalan pada: `http://localhost:11434`.

---

### 2. Jalankan Backend (`CS_SISTEM`)
Buka terminal baru di folder backend:
```bash
cd D:\BELAJAR\PROJEK\CS_SISTEM
npm install
node src/server.js
```
*Server API backend akan aktif di: `http://localhost:3000`.*

---

### 3. Jalankan Frontend (`CS_WIDGET`)
Buka terminal kedua di folder frontend:
```bash
cd D:\BELAJAR\PROJEK\CS_WIDGET
npm install
npm run dev
```
*Frontend akan aktif di: `http://localhost:5173` (atau port aktif berikutnya).*

---

## ⚙️ Konfigurasi Environment (`.env`)

Pada folder `CS_SISTEM/.env`:
```env
PORT=3000
OLLAMA_HOST=http://localhost:11434
DEFAULT_MODEL=qwen2.5:3b
```

---

## 🛡️ Anti-Halusinasi & Knowledge Base

Sistem CS tidak akan mengarang jawaban di luar data yang tertulis di `data/faq.json`. 
Jika pengunjung menanyakan hal di luar konteks layanan pembuatan website WebStudio, bot akan menolak secara sopan dan mengarahkan kontak langsung ke tim representatif melalui WhatsApp resmi.
