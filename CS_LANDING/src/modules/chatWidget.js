// src/modules/chatWidget.js

export function initChatWidget() {
  const triggerBtn = document.getElementById("headerAiBtn");
  const modal = document.getElementById("aiChatModal");
  const modalBox = document.getElementById("aiChatBox");
  const closeBtn = document.getElementById("closeAiChatBtn");
  const backdrop = document.getElementById("aiChatBackdrop");

  const mascotElement = document.getElementById("mascotElement");
  const mascotFloatInner = document.getElementById("mascotFloatInner");

  const heroState = document.getElementById("heroState");
  const chatState = document.getElementById("chatState");
  const chatScroll = document.getElementById("chatScroll");
  const messagesList = document.getElementById("messagesList");
  const chatForm = document.getElementById("chatForm");
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");

  let currentSessionId = null;
  let isChatActive = false;

  if (!triggerBtn || !modal) return;

  // ── Open / Close Modal Logic ──
  function openModal() {
    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.classList.add("opacity-100");
    if (modalBox) {
      modalBox.classList.remove("scale-95");
      modalBox.classList.add("scale-100");
    }
    document.body.classList.add("overflow-hidden");
    if (messageInput) messageInput.focus();
  }

  function closeModal() {
    modal.classList.add("opacity-0", "pointer-events-none");
    modal.classList.remove("opacity-100");
    if (modalBox) {
      modalBox.classList.add("scale-95");
      modalBox.classList.remove("scale-100");
    }
    document.body.classList.remove("overflow-hidden");
  }

  triggerBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  window.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      !modal.classList.contains("pointer-events-none")
    ) {
      closeModal();
    }
  });

  // ── Mascot Interaction ──
  if (mascotElement && mascotFloatInner) {
    mascotElement.addEventListener("click", () => {
      mascotFloatInner.classList.remove("mascot-react");
      void mascotFloatInner.offsetWidth;
      mascotFloatInner.classList.add("mascot-react");
    });
  }

  // ── Chat Helpers ──
  function scrollToBottom() {
    setTimeout(() => {
      if (chatScroll) chatScroll.scrollTop = chatScroll.scrollHeight;
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
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[tag] || tag,
    );
  }

  function switchToChatState() {
    if (!isChatActive) {
      heroState.classList.add("hidden");
      chatState.classList.remove("hidden");
      isChatActive = true;
    }
  }

  function appendUserMessage(text) {
    switchToChatState();
    const time = getCurrentTime();
    const wrapper = document.createElement("div");
    wrapper.className = "flex justify-end animate-fade-in";
    wrapper.innerHTML = `
      <div class="max-w-[85%] md:max-w-[70%] bg-slate-900 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs">
        <p class="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">${escapeHTML(text)}</p>
        <div class="flex items-center justify-end gap-1 mt-1">
          <span class="text-[10px] text-slate-400 select-none">${time}</span>
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
    wrapper.className = "flex items-start gap-2.5 animate-fade-in";
    wrapper.innerHTML = `
      <img src="/avatar.png" alt="Avatar Robot" class="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 shadow-2xs border border-slate-200" />
      <div class="max-w-[85%] md:max-w-[75%] bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-semibold text-slate-900">MicroData Support</span>
          <span class="text-[10px] text-slate-400">${time}</span>
        </div>
        <p class="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">${escapeHTML(text)}</p>
      </div>
    `;
    messagesList.appendChild(wrapper);
    scrollToBottom();
  }

  function appendTypingIndicator() {
    const id = "typing-" + Date.now();
    const wrapper = document.createElement("div");
    wrapper.id = id;
    wrapper.className = "flex items-start gap-2.5 animate-fade-in";
    wrapper.innerHTML = `
      <img src="/avatar.png" alt="Avatar Robot" class="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 shadow-2xs border border-slate-200" />
      <div class="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-4 py-2.5 shadow-xs flex items-center gap-1.5">
        <span class="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style="animation-delay: 0ms"></span>
        <span class="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style="animation-delay: 150ms"></span>
        <span class="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style="animation-delay: 300ms"></span>
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

  // ── Send Message via API Proxy (/api/chat) ──
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
        body: JSON.stringify({
          message: message,
          sessionId: currentSessionId,
        }),
      });
      const data = await response.json();
      removeTypingIndicator(typingId);
      if (response.ok && data.answer) {
        currentSessionId = data.sessionId;
        appendBotMessage(data.answer);
      } else {
        appendBotMessage("Maaf, terjadi kendala saat memproses respons.");
      }
    } catch (error) {
      removeTypingIndicator(typingId);
      appendBotMessage(
        "Gagal terhubung ke backend (port 3000). Pastikan backend CS_SISTEM aktif!",
      );
    } finally {
      sendBtn.disabled = false;
      messageInput.disabled = false;
      messageInput.focus();
    }
  }

  // ── Form Events ──
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSendMessage(messageInput.value);
    });
  }

  if (messageInput) {
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
  }

  // Suggestion Cards Click
  document.querySelectorAll(".suggestion-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.remove("card-clicked-bounce");
      void card.offsetWidth;
      card.classList.add("card-clicked-bounce");

      if (mascotFloatInner) {
        mascotFloatInner.classList.remove("mascot-react");
        void mascotFloatInner.offsetWidth;
        mascotFloatInner.classList.add("mascot-react");
      }

      const prompt = card.getAttribute("data-prompt");
      if (prompt) {
        setTimeout(() => {
          handleSendMessage(prompt);
        }, 250);
      }
    });
  });
}
