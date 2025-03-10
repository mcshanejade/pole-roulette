"use client";

import { useState } from "react";
import { HeroUIProvider } from "@heroui/system";
import { Button, Spacer } from "@heroui/react";
import MovesSlider from "../components/ui/slider";
import RoutineRadioGroup from "../components/ui/radio-group";

interface Move {
  name: string;
}

export default function Home() {
  const [moves, setMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numMoves, setNumMoves] = useState<number>(4);
  const [level, setLevel] = useState<string>("Beginner");

  const fetchMoves = () => {
    setLoading(true);
    setError(null); // Reset error state before making the request
    fetch(`/api/getMoves/?length=${numMoves}&level=${level}`) // Pass the numMoves and level as query parameters
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMoves(data.routine.map((name: string) => ({ name })));
        } else {
          setError("Failed to load moves");
        }
      })
      .catch(() => setError("Error fetching data"))
      .finally(() => setLoading(false));
  };

  return (
    <HeroUIProvider>
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-4">Pole Roulette</h1>

        <div>
          <RoutineRadioGroup setLevel={setLevel} />
        </div>

        <div>
          <Spacer y={5}></Spacer>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md">
          <MovesSlider setNumMoves={setNumMoves} />
        </div>

        <div>
          <Spacer y={5}></Spacer>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md">
          <Button
            onPress={fetchMoves}
            className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg text-lg"
            radius="full"
          >
            Generate Routine
          </Button>
        </div>

        <Spacer y={5}></Spacer>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="w-full max-w-md bg-gray-100 p-4 rounded-lg shadow">
            {moves.map((move, index) => (
              <div key={index} className="p-2 border-b border-gray-300">
                <strong>{move.name}</strong>
              </div>
            ))}
          </div>
        )}
      </main>
    </HeroUIProvider>
  );
}
