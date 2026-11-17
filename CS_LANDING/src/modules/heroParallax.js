export function initStitchParallax() {
  const container = document.querySelector(".stitch-perspective-container");
  const rig = document.querySelector(".stitch-isometric-rig");
  if (!container || !rig) return;

  let mouseX = 0,
    mouseY = 0;
  let currentX = 0,
    currentY = 0;
  let isHovered = false;

  container.addEventListener("mouseenter", () => {
    isHovered = true;
    rig.style.animationPlayState = "paused";
  });

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX = x * 14;
    mouseY = y * 14;
  });

  container.addEventListener("mouseleave", () => {
    isHovered = false;
    mouseX = 0;
    mouseY = 0;
    rig.style.animationPlayState = "running";
    rig.style.transform = "";
  });

  function renderParallax() {
    if (isHovered) {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      rig.style.transform = `scale(0.82) rotateY(${-22 + currentX}deg) rotateX(${20 - currentY}deg) rotateZ(-8deg)`;
    }
    requestAnimationFrame(renderParallax);
  }
  requestAnimationFrame(renderParallax);
}
