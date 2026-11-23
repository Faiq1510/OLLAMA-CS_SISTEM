// src/main.js
import "./style.css";
import { renderChatModal } from "./components/chatmodal.js";
import { initMatrixDecryption } from "./modules/matrixlogo.js";
import { initRotatingTagline } from "./modules/wordRotator.js";
import { initStitchParallax } from "./modules/heroParallax.js";
import { initKatalogFilter } from "./modules/katalogFilter.js";
import { initChatWidget } from "./modules/chatWidget.js";

// Inisialisasi semua modul saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
  renderChatModal(); // 2. WAJIB DI AWAL: Suntikkan modal ke DOM dulu!
  initMatrixDecryption();
  initRotatingTagline();
  initStitchParallax();
  initKatalogFilter();
  initChatWidget();
});
