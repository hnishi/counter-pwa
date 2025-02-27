"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

// 振動パターンの定義
const VIBRATION_PATTERNS = {
  COUNT_UP: [50] as number[],
  COUNT_DOWN: [75] as number[],
  RESET: [50, 50, 50] as number[],
};

// 振動機能のユーティリティ関数
const vibrate = (pattern: number[]) => {
  if (typeof window === "undefined" || !window.navigator?.vibrate) return;
  window.navigator.vibrate(pattern);
};

// LocalStorageのキー定義
const STORAGE_KEYS = {
  COUNT: "count",
  VIBRATION_ENABLED: "vibrationEnabled",
} as const;

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
}: ConfirmDialogProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="glass-panel p-6 rounded-2xl max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-white text-lg mb-6 text-center">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500/80 hover:bg-red-500/90 text-white rounded-full
              transition-all duration-300 active:scale-95"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full
              transition-all duration-300 active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [count, setCount] = useState<number>(0);
  const [prevCount, setPrevCount] = useState<number>(0);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);

  // 振動機能の可用性チェック
  const isVibrationAvailable = useMemo(() => {
    if (typeof window === "undefined") return false;
    return "vibrate" in window.navigator;
  }, []);

  // 振動機能の実行
  const handleVibration = useCallback(
    (pattern: number[]) => {
      if (!isVibrationAvailable || !vibrationEnabled) return;
      vibrate(pattern);
    },
    [isVibrationAvailable, vibrationEnabled]
  );

  // 振動設定の初期化
  useEffect(() => {
    const savedVibrationSetting = localStorage.getItem(
      STORAGE_KEYS.VIBRATION_ENABLED
    );
    if (savedVibrationSetting !== null) {
      setVibrationEnabled(savedVibrationSetting === "true");
    }
  }, []);

  // リップルエフェクトの作成
  const createRipple = useCallback((event: React.MouseEvent) => {
    const button = event.currentTarget;
    const ripple = document.createElement("div");
    const rect = button.getBoundingClientRect();

    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;

    ripple.className = "ripple animate-ripple";
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }, []);

  const handleCountUp = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (e) createRipple(e);

      setPrevCount(count);
      const newCount = count + 1;
      setCount(newCount);
      localStorage.setItem(STORAGE_KEYS.COUNT, newCount.toString());
      handleVibration(VIBRATION_PATTERNS.COUNT_UP);

      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);
    },
    [count, createRipple]
  );

  const handleCountDown = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (e) createRipple(e);

      setPrevCount(count);
      const newCount = count - 1;
      setCount(newCount);
      localStorage.setItem(STORAGE_KEYS.COUNT, newCount.toString());
      handleVibration(VIBRATION_PATTERNS.COUNT_DOWN);
    },
    [count, createRipple]
  );

  const handleResetClick = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (e) createRipple(e);
      setShowResetConfirm(true);
    },
    [createRipple]
  );

  const handleResetConfirm = useCallback(() => {
    setPrevCount(count);
    setCount(0);
    localStorage.setItem(STORAGE_KEYS.COUNT, "0");
    setShowResetConfirm(false);
    handleVibration(VIBRATION_PATTERNS.RESET);
  }, [count]);

  // キーマッピングの定義
  const KEY_MAPPINGS = {
    INCREMENT: [
      "Space",
      "Enter",
      "ArrowRight",
      "ArrowUp",
      "KeyK",
      "KeyL",
      "KeyW",
      "KeyD",
    ],
    DECREMENT: [
      "Backspace",
      "ArrowLeft",
      "ArrowDown",
      "KeyH",
      "KeyJ",
      "KeyA",
      "KeyS",
    ],
    RESET: ["Escape", "KeyR"],
  };

  useEffect(() => {
    const savedCount = localStorage.getItem(STORAGE_KEYS.COUNT);
    if (savedCount) {
      setCount(parseInt(savedCount, 10));
      setPrevCount(parseInt(savedCount, 10));
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (KEY_MAPPINGS.INCREMENT.includes(e.code)) {
        handleCountUp();
      } else if (KEY_MAPPINGS.DECREMENT.includes(e.code)) {
        handleCountDown();
      } else if (KEY_MAPPINGS.RESET.includes(e.code)) {
        handleResetClick();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleCountUp, handleCountDown, handleResetClick]);

  return (
    <main
      onClick={handleCountUp}
      className="h-screen gradient-active gradient-animate relative overflow-hidden cursor-pointer"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl glass-panel">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-white text-center tracking-tight">
            Counter
          </h1>

          <div className="flex flex-col items-center space-y-6 sm:space-y-8">
            <div
              className={`text-7xl sm:text-9xl font-bold text-white counter-number
                ${
                  count > prevCount
                    ? "increment"
                    : count < prevCount
                    ? "decrement"
                    : ""
                }
                transition-all duration-150 ease-out`}
              style={{
                textShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              aria-live="polite"
              role="status"
            >
              {count}
            </div>

            <div className="flex flex-col items-center space-y-2 text-white/80">
              <p className="text-base sm:text-lg font-medium pointer-events-none">
                Tap anywhere to count up
              </p>
              <p className="text-sm text-white/60">
                Keyboard shortcuts: Space/Enter/→/↑/K/L/W/D (up), ←/↓/H/J/A/S
                (down), R/Esc (reset)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex justify-center items-center gap-4 p-4 sm:p-6 pointer-events-none">
        <button
          onClick={handleCountDown}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full
            glass-panel hover:scale-105 min-w-[120px]
            active:scale-95 pointer-events-auto overflow-hidden relative"
          aria-label="Count down"
        >
          -1
        </button>
        <button
          onClick={handleResetClick}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full
            glass-panel hover:scale-105 min-w-[120px]
            active:scale-95 pointer-events-auto overflow-hidden relative"
          aria-label="Reset counter"
        >
          Reset
        </button>
        <button
          onClick={handleCountUp}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full
            glass-panel hover:scale-105 min-w-[120px]
            active:scale-95 pointer-events-auto overflow-hidden relative"
          aria-label="Count up"
        >
          +1
        </button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <p className="text-xs text-white/40 hover:text-white/60 transition-colors">
          Created by{" "}
          <a
            href="https://github.com/hnishi/counter-pwa"
            className="underline hover:text-white/80 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            hnishi
          </a>
        </p>
      </div>

      <ConfirmDialog
        isOpen={showResetConfirm}
        onConfirm={handleResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
        message="Are you sure you want to reset the counter?"
      />
    </main>
  );
}
