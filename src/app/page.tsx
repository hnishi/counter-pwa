"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [count, setCount] = useState<number>(0);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  // 初回マウント時のみローカルストレージから読み込み
  useEffect(() => {
    const savedCount = localStorage.getItem("count");
    if (savedCount) {
      setCount(parseInt(savedCount, 10));
    }
  }, []);

  const handlePress = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem("count", newCount.toString());

    // タップアニメーション
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation(); // メインエリアのクリックイベントを防止
    setCount(0);
    localStorage.setItem("count", "0");
  };

  return (
    <main
      onClick={handlePress}
      className={`flex min-h-screen flex-col items-center justify-between p-8 bg-gray-100 cursor-pointer
        ${isPressed ? "bg-gray-200" : ""} transition-colors duration-150`}
    >
      <div className="w-full max-w-xl p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">PWAカウンター</h1>

        <div className="flex flex-col items-center space-y-8">
          <div
            className={`text-8xl font-bold text-blue-600
              ${
                isPressed ? "scale-110" : "scale-100"
              } transition-transform duration-150`}
          >
            {count}
          </div>

          <p className="text-gray-600 text-xl pointer-events-none">
            画面をタップしてカウントアップ！
          </p>
        </div>
      </div>

      <button
        onClick={handleReset}
        className="mt-8 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md active:shadow-sm active:translate-y-0.5 transform"
        aria-label="カウントをリセット"
      >
        リセット
      </button>
    </main>
  );
}
