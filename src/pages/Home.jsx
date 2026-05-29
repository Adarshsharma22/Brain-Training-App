import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Brain,
    Zap,
    MousePointerClick,
    Sun,
    Moon,
 } from "lucide-react";

const games = [
  {
    id: 1,
    title: "Sequence Memory",
    description: "Remember the order of flashing tiles and test your memory boundaries.",
    icon: <Brain className="h-12 w-12 sm:h-16 sm:w-16" />,
    color: "from-purple-500 via-indigo-500 to-violet-600",
    glowColor: "group-hover:shadow-purple-500/20",
    difficulty: "Medium",
    path: "/sequence-memory",
    played: "12.4k",
    category: "Memory"
  },
  {
    id: 2,
    title: "Reaction Time",
    description: "Test how fast you can react. Train your attention and reflexes.",
    icon: <Zap className="h-12 w-12 sm:h-16 sm:w-16" />,
    color: "from-green-500 via-green-300 to-green-500",
    glowColor: "group-hover:shadow-green-500/20",
    difficulty: "Easy",
    path: "/reaction-time",
    played: "28.1k",
    category: "Attention"
  },
  {
    id: 5,
    title: "Click Speed",
    description: "How fast can you click? Test your clicking speed and reflexes.",
    icon: <MousePointerClick className="h-12 w-12 sm:h-16 sm:w-16" />,
    color: "from-orange-500 via-yellow-500 to-amber-600",
    glowColor: "group-hover:shadow-orange-500/20",
    difficulty: "Medium",
    path: "/click-speed",
    played: "18.7k",
    category: "Speed"
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDark, setIsDark] = useState(true);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const categories = ["All", "Memory", "Attention", "Speed"];

  return (
    <div className="min-h-screen transition-colors duration-500 bg-slate-200 dark:bg-black text-slate-900 dark:text-white relative overflow-hidden selection:bg-purple-500/30">
      
      {/* Dynamic Ambient Background Glows */}
      {/* Purple Orb */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full transition-colors duration-300 bg-purple-400/30 dark:bg-purple-900/30 blur-[80px] sm:blur-[120px] pointer-events-none" />
      {/* Blue Orb */}
      <div className="absolute top-[30%] right-[-10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full transition-colors duration-300 bg-blue-400/30 dark:bg-blue-900/30 blur-[100px] sm:blur-[150px] pointer-events-none" />

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-3 rounded-2xl border transition-all active:scale-95 bg-white/80 border-slate-200 hover:bg-slate-100 shadow-sm shadow-slate-200/50 dark:bg-slate-900/80 dark:border-slate-800 dark:hover:bg-slate-800 dark:shadow-none"
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-indigo-600" />
        )}
      </button>

      {/* Hero Section */}
      <div className="relative pt-20 pb-12 text-center px-6 z-10 max-w-4xl mx-auto">
        <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 inline-block mb-4 animate-pulse">
          Cognitive Workout Space
        </span>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-purple-600 dark:from-white dark:via-slate-200 dark:to-purple-400 bg-clip-text text-transparent">
          Brain Train
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          Level up your neural fitness. Challenge distinct cognitive domains, unlock achievements, and chart your progress.
        </p>
      </div>

      {/* Category Filter Buttons */}
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10 flex flex-wrap justify-center items-center gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
              selectedCategory === cat
                ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30 dark:shadow-purple-600/10"
                : "bg-white border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-300 shadow-sm dark:bg-slate-900/40 dark:border-slate-800/80 dark:text-slate-400 dark:hover:text-white dark:hover:border-slate-700 dark:shadow-none"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 z-20">
          {games
            .filter(g => selectedCategory === "All" || g.category === selectedCategory)
            .map((game) => (
              <div
                key={game.id}
                className={`group relative rounded-3xl overflow-hidden transition-all duration-300 border bg-white border-slate-200/80 shadow-md hover:shadow-xl dark:bg-slate-900/30 dark:border-slate-800/80 dark:shadow-none hover:-translate-y-1.5 flex flex-col justify-between ${game.glowColor}`}
              >
                {/* Micro Light Ray Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent dark:from-purple-500/[0.01] dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  {/* Banner Image Visual Panel */}
                  <div className={`h-40 sm:h-44 bg-gradient-to-br ${game.color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/5 dark:bg-black/20 mix-blend-overlay" />
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

                    <div className="text-white drop-shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-2 duration-300 relative z-10 select-none">
                      {game.icon}
                    </div>
                    
                    <span className="absolute top-4 left-4 bg-black/20 dark:bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
                      {game.category}
                    </span>
                    <div className="absolute top-4 right-4 bg-black/20 dark:bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-white">
                      {game.difficulty}
                    </div>
                  </div>

                  {/* Text Description Box */}
                  <div className="p-6">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-300">
                      {game.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-light leading-relaxed line-clamp-2">
                      {game.description}
                    </p>
                  </div>
                </div>

                {/* Footer Interaction Plate */}
                <div className="px-6 pb-6 pt-0">
                  <div className="h-[1px] bg-slate-100 dark:bg-slate-800/60 w-full mb-4" />
                  <button
                    onClick={() => navigate(game.path)}
                    className="w-full py-3 bg-slate-900 text-white dark:bg-white dark:text-black font-semibold rounded-xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white transition-all duration-300 shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Launch Exercise</span>
                    <svg 
                      className="w-4 h-4 transform transition-transform group-hover/btn:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;