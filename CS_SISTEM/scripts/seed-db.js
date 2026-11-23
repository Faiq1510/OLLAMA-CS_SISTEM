// scripts/seed-db.js
// Tugas: Membuat tabel 'faqs' dan memigrasikan 100 data dummy ke PostgreSQL

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const fs = require("fs");
const { query, pool } = require("../src/config/db");

async function seedDatabase() {
  console.log("=== Memulai Inisialisasi Database CS (100 Data) ===");
  console.log(
    `Target Database: ${process.env.DB_NAME} di ${process.env.DB_HOST}:${process.env.DB_PORT}`,
  );
  console.log(`User: ${process.env.DB_USER}`);

  try {
    // 1. Buat tabel faqs jika belum ada
    console.log("\n1. Membuat skema tabel 'faqs'...");
    await query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id VARCHAR(20) PRIMARY KEY,
        kategori VARCHAR(50) NOT NULL,
        pertanyaan TEXT NOT NULL,
        jawaban TEXT NOT NULL,
        tags VARCHAR(150),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("   Tabel 'faqs' berhasil diverifikasi/dibuat.");

    // 2. Baca file data/faqs_dummy_100.json
    console.log("\n2. Membaca berkas data dummy JSON...");
    const jsonPath = path.join(__dirname, "..", "data", "faqs_dummy_100.json");
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`File tidak ditemukan di ${jsonPath}`);
    }

    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const faqs = JSON.parse(rawData);
    console.log(`   Ditemukan total ${faqs.length} data FAQ.`);

    // 3. Masukkan data ke PostgreSQL menggunakan Upsert
    console.log("\n3. Memasukkan data ke tabel 'faqs'...");
    let count = 0;
    for (const item of faqs) {
      await query(
        `
        INSERT INTO faqs (id, kategori, pertanyaan, jawaban, tags)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE 
        SET kategori = EXCLUDED.kategori,
            pertanyaan = EXCLUDED.pertanyaan,
            jawaban = EXCLUDED.jawaban,
            tags = EXCLUDED.tags;
      `,
        [
          item.id,
          item.kategori,
          item.pertanyaan,
          item.jawaban,
          item.tags || "",
        ],
      );
      count++;
    }

    console.log(
      `\n Sukses! Berhasil memasukkan ${count} data dummy ke database.`,
    );
  } catch (error) {
    console.error("\n Terjadi kendala saat migrasi:", error.message);
  } finally {
    await pool.end();
  }
}

seedDatabase();
