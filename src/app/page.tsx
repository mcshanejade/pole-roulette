"use client";

import { useEffect, useState } from "react";
import { HeroUIProvider } from "@heroui/system";
import { Button, Spacer } from "@heroui/react";
import MovesSlider from "../components/ui/slider";
import RoutineRadioGroup from "../components/ui/radio-group";
import FeaturedMoveDropdown from "@/components/ui/dropdown";

interface Move {
  name: string;
}

export default function Home() {
  const [moves, setMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numMoves, setNumMoves] = useState<number>(3);
  const [level, setLevel] = useState<string>("Beginner");
  const [featuredMove, setFeaturedMove] = useState<string>("");
  const [featuredMoveOptions, setFeaturedMoveOptions] = useState<string[]>([]);

  const fetchMoves = () => {
    setLoading(true);
    // Reset error state before making the request
    setError(null);
    // Pass the numMoves, level and featureMove as query parameters to the API
    fetch(
      `/api/getRoutine/?length=${numMoves}&level=${level}&featuredMove=${featuredMove.replaceAll(
        " ",
        "_"
      )}`
    )
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

  const fetchFeaturedMoveOptions = () => {
    setLoading(true);
    setError(null); // Reset error state before making the request
    fetch(`/api/getFeaturedMoveOptions/?level=${level}`) // Fetch the featured move options based on the level
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFeaturedMoveOptions(data.featuredMoves);
        } else {
          setError("Failed to load featured moves");
        }
      })
      .catch(() => setError("Error fetching data"))
      .finally(() => setLoading(false));
  };

  // Listens for changes to the level state and fetches the featured move options to update the dropdown
  useEffect(() => {
    fetchFeaturedMoveOptions();
    setFeaturedMove("");
  }, [level]);

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
          <FeaturedMoveDropdown
            setFeaturedMove={setFeaturedMove}
            featuredMoveOptions={featuredMoveOptions}
          />
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
