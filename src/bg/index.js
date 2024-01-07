/* global chrome */

function handleBrowserActionClicked() {
  chrome.runtime.openOptionsPage();
}

chrome.action.onClicked.addListener(handleBrowserActionClicked);
