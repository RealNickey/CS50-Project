function waitForElement(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      resolve(document.querySelector(selector));
      return;
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });
  });
}

function shakeCursor() {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    width: 20px;
    height: 20px;
    background: red;
    border-radius: 50%;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 9999;
    pointer-events: none;
  `;
  document.body.appendChild(cursor);

  let angle = 0;
  const radius = 20;
  const interval = setInterval(() => {
    angle += 0.2;
    cursor.style.transform = `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`;
  }, 20);

  setTimeout(() => {
    clearInterval(interval);
    document.body.removeChild(cursor);
  }, 2000);
}

