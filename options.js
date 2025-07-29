// Options page script for AtCoder Sample Copier
// 設定の保存と読み込みを管理

document.addEventListener('DOMContentLoaded', () => {
  const formatSelect = document.getElementById('format');
  const status = document.getElementById('status');
  
  // 設定を読み込み
  chrome.storage.sync.get(['format'], (result) => {
    formatSelect.value = result.format || 'text';
  });
  
  // 設定変更時に自動保存
  formatSelect.addEventListener('change', () => {
    const format = formatSelect.value;
    chrome.storage.sync.set({ format }, () => {
      status.textContent = '設定を保存しました';
      setTimeout(() => {
        status.textContent = '';
      }, 2000);
    });
  });
});