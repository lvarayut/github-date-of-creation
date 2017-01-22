/* global chrome */
chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  chrome.pageAction.show(sender.tab.id);
  sendResponse();
});

