# デプロイメントガイド

このドキュメントでは、Counter PWA アプリケーションのデプロイ前の動作確認方法について説明します。

## ローカル環境での動作確認

ローカル環境で開発を行う場合は、以下のコマンドを使用してください：

```bash
yarn dev
```

このコマンドにより、開発サーバーが起動し、`http://localhost:3000` でアプリケーションにアクセスできます。
開発モードでは、コードの変更がリアルタイムで反映されます。

## Vercel での Preview 環境の確認

プロダクション環境にデプロイする前に、Preview 環境で動作確認を行うことができます。

1. Vercel CLI を使用して Preview デプロイを行います：

   ```bash
   vercel deploy
   ```

2. デプロイが完了すると、Preview URL が生成されます。

3. Vercel Web Console（https://vercel.com）にアクセスし、プロジェクトのダッシュボードから Preview デプロイを確認できます。
   - Deployments タブから最新の Preview デプロイを選択
   - 生成された URL にアクセスして動作確認を実施

## 本番環境へのデプロイ (CI/CD)

本プロジェクトでは、GitHub と Vercel の連携により、自動デプロイが設定されています。

1. コードを GitHub リポジトリにプッシュすると、自動的に CI/CD パイプラインが実行されます：

   ```bash
   git push origin main
   ```

2. CI/CD プロセスの流れ：

   - GitHub への push をトリガーとして Vercel のビルドが開始
   - ビルドが成功すると、自動的に本番環境にデプロイ
   - デプロイ完了後、本番環境の URL で新バージョンが利用可能に

3. デプロイのステータスは以下の方法で確認できます：
   - GitHub リポジトリの Actions タブ
   - Vercel ダッシュボードの Deployments セクション
