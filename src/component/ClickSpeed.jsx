import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ClickSpeed() {
  const navigate = useNavigate();
  
  const [timeLeft, setTimeLeft] = useState(30);
  const [clicks, setClicks] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);

  const clicksRef = useRef(0);

  useEffect(() => {
    const savedBest = localStorage.getItem("clickSpeedBest");
    if (savedBest) {
      setBestScore(parseInt(savedBest));
    }
  }, []);
  useEffect(() => {
    clicksRef.current = clicks;
  }, [clicks]);
  const startGame = () => {
    setClicks(0);
    setTimeLeft(30);
    setIsRunning(true);
    setFinalScore(null);
    clicksRef.current = 0;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);

          const finalClicks = clicksRef.current;
          setFinalScore(finalClicks);
          if (finalClicks > bestScore) {
            setBestScore(finalClicks);
            localStorage.setItem("clickSpeedBest", finalClicks.toString());
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(interval);
  };

  const handleClick = () => {
    if (!isRunning) return;
    setClicks((prev) => prev + 1);
  };

  const resetGame = () => {
    if (timerInterval) clearInterval(timerInterval);
    setClicks(0);
    setTimeLeft(30);
    setIsRunning(false);
    setFinalScore(null);
  };

  const cps = finalScore 
    ? (finalScore / 30).toFixed(1) 
    : (isRunning && timeLeft > 0 ? (clicks / (30 - timeLeft)).toFixed(1) : "0.0");

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-black text-slate-900 dark:text-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden transition-colors duration-500">

      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-orange-400/20 dark:bg-orange-900/10 blur-[100px] pointer-events-none transition-colors duration-500" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-yellow-400/15 dark:bg-yellow-900/10 blur-[100px] pointer-events-none transition-colors duration-500" />

      <div className="max-w-md lg:max-w-5xl w-full flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-12 relative z-10">

        {/* Left Panel */}
        <div className="w-full lg:w-5/12 flex flex-col justify-between text-center lg:text-left space-y-6 lg:space-y-0 py-2">

          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 inline-block mb-3">
              Speed Training
            </span>
            <h1 className="text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-yellow-400 bg-clip-text text-transparent tracking-tight">
              Click Speed
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-light">Test your clicking speed and hand-eye coordination.</p>
          </div>

          <div className="bg-white border-slate-200 dark:bg-slate-900/40 border dark:border-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-md dark:shadow-xl">
            <div className="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase mb-3 text-left border-b border-slate-100 dark:border-slate-800 pb-2">
              Performance Matrix
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-orange-600 dark:text-orange-400">{clicks}</div>
                <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">CLICKS</div>
              </div>
              <div className="border-x border-slate-100 dark:border-slate-800/80">
                <div className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white">{cps}</div>
                <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">CPS</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-amber-500 dark:text-yellow-400">{bestScore || "-"}</div>
                <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">BEST</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:flex-1 py-3.5 bg-white hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm dark:shadow-none"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </button>

            {!isRunning && !finalScore && (
              <button
                onClick={startGame}
                className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 dark:from-orange-500 dark:to-yellow-600 hover:from-orange-400 hover:to-yellow-500 text-white font-bold rounded-xl shadow-md dark:shadow-lg shadow-orange-500/10 transition-all active:scale-[0.98]"
              >
                Start 30s Challenge
              </button>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-7/12 flex flex-col gap-4">

          <div 
            onClick={handleClick}
            className={`h-64 sm:h-72 lg:h-80 rounded-3xl flex items-center justify-center text-center cursor-pointer select-none bg-gradient-to-br transition-all duration-300 border-2 relative overflow-hidden group
              ${isRunning 
                ? "from-orange-500 to-yellow-500 border-orange-400 shadow-xl shadow-orange-500/10" 
                : "from-white to-slate-50 border-slate-200 shadow-md dark:from-slate-900/90 dark:to-slate-800/90 dark:border-slate-700 dark:shadow-2xl"
              }`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px] dark:opacity-100 opacity-20" />

            <div className="px-8 relative z-10 pointer-events-none">
              {!isRunning && !finalScore && (
                <div className="space-y-3">
                  <p className="text-5xl font-black text-slate-400 dark:text-slate-200">READY?</p>
                  <p className="text-slate-500 dark:text-slate-400">Click as fast as possible for 30 seconds</p>
                </div>
              )}

              {isRunning && (
                <div className="space-y-2">
                  <p className="text-7xl font-black text-white tracking-tighter drop-shadow-md">{timeLeft}</p>
                  <p className="text-xl font-bold text-orange-100 dark:text-orange-200">SECONDS LEFT</p>
                  <p className="text-4xl font-bold text-white mt-4">{clicks}</p>
                  <p className="text-sm text-orange-100 dark:text-orange-300">CLICKS</p>
                </div>
              )}

              {finalScore !== null && (
                <div className="space-y-3">
                  <p className="text-6xl font-black text-orange-600 dark:text-yellow-400">{finalScore}</p>
                  <p className="text-2xl text-slate-800 dark:text-white font-bold">Total Clicks</p>
                  <p className="text-xl text-orange-500 dark:text-orange-300">({cps} CPS)</p>
                </div>
              )}
            </div>
          </div>

          {finalScore !== null && (
            <div className="flex gap-4">
              <button
                onClick={resetGame}
                className="flex-1 py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white rounded-2xl font-semibold transition-all active:scale-95 shadow-sm dark:shadow-none"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 py-4 bg-slate-900 text-white dark:bg-white dark:text-black font-semibold rounded-2xl hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all active:scale-95 shadow-md"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}