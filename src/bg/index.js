/* global chrome */

function handleBrowserActionClicked() {
  chrome.runtime.openOptionsPage();
}

chrome.browserAction.onClicked.addListener(handleBrowserActionClicked);
