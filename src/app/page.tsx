"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // ローカルストレージから初期値を読み込む
    const savedCount = localStorage.getItem("count");
    if (savedCount) {
      setCount(parseInt(savedCount, 10));
    }
  }, []);

  useEffect(() => {
    // カウントの変更を永続化
    localStorage.setItem("count", count.toString());
  }, [count]);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="w-full max-w-xl p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          PWAカウンター
        </h1>

        <div className="flex flex-col items-center space-y-6">
          <div className="text-6xl font-bold text-blue-600">{count}</div>

          <div className="flex space-x-4">
            <button
              onClick={decrement}
              className="px-6 py-3 text-xl font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              aria-label="デクリメント"
            >
              -
            </button>
            <button
              onClick={increment}
              className="px-6 py-3 text-xl font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
              aria-label="インクリメント"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
