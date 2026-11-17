export function initRotatingTagline() {
  const wordEl = document.getElementById("rotatingWord");
  if (!wordEl) return;

  const words = ["Live in Days.", "Pixel Perfect."];
  let currentIndex = 0;

  setInterval(() => {
    wordEl.style.opacity = "0";
    wordEl.style.transform = "translateY(-100%)";

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % words.length;
      wordEl.textContent = words[currentIndex];
      wordEl.style.transform = "translateY(100%)";

      requestAnimationFrame(() => {
        wordEl.style.opacity = "1";
        wordEl.style.transform = "translateY(0)";
      });
    }, 700);
  }, 5000);
}
