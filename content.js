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
    width: 30px;
    height: 30px;
    background: red;
    border-radius: 50%;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 99999;
    pointer-events: none;
    box-shadow: 0 0 10px rgba(255,0,0,0.5);
    transition: transform 0.1s ease-out;
  `;
  document.body.appendChild(cursor);

  let angle = 0;
  const radius = 30;
  const interval = setInterval(() => {
    angle += 0.3;
    cursor.style.transform = `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px) scale(${1 + Math.sin(angle) * 0.2})`;
  }, 16);

  // Play for longer and fade out
  setTimeout(() => {
    cursor.style.transition = 'all 0.5s ease-out';
    cursor.style.opacity = '0';
    cursor.style.transform = 'scale(0)';
    clearInterval(interval);
    setTimeout(() => {
      document.body.removeChild(cursor);
    }, 500);
  }, 3000);
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
  } else if (message.action === 'ping') {
    // Respond to ping to indicate content script is ready
    sendResponse({ status: 'ready' });
  }
  return true; // Required for async response
});
