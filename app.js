const slackEmojisRegex = /^http[s]?:\/\/[^:\/\s.]+\.slack\.com\/customize\/emoji$/;
const slackEmojiUrlPattern = 'https://*.slack.com/customize/emoji';

chrome.browserAction.onClicked.addListener(run);

function setClipboardContent(content) {
    var copySrc = document.createElement('textarea');
    copySrc.textContent = content;
    document.body.appendChild(copySrc);

    copySrc.focus();
    document.execCommand('SelectAll');
    document.execCommand('Copy');
    document.body.removeChild(copySrc);
}

function getEmojis(tab) {
    chrome.tabs.executeScript(tab.id, { file: 'page-script.js' }, (results) => setClipboardContent(results[0]));
}

function tabUpdateListener(tabId, changeInfo, tab) {
    if (slackEmojisRegex.test(tab.url) && changeInfo.status === 'complete') {
        getEmojis(tab);
        chrome.tabs.onUpdated.removeListener(tabUpdateListener);
    }
}

function openSlackFromHistory(historyItems) {
    let lastUsedSlackEmojiPage = historyItems[0].url;
    chrome.tabs.onUpdated.addListener(tabUpdateListener);
    chrome.tabs.create({ url: lastUsedSlackEmojiPage });
}

function getEmojisPage(tabs) {
    let tab = tabs[0];
    if (!tab) { 
        chrome.history.search({ text: slackEmojiUrlPattern, maxResults: 1 }, openSlackFromHistory);
    } else {
        getEmojis(tab);
    }
}

function run() {
    chrome.tabs.query({ url: 'https://*.slack.com/customize/emoji' }, getEmojisPage);
}