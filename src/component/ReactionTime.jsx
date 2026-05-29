import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

export default function ReactionTime() {
  const navigate = useNavigate(); 
  const [status, setStatus] = useState("waiting");
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [trials, setTrials] = useState([]);
  const [bestTime, setBestTime] = useState(null);
  const [isClickable, setIsClickable] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark");
    setIsDark(isDarkTheme);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const cardStyles = {
    waiting: "from-white to-slate-50 border-slate-200 dark:from-slate-900/90 dark:to-slate-800/90 dark:border-slate-700/60 shadow-md dark:shadow-slate-950/50",
    ready: "from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-600 border-emerald-400 shadow-xl shadow-emerald-500/20 dark:shadow-emerald-950/40 animate-pulse",
    clicked: "from-purple-50 to-indigo-100 border-purple-200 dark:from-purple-900 dark:via-indigo-950 dark:to-slate-900 dark:border-purple-500 shadow-md dark:shadow-purple-950/30",
  };

  useEffect(() => {
    const savedBest = localStorage.getItem("reactionBestTime");
    if (savedBest) {
      setBestTime(parseInt(savedBest));
    }
  }, []);

  useEffect(() => {
    if (bestTime) {
      localStorage.setItem("reactionBestTime", bestTime.toString());
    }
  }, [bestTime]);

  const addTrial = (time) => {
    const newTrials = [...trials, time].slice(-8); 
    setTrials(newTrials);

    const currentBest = bestTime || Infinity;
    if (time < currentBest) {
      setBestTime(time);
    }
  };

  const startTrial = () => {
    setStatus("waiting");
    setIsClickable(false);
    setReactionTime(0);

    const delay = Math.random() * 2200 + 800;

    setTimeout(() => {
      setStatus("ready");
      setStartTime(Date.now());
      setIsClickable(true);
    }, delay);
  };

  const handleClick = () => {
    if (!isClickable) {
      setStatus("clicked");
      setReactionTime("Too Early!");
      return;
    }

    const endTime = Date.now();
    const timeTaken = endTime - startTime;

    setReactionTime(timeTaken);
    setStatus("clicked");
    setIsClickable(false);
    addTrial(timeTaken);
  };

  const resetGame = () => {
    setTrials([]);
    setReactionTime(0);
    setStatus("waiting");
    setIsClickable(false);
  };

  const clearAllRecords = () => {
    setTrials([]);
    setBestTime(null);
    localStorage.removeItem("reactionBestTime");
  };

  const averageTime = trials.length > 0
    ? Math.round(trials.reduce((a, b) => a + b, 0) / trials.length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-black text-slate-900 dark:text-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden transition-colors duration-500">

      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-400/20 dark:bg-cyan-900/10 blur-[100px] pointer-events-none transition-colors duration-500" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-400/15 dark:bg-purple-900/10 blur-[100px] pointer-events-none transition-colors duration-500" />

      <div className="max-w-md lg:max-w-5xl w-full flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-12 relative z-10">

        <div className="w-full lg:w-5/12 flex flex-col justify-between text-center lg:text-left space-y-6 lg:space-y-0 py-2">

          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 inline-block mb-3">
              Reflex Testing
            </span>
            <h1 className="text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-cyan-600 to-indigo-500 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight">
              Reaction Time
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-light">Train your visual attention, cognitive processing, and neurological reflexes.</p>
          </div>

          <div className="bg-white border-slate-200 dark:bg-slate-900/40 border dark:border-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-md dark:shadow-xl">
            <div className="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase mb-3 text-left border-b border-slate-100 dark:border-slate-800 pb-2">
              Performance Matrix
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">{trials.length}</div>
                <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">TRIALS</div>
              </div>
              <div className="border-x border-slate-100 dark:border-slate-800/80">
                <div className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white">{averageTime ? `${averageTime}ms` : "-"}</div>
                <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">AVG TIME</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-amber-500 dark:text-yellow-400">{bestTime ? `${bestTime}ms` : "-"}</div>
                <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">BEST TIME</div>
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

            <button
              onClick={startTrial}
              className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-500 dark:to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-xl shadow-md dark:shadow-lg shadow-cyan-500/10 transition-all active:scale-[0.98]"
            >
              {trials.length === 0 ? "Start Session" : "Next Exercise"}
            </button>
          </div>
        </div>

        <div className="w-full lg:w-7/12 flex flex-col gap-4">

          <div 
            onClick={handleClick}
            className={`
              h-64 sm:h-72 lg:h-80 rounded-3xl flex items-center justify-center text-center cursor-pointer select-none
              bg-gradient-to-br transition-all duration-300 border-2 relative overflow-hidden group shadow-md dark:shadow-2xl
              ${cardStyles[status]}
              ${isClickable ? "hover:scale-[1.01] active:scale-[0.99]" : ""}
            `}
          >
  
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px] dark:opacity-100 opacity-20" />

            <div className="px-8 relative z-10 pointer-events-none">
              {status === "waiting" && (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-xl text-slate-500 dark:text-slate-400 animate-pulse">⚡</span>
                  </div>
                  <p className="text-xl font-bold text-slate-700 dark:text-slate-200 tracking-tight">System Ready</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Click anywhere inside this container box to begin, then wait for it to flash green.</p>
                </div>
              )}

              {status === "ready" && (
                <div className="space-y-1 animate-bounce">
                  <p className="text-7xl font-black tracking-tighter text-white drop-shadow-md">GO!</p>
                  <p className="text-xs text-emerald-100 font-bold uppercase tracking-widest">Trigger Click Now!</p>
                </div>
              )}

              {status === "clicked" && (
                <div className="space-y-2">
                  {typeof reactionTime === "number" ? (
                    <>
                      <p className="text-5xl lg:text-6xl font-black tracking-tight text-purple-700 dark:text-white">
                        {reactionTime}<span className="text-2xl font-light text-purple-500 dark:text-purple-300 ml-1">ms</span>
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-300 font-medium tracking-wide">Excellent capture velocity.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-4xl font-black text-red-500 dark:text-red-400 tracking-tight">Early Fault!</p>
                      <p className="text-xs text-red-600 dark:text-red-300/80 max-w-xs mx-auto">You clicked ahead of the signal cue. Wait for the green block state flash.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border-slate-200 dark:bg-slate-900/40 border dark:border-slate-800/80 backdrop-blur-md rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-stretch justify-between shadow-sm dark:shadow-none">

            <div className="flex-1">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-400 tracking-wider uppercase">Registry Logs</span>
                {trials.length > 0 && (
                  <button
                    onClick={clearAllRecords}
                    className="text-[11px] font-semibold text-red-500 hover:text-red-400 transition-colors"
                  >
                    Clear Ledger
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1 custom-scrollbar">
                {trials.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-light py-2">No entries logged in the active workspace memory yet.</p>
                ) : (
                  trials.slice().reverse().map((time, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 bg-slate-100 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700/30 rounded-lg px-2.5 py-1 text-xs font-mono"
                    >
                      <span className="text-slate-400 dark:text-slate-500">#{trials.length - idx}</span>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">{time}ms</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="h-[1px] bg-slate-100 dark:bg-slate-800 w-full sm:hidden" />

            <div className="flex flex-col justify-end">
              <button
                onClick={resetGame}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:border-slate-700/50 dark:hover:border-slate-700 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium rounded-xl transition-all whitespace-nowrap active:scale-95"
              >
                Reset Running Ledger
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}