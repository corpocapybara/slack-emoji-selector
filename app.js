const slackEmojisRegex = /^http[s]?:\/\/[^:\/\s.]+\.slack\.com\/customize\/emoji$/;

chrome.browserAction.onClicked.addListener(run);

function setClipboardContent(content) {
    var copySrc = document.createElement('textarea');
    copySrc.textContent = content;
    document.body.appendChild(copySrc);

    copySrc.focus();
    document.execCommand('SelectAll');
    document.execCommand('Copy');
    document.body.removeChild(copyFrom);
}

function getEmojis(tab) {
    chrome.tabs.executeScript(tab.id, { file: 'page-script.js' }, (results) => setClipboardContent(results[0]));
}

function run(tab) {
    if (slackEmojisRegex.test(tab.url)) {
        getEmojis(tab);
    }
}