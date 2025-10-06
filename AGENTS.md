# Repository Guidelines

## プロジェクト構成とモジュール
リポジトリ直下に主要ファイルがまとまっており、`manifest.json` が拡張機能全体のエントリです。`background.js` はサービスワーカーとして動作し、アクションアイコンから `content.js` へコピー指示を送ります。ページ上でサンプル抽出と整形を担当するのが `content.js`、ユーザー設定 UI と保存処理は `options.html` と `options.js` に集約されています。ドキュメントは `README.md` およびベースラインガイドの `CLAUDE.md` を参照してください。

## ビルド・テスト・開発コマンド
Chrome での確認は `chrome://extensions/` を開き、デベロッパーモードで「パッケージ化されていない拡張機能」をこのリポジトリ直下に指定します。変更のホットリロードには拡張一覧での再読み込みを使ってください。配布向けには `zip -r dist/atcoder-sample-copier.zip background.js content.js manifest.json options.html options.js` を実行し、余計なファイルを含めないよう注意します。Firefox 互換テストが必要な場合は `npm install --global web-ext` の後に `web-ext run --source-dir .` を利用できます。

## コーディングスタイルと命名
JavaScript は ES2019 互換を前提にし、2 スペースインデント・セミコロンあり・`const` 優先を徹底します。ID やクラスの命名は `pre-sampleX` など既存 DOM に合わせ、内部変数・関数は `camelCase` で統一してください。UI テキストは日本語を既定としつつ、複数言語表示が想定される場合はコメントで用途を明示します。フォーマッタは導入されていないため、PR では `npx prettier --write "*.{js,json,html}"` を暫定ガイドとして適用することを推奨します。

## テスト方針
自動テストは未整備のため、`https://atcoder.jp/contests/abc999/tasks/abc999_a` のような任意の問題ページで手動検証します。平文と JSON 両形式でサンプルが重複なくコピーされること、トースト通知が 3 秒で消えること、設定変更が `chrome.storage.sync` に保持されることを確認してください。新機能追加時は期待される DOM 変化を README に追記し、再現手順を PR に記載します。

## コミットとプルリクエスト
Git 履歴は `fix duplicate ja/en` のように短い命令形・スコープ明示を採用しています。コミットは論理単位で分割し、和文解説が必要な場合は本文（72 文字以内折り返し）に追記してください。プルリクエストでは概要・動機・確認手順・影響範囲を箇条書きにし、UI 変更時はスクリーンショットを添付します。Issue 連携がある場合は `Closes #123` を本文末尾に記述してください。

## セキュリティと設定の注意
`manifest.json` の権限は `activeTab`・`clipboardWrite`・`storage` のみに限定されています。追加権限が必要な変更は理由と最小化策を必ずレビュー依頼時に説明してください。また、ユーザー設定は `chrome.storage.sync` を共有領域として扱うため、キー名は衝突を避けるべく `format` のような単純語を増やさず、名前空間付き（例: `copierFormat`）へ段階的に置き換える方針です。

## yukicoder DOMメモ
- サンプルセクションは `.sample` コンテナにまとまり、見出し `h5.underline` がサンプル番号を示す。
- 各サンプル内では `div.paragraph` が入出力セットを持ち、`h6` タグで `入力` / `出力` ラベルが出現し直後の `<pre>` が値本体になる。
- 入力と出力の `<pre>` は連続して配置され、空白行も含めた文字列がそのままコピー対象。
- 解説文や追補の `<pre>` が `div.paragraph` の後続に置かれることがあり、入出力ペアとの区別が必要。
- 一部問題では `div.paragraph` が存在せず `.sample` 直下に `h6` と `<pre>` が並ぶためフォールバック処理が前提。
