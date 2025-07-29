// Background script for AtCoder Sample Copier
// 拡張機能アイコンがクリックされたときにコンテンツスクリプトにメッセージを送信

chrome.action.onClicked.addListener((tab) => {
  // AtCoderの問題ページかチェック
  if (tab.url && tab.url.includes('atcoder.jp/contests/') && tab.url.includes('/tasks/')) {
    // コンテンツスクリプトにコピー実行のメッセージを送信
    chrome.tabs.sendMessage(tab.id, { action: 'copySamples' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Content script not ready:', chrome.runtime.lastError.message);
      }
    });
  }
});