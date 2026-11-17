export function initMatrixDecryption() {
  const targetEl = document.getElementById("matrixDataText");
  if (!targetEl) return;

  const originalWord = "Data";
  const matrixChars = "010189#%*&><_/{}+=!?$";
  let isScrambling = false;

  function runMatrixEffect() {
    if (isScrambling) return;
    isScrambling = true;

    let iteration = 0;
    targetEl.classList.add(
      "drop-shadow-[0_0_8px_rgba(234,88,12,0.85)]",
      "text-orange-500",
    );

    const interval = setInterval(() => {
      targetEl.innerText = originalWord
        .split("")
        .map((char, index) => {
          if (index < iteration) return originalWord[index];
          return matrixChars[Math.floor(Math.random() * matrixChars.length)];
        })
        .join("");

      if (iteration >= originalWord.length) {
        clearInterval(interval);
        targetEl.innerText = originalWord;
        isScrambling = false;

        setTimeout(() => {
          targetEl.classList.remove(
            "drop-shadow-[0_0_8px_rgba(234,88,12,0.85)]",
            "text-orange-500",
          );
        }, 300);
      }

      iteration += 1 / 3;
    }, 60);
  }

  setTimeout(runMatrixEffect, 2000);
  setInterval(runMatrixEffect, 5000);

  const logoBtn = document.getElementById("microLogoBtn");
  if (logoBtn) {
    logoBtn.addEventListener("mouseenter", runMatrixEffect);
  }
}
