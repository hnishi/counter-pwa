"use client";

import { useState, useEffect, useCallback } from "react";

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

  useEffect(() => {
    const savedCount = localStorage.getItem("count");
    if (savedCount) {
      setCount(parseInt(savedCount, 10));
      setPrevCount(parseInt(savedCount, 10));
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        handleCountUp();
      } else if (e.code === "ArrowLeft") {
        handleCountDown();
      } else if (e.code === "KeyR") {
        handleResetClick();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
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

  const handleCountUp = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (e) createRipple(e);

    setPrevCount(count);
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem("count", newCount.toString());

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
  };

  const handleCountDown = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (e) createRipple(e);

    setPrevCount(count);
    const newCount = count - 1;
    setCount(newCount);
    localStorage.setItem("count", newCount.toString());
  };

  const handleResetClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (e) createRipple(e);
    setShowResetConfirm(true);
  };

  const handleResetConfirm = () => {
    setPrevCount(count);
    setCount(0);
    localStorage.setItem("count", "0");
    setShowResetConfirm(false);
  };

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

            <p className="text-base sm:text-lg text-white/80 font-medium pointer-events-none">
              Tap anywhere to count up
            </p>
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
