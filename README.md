# 行徳ジム24 公開ページ

GitHub Pagesで公開するための静的ページです。公式LINE追加を主目的にした、スマホファーストの1ページ構成です。

## ファイル構成

```text
.
├── index.html
├── styles.css
├── script.js
├── assets/
└── README.md
```

## 公開方法

1. このリポジトリをGitHubへpushします。
2. GitHubの `Settings` → `Pages` を開きます。
3. `Build and deployment` で `Deploy from a branch` を選びます。
4. Branchを `main`、Folderを `/ (root)` にして保存します。

## メモ

- CSS、JS、画像はGitHub Pagesのサブパス公開でも崩れにくいよう、すべて相対パスで参照しています。
- 公式LINEのURLは `script.js` の `LINE_URL` で一元管理しています。
- URLに `utm_source` や `utm_campaign` が付いている場合、CTAリンクへ引き継ぎます。
