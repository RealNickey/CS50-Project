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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'switchToMeet') {
    chrome.tabs.query({ url: '*://meet.google.com/*' }, (tabs) => {
      if (tabs && tabs.length > 0) {
        const meetTab = tabs[0];
        chrome.windows.update(meetTab.windowId, { focused: true }, () => {
          chrome.tabs.update(meetTab.id, { active: true }, () => {
            chrome.tabs.sendMessage(meetTab.id, { action: 'shake' });
          });
        });
      }
    });
  }
});
