# PWA 実装プラン

## 1. 必要なパッケージのインストール

```bash
yarn add next-pwa
```

## 2. Next.js の設定更新

next.config.js を更新し、PWA の設定を追加：

- next-pwa の設定
- Service Worker の自動生成設定
- キャッシュ戦略の設定

## 3. manifest.json の更新

- 既存の設定を活かしつつ、以下を追加：
  - icons 設定（複数サイズ対応）
  - maskable icon 対応
  - splash screen 用の設定

## 4. レイアウトの更新

src/app/layout.tsx に以下を追加：

- manifest.json のリンク
- apple-touch-icon 設定
- splash screen 対応

## 5. アイコンの準備

- 既存の icon-192x192.png を基に以下のサイズを作成：
  - 512x512 (PWA 標準)
  - 384x384 (中間サイズ)
  - 192x192 (既存)
  - 144x144 (小画面デバイス用)
  - maskable icon version

## 期待される結果

- PC やスマートフォンでアプリとしてインストール可能
- オフライン対応
- ネイティブアプリライクな体験
- スプラッシュスクリーン表示
- ホーム画面へのインストール促進

## テスト項目

1. インストール機能
2. オフライン動作
3. アプリ起動時の表示
4. キャッシュ動作
5. iOS/Android でのホーム画面追加
