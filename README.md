# QSC巡回チェック

コンビニ店舗の巡回時に、コンプライアンス、売場・品質、接客、清掃を確認し、点数・NG内容・改善策をまとめた結果報告書を作成する静的Webアプリです。

## ファイル構成

```text
index.html
inspection/new/index.html
inspection/report/index.html
sample/index.html
history/index.html
stores/index.html
items/index.html
settings/index.html
assets/css/style.css
assets/css/print.css
assets/js/defaults.js
assets/js/storage.js
assets/js/common.js
assets/js/inspection.js
assets/js/report.js
assets/js/history.js
assets/js/stores.js
assets/js/items.js
assets/js/settings.js
```

## ローカルで開く

`index.html` をブラウザで開くと動きます。サーバーやnpmは不要です。

## GitHub Pagesで公開

1. このフォルダをGitHubリポジトリにアップロードします。
2. GitHubの `Settings` → `Pages` を開きます。
3. `Source` を `Deploy from a branch` にします。
4. `main` ブランチ、`/root` を選びます。
5. 表示されたURLを開きます。

相対パスだけを使っているため、`https://USERNAME.github.io/REPOSITORY-NAME/` のようなサブディレクトリ公開でも動きます。

## 店舗名の変更

`assets/js/defaults.js` の `QSC_DEFAULT_STORES` を編集してください。アプリ内の「店舗管理」から追加・編集・削除もできます。

## チェック項目の変更

`assets/js/defaults.js` の `QSC_DEFAULT_ITEMS` を編集してください。アプリ内の「チェック項目管理」から編集、JSON書き出し、JSON読み込み、初期化もできます。

## 採点

初期状態の満点は100点です。

- コンプライアンス：9点
- Q：売場・品質：37点
- S：接客：26点
- C：清掃：28点

総合評価は以下です。

- 90〜100：◎ 優秀
- 80〜89：○ 合格
- 70〜79：△ 要改善
- 69以下：× 不合格

## localStorage

データはブラウザのlocalStorageに保存されます。

- `qscAppVersion`
- `qscStores`
- `qscItems`
- `qscInspections`
- `qscDraft`
- `qscSettings`

重要: データはそのブラウザ・端末の中だけに保存されます。別の端末には自動同期されません。

## バックアップと復元

「履歴」または「設定」からJSONバックアップを書き出せます。別端末へ移す場合は、バックアップJSONを読み込んでください。

## 安全な更新方法

アプリのHTML/CSS/JSを更新してもlocalStorageの保存データは通常消えません。大きな変更前には「Export all data」でバックアップしてください。

## 制限

写真はlocalStorageへ圧縮して保存します。大量の写真を保存するとブラウザ容量の上限に達することがあります。
