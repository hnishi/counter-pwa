# PWA インストール要件対応計画

## 1. 依存関係の整理

```bash
# 古いnext-pwaを削除
yarn remove next-pwa
```

## 2. マニフェストファイルの更新

```json
{
  "name": "PWAカウンターアプリ",
  "short_name": "カウンター",
  "description": "シンプルなPWAカウンターアプリケーション",
  "version": "0.1.0",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4A90E2",
  "orientation": "portrait",
  "categories": ["utilities", "productivity"],
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

## 3. layout.tsx の更新

追加するメタタグ:

```html
<meta name="apple-mobile-web-app-title" content="カウンター" />
<link rel="apple-touch-icon" href="/icons/icon-152x152.png" sizes="152x152" />
<link rel="apple-touch-icon" href="/icons/icon-180x180.png" sizes="180x180" />
```

## 4. HTTPS 対応

1. ローカル開発環境での HTTPS 設定：

```typescript
// next.config.js
const nextConfig = {
  ...config,
  server: {
    https: process.env.NODE_ENV === "development",
  },
};
```

## 5. 動作確認手順

1. ビルドとデプロイ:

```bash
yarn build
yarn start
```

2. インストール確認:

- Chrome DevTools を開く
- Application タブを選択
- Manifest セクションでマニフェストの検証
- Service Worker セクションでの登録確認
- Lighthouse で PWA スコアをチェック

3. インストールテスト:

- Chrome のアドレスバーの「インストール」アイコンをクリック
- モバイルデバイスでの「ホーム画面に追加」機能の確認
- オフライン動作の確認

## 6. 追加のアイコン生成

新しいサイズのアイコンを追加:

- 152x152 (Apple Touch Icon)
- 180x180 (Apple Touch Icon)

## 注意点

- アプリケーションのバージョンは`package.json`と同期を保つ
- Service Worker は`next-pwa`によって自動生成される
- すべてのアイコンは PNG 形式で、適切な解像度で作成する
