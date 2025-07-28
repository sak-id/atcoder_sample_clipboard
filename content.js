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
      alert('入出力例が見つかりませんでした。');
      return;
    }
    // 入力と出力をセットで結合
    let result = '';
    for (let i = 0; i < texts.length; i += 2) {
      const input = texts[i] ?? '';
      const output = texts[i + 1] ?? '';
      result += input + '\n' + output;
      if (i + 2 < texts.length) result += '\n\n';
    }
    // クリップボードへ書き込む
    navigator.clipboard.writeText(result).then(() => {
      // ユーザに通知（ツールチップ等があればそちらでも可）
      alert('入出力例をコピーしました。');
    }).catch(() => {
      // 失敗時はフォールバックとしてテキストエリアを利用
      const textarea = document.createElement('textarea');
      textarea.value = result;
      textarea.style.position = 'fixed';
      textarea.style.left = '-1000px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        alert('入出力例をコピーしました。');
      } catch (err) {
        alert('コピーに失敗しました。');
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