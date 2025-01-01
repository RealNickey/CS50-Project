chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.includes('meet.google.com')) {
    chrome.tabs.update(tabId, { active: true });
    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, { action: 'shake' });
    }, 1000);
  }
});
