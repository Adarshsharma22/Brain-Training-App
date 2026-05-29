import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SequenceMemory() {
  const navigate = useNavigate();

  const [sequence, setSequence] = useState([]);
  const [player, setPlayer] = useState([]);
  const [active, setActive] = useState(null);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [status, setStatus] = useState("idle");
  const [isAnimating, setIsAnimating] = useState(false);
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

  const gridSize = 9;

  const colors = [
    "bg-gradient-to-br from-rose-400 to-red-600 shadow-rose-500/50",
    "bg-gradient-to-br from-blue-400 to-indigo-600 shadow-blue-500/50",
    "bg-gradient-to-br from-emerald-400 to-green-600 shadow-emerald-500/50",
    "bg-gradient-to-br from-amber-300 to-yellow-500 shadow-yellow-500/50",
    "bg-gradient-to-br from-purple-400 to-violet-600 shadow-purple-500/50",
    "bg-gradient-to-br from-pink-400 to-fuchsia-600 shadow-pink-500/50",
    "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-cyan-500/50",
    "bg-gradient-to-br from-orange-400 to-amber-600 shadow-orange-500/50",
    "bg-gradient-to-br from-lime-400 to-emerald-500 shadow-lime-500/50"
  ];

  useEffect(() => {
    const savedBest = localStorage.getItem("sequenceBestScore");
    if (savedBest) setBestScore(parseInt(savedBest));
  }, []);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const startGame = () => {
    setLevel(1);
    setScore(0);
    setPlayer([]);
    setSequence([]); 
    setStatus("showing");
    generateLevel(1, true); 
  };

  const generateLevel = async (lvl, isFreshStart = false) => {
    setIsAnimating(true);
    
    const currentSequence = isFreshStart ? [] : [...sequence];
    currentSequence.push(Math.floor(Math.random() * gridSize));
    
    setSequence(currentSequence);
    setPlayer([]);
    setStatus("showing");

    await showSequence(currentSequence);
    
    setStatus("playing");
    setIsAnimating(false);
  };

  const showSequence = async (seq) => {
    for (let i = 0; i < seq.length; i++) {
      setActive(seq[i]);
      await sleep(500);
      setActive(null);
      await sleep(300);
    }
  };

  const handleClick = (index) => {
    if (status !== "playing" || isAnimating) return;

    const updatedPlayer = [...player, index];
    setPlayer(updatedPlayer);

    if (sequence[updatedPlayer.length - 1] !== index) {
      setStatus("lost");
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem("sequenceBestScore", score.toString());
      }
      return;
    }

    if (updatedPlayer.length === sequence.length) {
      const newScore = score + level * 10;
      setScore(newScore);
      setStatus("success");

      setTimeout(() => {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        setStatus("showing");
        generateLevel(nextLevel);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-black text-slate-900 dark:text-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden transition-colors duration-500">
      
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-purple-400/20 dark:bg-purple-900/10 blur-[100px] pointer-events-none transition-colors duration-500" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-pink-400/15 dark:bg-pink-900/10 blur-[100px] pointer-events-none transition-colors duration-500" />

      <div className="max-w-md lg:max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 relative z-10">

        <div className="w-full md:w-1/2 flex flex-col justify-between text-center md:text-left h-full space-y-6 md:space-y-8 py-2">

          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 inline-block mb-3">
              Memory Matrix
            </span>
            <h1 className="text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-600 dark:from-purple-400 dark:via-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent tracking-tight">
              Sequence Memory
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-light">Train your short-term spatial retention and focus boundaries.</p>
          </div>

          <div className="bg-white border-slate-200 dark:bg-slate-900/40 border dark:border-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-md dark:shadow-xl">
            <div className="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase mb-3 text-left border-b border-slate-100 dark:border-slate-800 pb-2">
              Performance Matrix
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-purple-600 dark:text-purple-400">{level}</div>
                <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">LEVEL</div>
              </div>
              <div className="border-x border-slate-100 dark:border-slate-800/80">
                <div className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white">{score}</div>
                <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">SCORE</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-amber-500 dark:text-yellow-400">{bestScore}</div>
                <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">BEST</div>
              </div>
            </div>
          </div>

          <div className="min-h-[110px] flex items-center justify-center md:justify-start">
            {status === "idle" && (
              <div className="flex flex-col sm:flex-row gap-3 w-full">
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
                  onClick={startGame}
                  className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-md dark:shadow-lg shadow-purple-500/10 transition-all active:scale-[0.98]"
                >
                  Start Game
                </button>
              </div>
            )}

            {status === "showing" && (
              <div className="flex items-center gap-3 bg-purple-500/5 border border-purple-500/20 rounded-xl px-5 py-3.5 w-full justify-center md:justify-start">
                <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400 animate-ping" />
                <p className="text-base text-purple-700 dark:text-purple-300 font-medium tracking-wide">Watch the matrix pattern closely...</p>
              </div>
            )}

            {status === "playing" && (
              <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-5 py-3.5 w-full justify-center md:justify-start animate-pulse">
                <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                <p className="text-base text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Your Turn! Reproduce sequence</p>
              </div>
            )}

            {status === "success" && (
              <div className="flex items-center gap-3 bg-teal-500/5 border border-teal-500/20 rounded-xl px-5 py-3.5 w-full justify-center md:justify-start">
                <p className="text-base text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">Flawless! Ascending level...</p>
              </div>
            )}

            {status === "lost" && (
              <div className="space-y-4 w-full">
                <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-center md:text-left">
                  <p className="text-xl font-black text-red-600 dark:text-red-500 tracking-tight">Sequence Broken!</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Final Yield: <span className="text-slate-800 dark:text-white font-bold">{score} pts</span></p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate("/")}
                    className="w-full sm:flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white font-medium rounded-xl transition-all active:scale-95 shadow-sm dark:shadow-none"
                  >
                   Back to Home
                  </button>
                  <button
                    onClick={startGame}
                    className="w-full sm:flex-1 py-3 bg-slate-900 text-white dark:bg-white dark:text-black font-bold rounded-xl hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 dark:hover:text-white transition-all shadow-md active:scale-95"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 max-w-[380px] md:max-w-none mx-auto">
          <div className="bg-white border-slate-200 dark:bg-slate-900/40 border dark:border-slate-800/80 backdrop-blur-md rounded-3xl p-5 lg:p-7 shadow-md dark:shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:30px_30px] dark:opacity-100 opacity-20" />
            
            <div className="grid grid-cols-3 gap-3 lg:gap-4 relative z-10">
              {Array.from({ length: 9 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  disabled={status !== "playing"}
                  className={`
                    aspect-square rounded-2xl text-2xl font-black tracking-tighter
                    transition-all duration-200 border select-none
                    ${active === index 
                      ? "scale-95 shadow-2xl ring-2 ring-white/20 border-transparent" 
                      : "hover:scale-[1.04] active:scale-95 border-slate-200/60 dark:border-transparent dark:hover:border-slate-700"
                    }
                    ${active === index 
                      ? colors[index] 
                      : "bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800/60 disabled:hover:scale-100 disabled:opacity-90 text-slate-700 dark:text-white"
                    }
                  `}
                >
                  {active === index && index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}