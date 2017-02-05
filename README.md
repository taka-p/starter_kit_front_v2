# スターターキット その2

## 使い方

### 初期設定
1. クローン
2. yarnセットアップ

```
$ npm run yarn_init
```

3. 諸々グローバルインストール

```
$ yarn global_init
```

### 各種コマンド

```
# assets_dev/build/配下のディレクトリ削除
$ yarn clean-dev
# asetts/配下のディレクトリ削除
$ yarn clean-prod
# 開発環境設定でassets_dev/build/にjsとpcssをビルド
$ yarn build-dev
# 本番環境設定でassets/にjsとpcssをビルド
$ yarn build-prod
# 開発環境設定でビルドの監視、livereloadする簡易サーバーを実行
$ yarn start
```

## TODO
- pcssでFLOCSS or atomic designの設計
- JSフレームワークはaurelia.jsとかいれてみる
- 画像周りのチューニングタスクを追加(optim系)
