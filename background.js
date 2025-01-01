chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.includes('meet.google.com')) {
    // Get the window ID first
    chrome.windows.get(tab.windowId, {}, (window) => {
      // Focus the window
      chrome.windows.update(tab.windowId, { focused: true }, () => {
        // Then activate the tab
        chrome.tabs.update(tabId, { active: true }, () => {
          if (changeInfo.status === 'complete') {
            // Wait a bit to ensure tab is visible
            setTimeout(() => {
              chrome.tabs.sendMessage(tabId, { action: 'ping' }, response => {
                if (chrome.runtime.lastError) {
                  console.log('Tab not ready yet, retrying...');
                  setTimeout(() => {
                    chrome.tabs.sendMessage(tabId, { action: 'shake' });
                  }, 2000);
                } else {
                  chrome.tabs.sendMessage(tabId, { action: 'shake' });
                }
              });
            }, 500);
          }
        });
      });
    });
  }
});

// Listen for any tab activation to ensure Meet tab stays focused
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url && tab.url.includes('meet.google.com')) {
      chrome.windows.update(tab.windowId, { focused: true });
    }
  });
});
