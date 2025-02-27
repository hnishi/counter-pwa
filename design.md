# カウンター機能拡張計画

## 1. UI/UX 設計

### ボタンレイアウト

- 下部に操作ボタンエリアを配置
  - 中央: リセットボタン（既存）
  - 左側: カウントダウンボタン（新規）
  - 右側: カウントアップボタン（新規、画面タップと同じ機能）
- ボタン間の適切な間隔確保（min-gap: 1rem）
- モバイルでの操作性を考慮したボタンサイズ（最小タップ領域: 44px）

### ビジュアルデザイン

- 既存のグラデーション背景との調和
- 半透明の背景（backdrop-blur-md）を維持
- アクセシビリティに配慮したコントラスト比

## 2. 機能実装

### カウントダウン機能

```typescript
const handleCountDown = (e: React.MouseEvent) => {
  e.stopPropagation();
  const newCount = count - 1;
  setCount(newCount);
  localStorage.setItem("count", newCount.toString());
};
```

### 確認ダイアログ

- リセット時に確認ダイアログを表示
- モーダルコンポーネントの実装

```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}
```

### アニメーション

- ボタン押下時の視覚フィードバック
- カウント値変更時のトランジション効果

## 3. アクセシビリティ

### キーボード操作

- すべてのボタンにフォーカス可能なスタイル
- キーボードショートカットの実装
  - スペース/エンター: カウントアップ
  - 左矢印: カウントダウン
  - R: リセット（確認後）

### ARIA 属性

- 適切な aria-label 属性の設定
- ライブリージョンでのカウント値の通知

## 4. 実装手順

1. コンポーネントの構造更新
2. 新規機能の実装（カウントダウン、確認ダイアログ）
3. スタイリングの適用
4. アクセシビリティ対応
5. テストと QA

## 5. 技術スタック

- Next.js（既存）
- TypeScript（型安全性）
- Tailwind CSS（スタイリング）
- React Hooks（状態管理）
