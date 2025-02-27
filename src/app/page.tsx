"use client";

import { useState, useEffect } from "react";

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
        className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-white text-lg mb-6 text-center">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500/80 hover:bg-red-500/90 text-white rounded-full
              transition-all duration-300 active:scale-95"
          >
            確認
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full
              transition-all duration-300 active:scale-95"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [count, setCount] = useState<number>(0);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  useEffect(() => {
    const savedCount = localStorage.getItem("count");
    if (savedCount) {
      setCount(parseInt(savedCount, 10));
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

  const handleCountUp = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem("count", newCount.toString());

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
  };

  const handleCountDown = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newCount = count - 1;
    setCount(newCount);
    localStorage.setItem("count", newCount.toString());
  };

  const handleResetClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowResetConfirm(true);
  };

  const handleResetConfirm = () => {
    setCount(0);
    localStorage.setItem("count", "0");
    setShowResetConfirm(false);
  };

  return (
    <main
      onClick={handleCountUp}
      className={`h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
        transition-all duration-300 cursor-pointer relative overflow-hidden
        ${isPressed ? "scale-[0.98]" : ""}`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6">
        <div
          className="w-full max-w-md p-6 sm:p-8 rounded-2xl backdrop-blur-md bg-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-white text-center tracking-tight">
            Counter
          </h1>

          <div className="flex flex-col items-center space-y-6 sm:space-y-8">
            <div
              className={`text-7xl sm:text-9xl font-bold text-white
                ${isPressed ? "scale-110" : "scale-100"}
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
              タップしてカウントアップ
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-4 p-4 sm:p-6 pointer-events-none">
        <button
          onClick={handleCountDown}
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 text-white rounded-full
            hover:bg-white/20 transition-all duration-300 backdrop-blur-md
            border border-white/20 shadow-lg min-w-[120px]
            active:scale-95 pointer-events-auto"
          aria-label="カウントダウン"
        >
          -1
        </button>
        <button
          onClick={handleResetClick}
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 text-white rounded-full
            hover:bg-white/20 transition-all duration-300 backdrop-blur-md
            border border-white/20 shadow-lg min-w-[120px]
            active:scale-95 pointer-events-auto"
          aria-label="カウンターをリセット"
        >
          リセット
        </button>
        <button
          onClick={handleCountUp}
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 text-white rounded-full
            hover:bg-white/20 transition-all duration-300 backdrop-blur-md
            border border-white/20 shadow-lg min-w-[120px]
            active:scale-95 pointer-events-auto"
          aria-label="カウントアップ"
        >
          +1
        </button>
      </div>

      <ConfirmDialog
        isOpen={showResetConfirm}
        onConfirm={handleResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
        message="カウンターをリセットしてもよろしいですか？"
      />
    </main>
  );
}
