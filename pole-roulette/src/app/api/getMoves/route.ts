import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const desiredLength = parseInt(searchParams.get("length") || "5");
  const filePath = path.join(process.cwd(), "data", "data.json");

  try {
    // Read the JSON file
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const polePairs = JSON.parse(jsonData);

    // Define the number of moves to generate in the routine
    const routineLength = desiredLength; // Change this number to adjust the sequence length

    // Function to generate a sequence of moves
    function generateRoutine(length: number) {
      let routine: any[] = [];
      let moveIds = [];

      // Randomly select the first move pair
      let currentPair = polePairs[Math.floor(Math.random() * polePairs.length)];
      routine.push(...currentPair.pair);
      moveIds.push(currentPair.id);

      // Find additional moves
      for (let i = 1; i < length; i++) {
        const lastMove = routine[routine.length - 1];

        let nextPair;
        let attempts = 0;
        const maxAttempts = polePairs.length;

        while (attempts < maxAttempts) {
          // Find the next pair where the first move matches the last move and the second move is not already in the routine
          nextPair = polePairs.find(
            (obj: { pair: any[] }) =>
              obj.pair[0] === lastMove && !routine.includes(obj.pair[1])
          );
          if (nextPair) break;
          attempts++;
        }

        // Stop when the routine is at chosen length or if no matching move is found
        if (routine.length == length * 2 - 2 || !nextPair) {
          break;
        }

        routine.push(...nextPair.pair);
        moveIds.push(nextPair.id);
      }

      // Remove consecutive duplicate moves
      routine = routine.filter(
        (move, index, arr) => index === 0 || move !== arr[index - 1]
      );

      return { routine, moveIds };
    }

    // Generate the routine
    const { routine, moveIds } = generateRoutine(routineLength);

    return NextResponse.json({
      success: true,
      routine,
      moveIds, // Output the sequence of move IDs for testing
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error processing data" },
      { status: 500 }
    );
  }
}
