chrome.browserAction.onClicked.addListener(getEmojis);

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