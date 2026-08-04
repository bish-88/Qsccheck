# GitHub copy paste guide

この `qsc-report-app` フォルダを GitHub に上げるための手順です。

## 方法1: GitHub画面でアップロード

1. GitHubで新しいリポジトリを作成
2. `uploading an existing file` を押す
3. `/Users/biswashbarali/Documents/vba/qsc-report-app` の中身をドラッグ
4. 以下はアップロードしない
   - `node_modules`
   - `.next`
   - `tmp`
   - `.DS_Store`
5. `Commit changes` を押す

## 方法2: ターミナルで貼り付け

GitHubで空のリポジトリを作ったあと、下のコマンドを貼り付けます。
`YOUR_GITHUB_REPO_URL` はGitHubのURLに変更してください。

```bash
cd /Users/biswashbarali/Documents/vba/qsc-report-app
git init
git add app components data hooks lib public tests types .github .gitignore README.md package.json package-lock.json tsconfig.json next.config.mjs postcss.config.mjs tailwind.config.ts vitest.config.ts next-env.d.ts
git commit -m "Create QSC inspection app"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## GitHubに上げたあと

GitHub Actionsで以下が自動確認されます。

```bash
npm test
npm run build
```
