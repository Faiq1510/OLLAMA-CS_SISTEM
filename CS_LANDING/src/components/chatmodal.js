// src/components/chatmodal.js
// Tugas: Membuat dan merender kerangka HTML Modal CS AI (Tema Deep Midnight Blue to Black)

export function renderChatModal() {
  const modalHTML = `
    <div
      id="aiChatModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-300"
      aria-hidden="true"
    >
      <div id="aiChatBackdrop" class="absolute inset-0"></div>

      <!-- Container Dialog: Gradien Biru Gelap (#0A1128) menuju Hitam Pekat (#020617) -->
      <div
        id="aiChatBox"
        class="relative w-full max-w-4xl h-[88vh] bg-gradient-to-b from-[#0A1128] via-[#050C1A] to-[#020617] shadow-2xl border border-blue-900/30 overflow-hidden flex flex-col z-10 matched-geometry-box rounded-3xl"
      >
        <!-- Modal Top Header Kaca Gelap -->
        <div class="relative z-10 w-full bg-[#0A1128]/70 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 h-14 flex items-center justify-between shrink-0 morph-inner">
          <div class="flex items-center gap-3">
            <div class="relative w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
              <img src="/avatar.png" alt="Mascot Icon" class="w-full h-full object-cover" />
              <span class="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-slate-900 rounded-full"></span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-white font-semibold text-sm">MicroData Assistant</span>
              <span class="px-2 py-0.5 text-[10px] font-medium text-orange-400 bg-orange-950/50 border border-orange-500/20 rounded-full inline-flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                AI Support
              </span>
            </div>
          </div>
          <button
            id="closeAiChatBtn"
            type="button"
            class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer text-sm font-bold"
            title="Tutup dialog"
          >✕</button>
        </div>

        <!-- Chat Viewport -->
        <div id="chatScroll" class="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center justify-between morph-inner" style="scrollbar-width: thin">

          <!-- HERO STATE -->
          <div id="heroState" class="w-full max-w-2xl mx-auto my-auto py-4">

            <!-- Centerpiece Animated Soft Orange Orb -->
            <div class="pop-stagger-item delay-b2t-mascot animate-stagger-active text-center mb-6" id="aiOrbWrapper">
              <div class="relative flex items-center justify-center mx-auto select-none py-2">
                <div class="ai-orb-aura"></div>
                <div class="ai-center-orb" id="mascotElement" title="MicroData AI Assistant">
                  <div class="ai-orb-plasma"></div>
                  <div class="ai-orb-wave"></div>
                  <div class="ai-orb-glass-lens"></div>
                </div>
              </div>
              <div class="flex justify-center items-center -mt-1 pointer-events-none select-none">
                <div class="ai-orb-contact-shadow"></div>
              </div>
            </div>

            <!-- Teks Sapaan Kontras Terang -->
            <div class="pop-stagger-item delay-b2t-greeting animate-stagger-active text-center mb-6" id="greetingWrapper">
              <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">Hi, there!</h2>
              <p class="text-slate-400 text-xs sm:text-sm">Ada yang bisa kami bantu seputar jasa pembuatan website &amp; produk digital?</p>
            </div>

                       <!-- Suggestion Cards Crystal Clear Glassmorphism -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full" id="cardsGridSection">

              <!-- KARTU 1: Paket & Biaya -->
              <div
                data-prompt="Berapa estimasi biaya pembuatan website Landing Page dan Toko Online?"
                class="suggestion-card pop-stagger-item delay-b2t-card1 animate-stagger-active glass-card-crystal rounded-2xl p-4 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div class="font-semibold text-white text-xs mb-1">
                    Paket &amp; Biaya Web
                  </div>
                  <div class="text-[11px] text-slate-300 line-clamp-2">
                    Cek estimasi biaya Landing Page, Toko Online, dan Company Profile.
                  </div>
                </div>
                <div class="mt-3 text-[11px] font-medium text-orange-400 flex items-center justify-between">
                  <span>Cek harga</span>
                  <span>→</span>
                </div>
              </div>

              <!-- KARTU 2: Garansi & Support -->
              <div
                data-prompt="Berapa lama garansi yang diberikan setelah website jadi dan apa saja cakupannya?"
                class="suggestion-card pop-stagger-item delay-b2t-card2 animate-stagger-active glass-card-crystal rounded-2xl p-4 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div class="font-semibold text-white text-xs mb-1">
                    Garansi &amp; Layanan
                  </div>
                  <div class="text-[11px] text-slate-300 line-clamp-2">
                    Garansi 30 hari bug &amp; maintenance pasca serah terima website.
                  </div>
                </div>
                <div class="mt-3 text-[11px] font-medium text-orange-400 flex items-center justify-between">
                  <span>Lihat garansi</span>
                  <span>→</span>
                </div>
              </div>

              <!-- KARTU 3: Alur Pemesanan -->
              <div
                data-prompt="Bagaimana alur dan tahapan pemesanan website di MicroData?"
                class="suggestion-card pop-stagger-item delay-b2t-card3 animate-stagger-active glass-card-crystal rounded-2xl p-4 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div class="font-semibold text-white text-xs mb-1">
                    Alur Pemesanan
                  </div>
                  <div class="text-[11px] text-slate-300 line-clamp-2">
                    Tahapan konsultasi, DP 50%, pengerjaan, hingga pelunasan.
                  </div>
                </div>
                <div class="mt-3 text-[11px] font-medium text-orange-400 flex items-center justify-between">
                  <span>Alur order</span>
                  <span>→</span>
                </div>
              </div>

            </div>
          </div>

          <!-- CHAT STATE -->
          <div id="chatState" class="hidden w-full max-w-2xl space-y-4 py-4 mb-auto">
            <div id="messagesList" class="space-y-4"></div>
          </div>

          <!-- INPUT FORM DARK MODE -->
          <div class="w-full max-w-2xl mt-4 shrink-0 pop-stagger-item delay-b2t-input animate-stagger-active">
            <form id="chatForm" class="glass-input-crystal rounded-2xl p-3 flex flex-col justify-between min-h-[90px]">
              <textarea
                id="messageInput"
                rows="1"
                placeholder="Tanyakan apapun seputar pembuatan website..."
                class="w-full resize-none border-0 p-1.5 text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:ring-0 focus:outline-none bg-transparent"
              ></textarea>
              <div class="flex justify-end items-center pt-2">
                <button
                  id="sendBtn"
                  type="submit"
                  class="glass-btn-crystal inline-flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
                >
                  <span>Kirim</span>
                  <span>&#8594;</span>
                </button>
              </div>
            </form>
          </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}
