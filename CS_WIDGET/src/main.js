import "./style.css";

// ── 1. ELEMEN DOM ──────────────────────────────────────────
const exitBtn = document.getElementById("exitBtn");
const newChatBtn = document.getElementById("newChatBtn");
const heroState = document.getElementById("heroState");
const chatState = document.getElementById("chatState");
const chatScroll = document.getElementById("chatScroll");
const messagesList = document.getElementById("messagesList");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let isChatActive = false;

// ── 2. LOGIKA TRANSISI HERO KE CHAT ────────────────────────
function switchToChatState() {
  if (!isChatActive) {
    heroState.classList.add("hidden");
    chatState.classList.remove("hidden");
    if (newChatBtn) newChatBtn.classList.remove("hidden");
    isChatActive = true;
  }
}

function resetToHeroState() {
  messagesList.innerHTML = "";
  chatState.classList.add("hidden");
  heroState.classList.remove("hidden");
  isChatActive = false;
  messageInput.value = "";
  messageInput.style.height = "auto";
}

if (newChatBtn) {
  newChatBtn.addEventListener("click", () => {
    if (confirm("Mulai sesi chat baru dan bersihkan riwayat?")) {
      resetToHeroState();
    }
  });
}

if (exitBtn) {
  exitBtn.addEventListener("click", () => {
    if (confirm("Apakah Anda ingin keluar dari sesi percakapan?")) {
      window.history.back();
    }
  });
}

// ── 3. HELPER CHAT ─────────────────────────────────────────
function scrollToBottom() {
  setTimeout(() => {
    chatScroll.scrollTop = chatScroll.scrollHeight;
  }, 50);
}

function getCurrentTime() {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[tag] || tag
  );
}

// ── 4. RENDER BUBBLE CHAT ──────────────────────────────────
function appendUserMessage(text) {
  switchToChatState();
  const time = getCurrentTime();
  const wrapper = document.createElement("div");
  wrapper.className = "flex justify-end animate-fade-in";
  wrapper.innerHTML = `
    <div class="max-w-[85%] md:max-w-[70%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
      <p class="text-sm leading-relaxed whitespace-pre-wrap">${escapeHTML(text)}</p>
      <div class="flex items-center justify-end gap-1 mt-1">
        <span class="text-[10px] text-blue-100 select-none">${time}</span>
      </div>
    </div>
  `;
  messagesList.appendChild(wrapper);
  scrollToBottom();
}

function appendBotMessage(text) {
  switchToChatState();
  const time = getCurrentTime();
  const wrapper = document.createElement("div");
  wrapper.className = "flex items-start gap-3 animate-fade-in";
  wrapper.innerHTML = `
    <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5 shadow-sm">
      WS
    </div>
    <div class="max-w-[85%] md:max-w-[75%] bg-white border border-slate-200/80 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xs font-semibold text-slate-900">WebStudio Support</span>
        <span class="text-[10px] text-slate-400">${time}</span>
      </div>
      <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">${escapeHTML(text)}</p>
    </div>
  `;
  messagesList.appendChild(wrapper);
  scrollToBottom();
}

function appendTypingIndicator() {
  const id = "typing-" + Date.now();
  const wrapper = document.createElement("div");
  wrapper.id = id;
  wrapper.className = "flex items-start gap-3 animate-fade-in";
  wrapper.innerHTML = `
    <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5 shadow-sm">
      WS
    </div>
    <div class="bg-white border border-slate-200/80 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
      <span class="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style="animation-delay: 0ms"></span>
      <span class="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style="animation-delay: 150ms"></span>
      <span class="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style="animation-delay: 300ms"></span>
    </div>
  `;
  messagesList.appendChild(wrapper);
  scrollToBottom();
  return id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ── 5. PROSES PENGIRIMAN PESAN KE BACKEND ──────────────────
async function handleSendMessage(userText) {
  const message = userText.trim();
  if (!message) return;

  appendUserMessage(message);
  messageInput.value = "";
  messageInput.style.height = "auto";

  sendBtn.disabled = true;
  messageInput.disabled = true;

  const typingId = appendTypingIndicator();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message }),
    });

    const data = await response.json();
    removeTypingIndicator(typingId);

    if (response.ok && data.answer) {
      appendBotMessage(data.answer);
    } else {
      appendBotMessage(data.error || "Maaf, terjadi kendala saat memproses permintaan.");
    }
  } catch (error) {
    removeTypingIndicator(typingId);
    appendBotMessage(
      "Gagal terhubung ke server backend (port 3000). Pastikan backend Anda sedang berjalan!"
    );
  } finally {
    sendBtn.disabled = false;
    messageInput.disabled = false;
    messageInput.focus();
  }
}

// ── 6. EVENT LISTENERS ──────────────────────────────────────

// Form submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSendMessage(messageInput.value);
});

// Auto-expand textarea & Enter to send
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage(messageInput.value);
  }
});

messageInput.addEventListener("input", () => {
  messageInput.style.height = "auto";
  messageInput.style.height = `${Math.min(messageInput.scrollHeight, 120)}px`;
});

// Klik Suggestion Cards (Kotak besar tengah)
document.querySelectorAll(".suggestion-card").forEach((card) => {
  card.addEventListener("click", () => {
    const prompt = card.getAttribute("data-prompt");
    if (prompt) handleSendMessage(prompt);
  });
});

// Klik Action Chips (Pill tombol bulat kecil)
document.querySelectorAll(".chip-action").forEach((chip) => {
  chip.addEventListener("click", () => {
    const prompt = chip.getAttribute("data-prompt");
    if (prompt) handleSendMessage(prompt);
  });
});
