"use client";

import { useEffect, useState } from "react";

interface Move {
  name: string;
}

export default function Home() {
  const [moves, setMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/getMoves")
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
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Pole Dance Moves</h1>

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
  );
}