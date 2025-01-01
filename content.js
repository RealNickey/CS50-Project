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

async function autoJoinMeet() {
  // Mute microphone
  const micButton = await waitForElement('button[aria-label*="microphone"]');
  if (micButton.getAttribute('data-is-muted') === 'false') {
    micButton.click();
  }

  // Turn off camera
  const cameraButton = await waitForElement('button[aria-label*="camera"]');
  if (cameraButton.getAttribute('data-is-muted') === 'false') {
    cameraButton.click();
  }

  // Join meeting
  const joinButton = await waitForElement('button[aria-label*="Join now"]');
  if (joinButton) {
    joinButton.click();
  }
}

// Start the process when page loads
window.addEventListener('load', autoJoinMeet);

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'shake') {
    shakeCursor();
  }
});
