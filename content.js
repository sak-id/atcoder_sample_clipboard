// Content script for AtCoder Sample Copier
// 拡張機能アイコンクリック時のメッセージを受信して入出力例をコピーします。

(function() {
  // バックグラウンドスクリプトからのメッセージを受信
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'copySamples') {
      copySamples();
      sendResponse({ success: true });
    }
  });

  // 入出力例の抽出とコピー処理
  function copySamples() {
    // すべての pre-sample プレ要素を取得してIDでソート
    const preNodes = Array.from(document.querySelectorAll("pre[id^='pre-sample']"));
    preNodes.sort((a, b) => {
      const numA = parseInt(a.id.replace('pre-sample', ''));
      const numB = parseInt(b.id.replace('pre-sample', ''));
      return numA - numB;
    });
    
    const texts = [];
    const seenIds = new Set();
    preNodes.forEach(pre => {
      const text = pre.textContent.trim();
      const id = pre.id;
      // 同じID（日本語・英語で重複していることがある）を除外
      if (!seenIds.has(id)) {
        seenIds.add(id);
        texts.push(text);
      }
    });
    if (texts.length === 0) {
      showToast('入出力例が見つかりませんでした。', 'error');
      return;
    }

    // 設定を読み込んでフォーマットを決定
    chrome.storage.sync.get(['format'], (result) => {
      const format = result.format || 'text';
      let copyText = '';
      
      if (format === 'json') {
        // JSON形式
        const samples = [];
        const seenPairs = new Set();
        for (let i = 0; i < texts.length; i += 2) {
          const input = texts[i] ?? '';
          const output = texts[i + 1] ?? '';
          const pairKey = `${input}|${output}`;
          // サンプルペアの重複を除去
          if (!seenPairs.has(pairKey)) {
            seenPairs.add(pairKey);
            samples.push({
              input: input,
              expected: output
            });
          }
        }
        const jsonData = {
          problem_url: window.location.href,
          samples: samples
        };
        copyText = JSON.stringify(jsonData, null, 2);
      } else {
        // 平文形式（従来通り）
        const seenPairs = new Set();
        let first = true;
        for (let i = 0; i < texts.length; i += 2) {
          const input = texts[i] ?? '';
          const output = texts[i + 1] ?? '';
          const pairKey = `${input}|${output}`;
          // サンプルペアの重複を除去
          if (!seenPairs.has(pairKey)) {
            seenPairs.add(pairKey);
            if (!first) copyText += '\n\n';
            copyText += input + '\n' + output;
            first = false;
          }
        }
      }
      
      // クリップボードへ書き込む
      copyToClipboard(copyText);
    });
  }

  // トースト通知を表示する関数
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4caf50' : '#f44336'};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font-size: 14px;
      font-family: system-ui, sans-serif;
      z-index: 10000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    document.body.appendChild(toast);
    
    // アニメーション開始
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 10);
    
    // 3秒後に削除
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // クリップボードへのコピー処理を分離
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('入出力例をコピーしました。');
    }).catch(() => {
      // 失敗時はフォールバックとしてテキストエリアを利用
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-1000px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast('入出力例をコピーしました。');
      } catch (err) {
        showToast('コピーに失敗しました。', 'error');
      }
      textarea.remove();
    });
  }

})();