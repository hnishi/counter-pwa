"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [count, setCount] = useState<number>(0);
  const [isPressed, setIsPressed] = useState<boolean>(false);

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

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCount(0);
    localStorage.setItem("count", "0");
  };

  return (
    <main
      onClick={handlePress}
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
            >
              {count}
            </div>

            <p className="text-base sm:text-lg text-white/80 font-medium pointer-events-none">
              Tap anywhere to count up
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 sm:p-6 pointer-events-none">
        <button
          onClick={handleReset}
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 text-white rounded-full
            hover:bg-white/20 transition-all duration-300 backdrop-blur-md
            border border-white/20 shadow-lg
            active:scale-95 pointer-events-auto"
          aria-label="Reset counter"
        >
          Reset
        </button>
      </div>
    </main>
  );
}
