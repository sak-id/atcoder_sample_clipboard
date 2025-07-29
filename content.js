// Content script for AtCoder Sample Copier
// ページ読み込み後に実行され、問題ページの入出力例を一括コピーするボタンを挿入します。

(function() {
  // ボタンの作成と挿入
  function insertCopyButton() {
    // 既に追加済みの場合は何もしない
    if (document.getElementById('atcoder-sample-copier-button')) return;
    const btn = document.createElement('button');
    btn.id = 'atcoder-sample-copier-button';
    btn.textContent = '入出力例をコピー';
    // ボタンの簡易スタイル
    btn.style.display = 'inline-block';
    btn.style.margin = '10px 0';
    btn.style.padding = '6px 12px';
    btn.style.fontSize = '14px';
    btn.style.color = '#ffffff';
    btn.style.backgroundColor = '#6c63ff';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = '9999';
    btn.addEventListener('click', copySamples);
    
    // 挿入先: 問題文の先頭付近が見つかればその前に、無ければbodyに追加
    const problemTitle = document.querySelector('.lang-ja h3, h3');
    if (problemTitle && problemTitle.parentNode) {
      problemTitle.parentNode.insertBefore(btn, problemTitle);
    } else {
      document.body.insertBefore(btn, document.body.firstChild);
    }
  }

  // 入出力例の抽出とコピー処理
  function copySamples() {
    // すべての pre-sample プレ要素を取得
    const preNodes = document.querySelectorAll("pre[id^='pre-sample']");
    const texts = [];
    const seen = new Set();
    preNodes.forEach(pre => {
      const text = pre.textContent.trim();
      // 同じ内容が日本語・英語で重複していることがあるため、重複を除外
      if (!seen.has(text)) {
        seen.add(text);
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
        for (let i = 0; i < texts.length; i += 2) {
          const input = texts[i] ?? '';
          const output = texts[i + 1] ?? '';
          samples.push({
            input: input,
            expected: output
          });
        }
        const jsonData = {
          problem_url: window.location.href,
          samples: samples
        };
        copyText = JSON.stringify(jsonData, null, 2);
      } else {
        // 平文形式（従来通り）
        for (let i = 0; i < texts.length; i += 2) {
          const input = texts[i] ?? '';
          const output = texts[i + 1] ?? '';
          copyText += input + '\n' + output;
          if (i + 2 < texts.length) copyText += '\n\n';
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

  // DOMContentLoaded でボタンを挿入
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertCopyButton);
  } else {
    insertCopyButton();
  }
})();