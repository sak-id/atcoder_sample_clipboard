# AtCoder Sample Copier

AtCoder の問題ページで拡張機能のアイコンをクリックするだけで、入出力例を一括コピーするツールです。

## インストール

1. このリポジトリをクローンまたはダウンロード
2. Chrome で `chrome://extensions/` を開く
3. デベロッパーモードを ON
4. 「パッケージ化されていない拡張機能を読み込む」で選択

## 使い方

1. AtCoder の問題ページを開く
2. 拡張機能のアイコンをクリック
3. サンプルがクリップボードにコピーされる

## 出力形式の切り替え

デフォルトでは平文形式でコピーされますが、JSON形式での出力も可能です。

### 平文形式（デフォルト）
```
3
6

hello
world
```

### JSON形式
```json
{
  "problem_url": "https://atcoder.jp/contests/abc123/tasks/abc123_a",
  "samples": [
    {
      "input": "3",
      "expected": "6"
    },
    {
      "input": "hello",
      "expected": "world"
    }
  ]
}
```

形式を変更するには、拡張機能の設定ページから選択できます。