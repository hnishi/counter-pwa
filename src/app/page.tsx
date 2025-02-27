"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

// フィードバックパターンの定義
const VIBRATION_PATTERNS = {
  COUNT_UP: [50] as number[],
  COUNT_DOWN: [75] as number[],
  RESET: [50, 50, 50] as number[],
};

const SOUND_PATTERNS = {
  COUNT_UP: { frequency: 880, duration: 100 }, // A5音
  COUNT_DOWN: { frequency: 440, duration: 150 }, // A4音
  RESET: { frequency: 660, duration: 50, repeat: 3 }, // E5音を3回
};

// フィードバック機能のユーティリティ関数
const vibrate = (pattern: number[]) => {
  if (typeof window === "undefined" || !window.navigator?.vibrate) return;
  window.navigator.vibrate(pattern);
};

const playSound = (pattern: {
  frequency: number;
  duration: number;
  repeat?: number;
}) => {
  if (typeof window === "undefined") return;

  const audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();
  const playNote = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = pattern.frequency;

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + pattern.duration / 1000
    );

    oscillator.start();
    oscillator.stop(audioContext.currentTime + pattern.duration / 1000);
  };

  if (pattern.repeat) {
    for (let i = 0; i < pattern.repeat; i++) {
      setTimeout(playNote, i * (pattern.duration + 50));
    }
  } else {
    playNote();
  }
};

// LocalStorageのキー定義
const STORAGE_KEYS = {
  COUNT: "count",
  VIBRATION_ENABLED: "vibrationEnabled",
  SOUND_ENABLED: "soundEnabled",
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
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // フィードバック機能の可用性チェック
  const isVibrationAvailable = useMemo(() => {
    if (typeof window === "undefined") return false;
    return "vibrate" in window.navigator;
  }, []);

  const isSoundAvailable = useMemo(() => {
    if (typeof window === "undefined") return false;
    return !!(window.AudioContext || (window as any).webkitAudioContext);
  }, []);

  // フィードバック機能の実行
  const handleVibration = useCallback(
    (pattern: number[]) => {
      if (!isVibrationAvailable || !vibrationEnabled) return;
      vibrate(pattern);
    },
    [isVibrationAvailable, vibrationEnabled]
  );

  const handleSound = useCallback(
    (pattern: { frequency: number; duration: number; repeat?: number }) => {
      if (!isSoundAvailable || !soundEnabled) return;
      playSound(pattern);
    },
    [isSoundAvailable, soundEnabled]
  );

  // 設定の初期化
  useEffect(() => {
    const savedVibrationSetting = localStorage.getItem(
      STORAGE_KEYS.VIBRATION_ENABLED
    );
    const savedSoundSetting = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);

    if (savedVibrationSetting !== null) {
      setVibrationEnabled(savedVibrationSetting === "true");
    }
    if (savedSoundSetting !== null) {
      setSoundEnabled(savedSoundSetting === "true");
    }
  }, []);

  // 設定の保存
  const updateSettings = useCallback((vibration: boolean, sound: boolean) => {
    setVibrationEnabled(vibration);
    setSoundEnabled(sound);
    localStorage.setItem(STORAGE_KEYS.VIBRATION_ENABLED, String(vibration));
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(sound));
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
      handleSound(SOUND_PATTERNS.COUNT_UP);

      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);
    },
    [count, createRipple, handleVibration, handleSound]
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
      handleSound(SOUND_PATTERNS.COUNT_DOWN);
    },
    [count, createRipple, handleVibration, handleSound]
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
    handleSound(SOUND_PATTERNS.RESET);
  }, [count, handleVibration, handleSound]);

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

      <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-4">
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

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowSettings(!showSettings);
          }}
          className="text-white/40 hover:text-white/60 transition-colors relative"
          aria-label="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {showSettings && (
          <div
            className="absolute bottom-10 right-4 p-4 rounded-xl glass-panel backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm text-white/80">振動</label>
                <button
                  onClick={() =>
                    updateSettings(!vibrationEnabled, soundEnabled)
                  }
                  className={`px-3 py-1 rounded-full transition-colors ${
                    vibrationEnabled ? "bg-white/20" : "bg-white/5"
                  }`}
                  aria-pressed={vibrationEnabled}
                >
                  {vibrationEnabled ? "ON" : "OFF"}
                </button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm text-white/80">音声</label>
                <button
                  onClick={() =>
                    updateSettings(vibrationEnabled, !soundEnabled)
                  }
                  className={`px-3 py-1 rounded-full transition-colors ${
                    soundEnabled ? "bg-white/20" : "bg-white/5"
                  }`}
                  aria-pressed={soundEnabled}
                >
                  {soundEnabled ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          </div>
        )}
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
