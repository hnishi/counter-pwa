# モバイル UX 改善計画

## 1. タッチ操作の制御

### 実装内容

- viewport meta タグの設定
  - user-scalable=no でピンチズーム無効化
  - maximum-scale=1.0 で最大拡大率を制限
  - minimum-scale=1.0 で最小縮小率を制限

### 実装場所

- `src/app/layout.tsx`の meta タグを更新

## 2. オーバースクロール防止

### 実装内容

- CSS で overscroll-behavior プロパティを設定
- body と html に対して overflow 制御を追加

### 実装場所

- `src/app/globals.css`に追加

## 3. レイアウト最適化

### 実装内容

- モバイルビューポートに合わせたレイアウト調整
- 余白とフォントサイズの微調整
- 画面高さに応じた動的なスケーリング

### 実装場所

- `src/app/page.tsx`のレイアウト関連クラスを更新
- Tailwind CSS のユーティリティクラスを活用

## 実装手順

1. layout.tsx の viewport 設定を更新
2. globals.css にオーバースクロール防止のスタイルを追加
3. page.tsx のレイアウトを調整

## 期待される効果

- スマートフォンでの UX 改善
- 不要なスクロールやズームの防止
- 画面サイズに最適化されたレイアウト
