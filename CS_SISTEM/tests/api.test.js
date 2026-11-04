// tests/api.test.js
// Tugas: Menguji endpoint POST /api/chat, Validasi 400, dan Limit Test 429 (Rate Limiter)

const request = require("supertest");
const app = require("../src/server");

// 1. Mocking ollamaservice agar tidak memanggil Ollama sungguhan saat testing
jest.mock("../src/services/ollamaservice", () => ({
  chat: jest
    .fn()
    .mockResolvedValue("Halo! Ini balasan mock otomatis untuk pengujian."),
}));

describe("🧪 3. Integration & Limit Testing: REST API /api/chat", () => {
  // ─── PENGUJIAN 1: ALUR SUKSES NORMAL (200 OK) ─────────────────────────────
  it("Harus mengembalikan status 200 dan jawaban AI jika input valid", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({ message: "Halo, apa saja paketnya?" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("answer");
    expect(res.body).toHaveProperty("sessionId");
    expect(typeof res.body.sessionId).toBe("string");
  });

  // ─── PENGUJIAN 2: VALIDASI INPUT (400 BAD REQUEST) ────────────────────────
  it("Harus menolak (status 400) jika pesan dikirim kosong atau hanya spasi", async () => {
    const res = await request(app).post("/api/chat").send({ message: "    " });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toContain("Pesan tidak boleh kosong");
  });

  it("Harus menolak (status 400) jika tipe data bukan string (misal: angka)", async () => {
    const res = await request(app).post("/api/chat").send({ message: 12345 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // ─── PENGUJIAN 3: LIMIT TEST PANJANG KARAKTER (400 BAD REQUEST) ───────────
  it("Harus menolak (status 400) jika pesan melebihi batas 500 karakter", async () => {
    // Buat string panjang berisi 505 karakter
    const teksPanjang = "A".repeat(505);

    const res = await request(app)
      .post("/api/chat")
      .send({ message: teksPanjang });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain("Maksimal 500 karakter");
  });

  // ─── PENGUJIAN 4: LIMIT TEST RATE LIMITER (429 TOO MANY REQUESTS) ─────────
  it("Harus menolak dengan status 429 jika request melebihi kuota 10 request/menit", async () => {
    let lastResponse = null;

    // Tembak API sebanyak 11 kali secara berturut-turut
    // (Batas kita di rateLimiter.js adalah max: 10 per menit)
    for (let i = 1; i <= 11; i++) {
      lastResponse = await request(app)
        .post("/api/chat")
        .send({ message: `Pesan uji spam ke-${i}` });
    }

    // Request ke-11 pasti terkena blokir rate limiter (HTTP 429)
    expect(lastResponse.statusCode).toBe(429);
    expect(lastResponse.body.error).toContain("Terlalu banyak permintaan chat");
  });
});
