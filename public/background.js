
console.log('init the background script')

chrome.runtime.onInstalled.addListener(function() {
    chrome.browserAction.onClicked.addListener(function(tabs) {
        alert('Clicked the browserAction!')
    })
});