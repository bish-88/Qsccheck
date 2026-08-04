# QSC巡回チェック

SCがコンビニ店舗を巡回しながら、iPhoneでQSCチェック、写真撮影、改善策入力、結果報告書作成まで行うWebアプリです。

## 主な機能

- 1画面1チェック項目のiPhone向け巡回UI
- OK、要改善、NG、未確認の判定と点数自動入力
- 写真撮影、画像圧縮、プレビュー、説明入力
- IndexedDBによる端末内自動保存
- 途中巡回の再開、履歴、店舗管理、項目管理
- 結果報告書、印刷、画像保存、共有
- PWA、オフライン対応、safe-area対応

## 開発

```bash
npm install
npm run dev
```

## 確認

```bash
npm test
npm run build
```
