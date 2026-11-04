// tests/unit.test.js
// Tugas: Menguji fungsi internal sessionService dan faqservice secara mandiri

const {
  getOrCreateSession,
  appendToSession,
  clearSession,
} = require("../src/services/sessionService");
const { getSystemPrompt } = require("../src/services/faqservice");

describe("1. Unit Testing: Session Service", () => {
  let createdSessionId = null;

  it("Harus membuat sessionId baru bertipe string jika tidak ada sessionId yang dikirim", () => {
    const session = getOrCreateSession(null);

    expect(session).toBeDefined();
    expect(typeof session.id).toBe("string");
    expect(session.id.length).toBeGreaterThan(0);
    expect(Array.isArray(session.history)).toBe(true);
    expect(session.history.length).toBe(0);

    // Simpan id untuk tes berikutnya
    createdSessionId = session.id;
  });

  it("Harus mengembalikan riwayat yang sama jika sessionId lama dikirimkan kembali", () => {
    // Tambah percakapan ke sesi tersebut
    appendToSession(
      createdSessionId,
      "Halo Budi",
      "Halo! Ada yang bisa dibantu?",
    );

    // Panggil ulang dengan ID yang sama
    const session = getOrCreateSession(createdSessionId);

    expect(session.id).toBe(createdSessionId);
    expect(session.history.length).toBe(2);
    expect(session.history[0]).toEqual({ role: "user", content: "Halo Budi" });
    expect(session.history[1]).toEqual({
      role: "assistant",
      content: "Halo! Ada yang bisa dibantu?",
    });
  });

  it("Harus memangkas riwayat jika melebihi batas maksimal (maksimal 10 pesan)", () => {
    // Tambahkan 6 pasang pesan (total 12 pesan)
    for (let i = 1; i <= 6; i++) {
      appendToSession(createdSessionId, `Pertanyaan ${i}`, `Jawaban ${i}`);
    }

    const session = getOrCreateSession(createdSessionId);

    // Karena MAX_HISTORY_MESSAGES = 10, panjang array tidak boleh lebih dari 10
    expect(session.history.length).toBeLessThanOrEqual(10);
  });

  it("Harus berhasil menghapus sesi ketika clearSession dipanggil", () => {
    clearSession(createdSessionId);

    // Ketika dipanggil lagi, sesi lama sudah hilang dan dibuatkan sesi baru dengan ID berbeda
    const newSession = getOrCreateSession(createdSessionId);
    expect(newSession.history.length).toBe(0);
  });
});

describe("🧪 2. Unit Testing: FAQ Service", () => {
  it("Harus berhasil merakit System Prompt dengan guardrail anti-halusinasi", () => {
    const prompt = getSystemPrompt();

    expect(typeof prompt).toBe("string");
    // Memastikan kata kunci guardrail ada di dalam system prompt
    expect(prompt).toContain("Customer Service");
    expect(prompt).toContain("0812-3456-7890");
    expect(prompt).toContain("BASIS PENGETAHUAN RESMI WEBSTUDIO");
  });
});
