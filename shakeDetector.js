
let lastX = 0, lastY = 0;
let shakeDistance = 0;
const SHAKE_THRESHOLD = 1200; // Adjust to taste

window.addEventListener('mousemove', (e) => {
  const dx = Math.abs(e.clientX - lastX);
  const dy = Math.abs(e.clientY - lastY);
  lastX = e.clientX;
  lastY = e.clientY;
  shakeDistance += dx + dy;

  // Reset and trigger if it exceeds threshold quickly
  clearTimeout(window.shakeResetTimeout);
  window.shakeResetTimeout = setTimeout(() => shakeDistance = 0, 300);

  if (shakeDistance > SHAKE_THRESHOLD) {
    shakeDistance = 0;
    chrome.runtime.sendMessage({ action: 'switchToMeet' });
  }
});