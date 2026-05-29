import { useState } from "react";

export default function SequenceMemory() {
  const [sequence, setSequence] = useState([]);
  const [player, setPlayer] = useState([]);
  const [active, setActive] = useState(null);
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState("idle");

  const gridSize = 9;

  const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const startGame = () => {
    setLevel(1);
    generateLevel(1);
  };

  const generateLevel = async (lvl) => {
    const newSequence = [];

    for (let i = 0; i < lvl + 2; i++) {
      newSequence.push(
        Math.floor(Math.random() * gridSize)
      );
    }

    setSequence(newSequence);
    setPlayer([]);
    setStatus("showing");

    await showSequence(newSequence);

    setStatus("playing");
  };

  const showSequence = async (seq) => {
    for (let cell of seq) {
      setActive(cell);

      await sleep(600);

      setActive(null);

      await sleep(300);
    }
  };

  const handleClick = async (index) => {
    if (status !== "playing") return;

    const updated = [...player, index];

    setPlayer(updated);

    if (sequence[updated.length - 1] !== index) {
      setStatus("lost");
      return;
    }

    if (updated.length === sequence.length) {
      setStatus("success");

      setTimeout(() => {
        const next = level + 1;

        setLevel(next);

        generateLevel(next);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100">

      <h1 className="text-4xl font-bold">
        Memory Game
      </h1>

      <h2 className="text-xl">
        Level: {level}
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`
              w-24 h-24 rounded-xl
              transition-all duration-200
              ${
                active === index
                  ? "bg-blue-500 scale-90"
                  : "bg-gray-300"
              }
            `}
          />
        ))}
      </div>

      {status === "idle" && (
        <button
          onClick={startGame}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg"
        >
          Start Game
        </button>
      )}

      {status === "showing" && (
        <p>Watch the sequence...</p>
      )}

      {status === "playing" && (
        <p>Your turn!</p>
      )}

      {status === "lost" && (
        <div className="flex flex-col gap-2 items-center">
          <p className="text-red-500 font-bold">
            Game Over
          </p>

          <button
            onClick={startGame}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}