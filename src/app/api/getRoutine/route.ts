import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Function to get the appropriate level for moves, returns array of level specific moves
function getAppropriateLevelPairs(level: string, data: any[]) {
  // Define the array that will hold the experience level
  let routineDifficulty = [];

  // Switch statement to determine the level of the pairs
  switch (level) {
    // Check if the selected level is beginner, if so, routineDifficulty is set to beginner
    case "Beginner":
      routineDifficulty = ["Beginner"];
      break;
    case "Intermediate":
      // Check if the selected level is intermediate, if so, routineDifficulty is set to beginner and intermediate
      routineDifficulty = ["Beginner", "Intermediate"];
      break;
    case "Advanced":
      // Check if the selected level is advanced, if so, routineDifficulty is set to intermediate and advanced
      routineDifficulty = ["Intermediate", "Advanced"];
      break;
    default:
      // Default to beginner if no level is selected
      routineDifficulty = ["Beginner"];
      break;
  }
  // Filter the data array to only include moves that match the selected level
  return data.filter((obj: { level: string }) =>
    routineDifficulty.includes(obj.level)
  );
}

// Function to assign the featured move to a random point in the routine array
function assignPositionOfFeaturedMove(routineLength: number) {
  // Set the index of the featured move in the routine, index is a random number between 1 and the routine length
  const featuredMoveIndex = Math.floor(Math.random() * routineLength + 1);
  return featuredMoveIndex;
}

// Function to select the first pair for the routine
function selectFirstPair(
  isFeaturedMoveSelected: boolean,
  featuredMove: string,
  polePairs: any[]
) {
  // If no featured move is selected, select a random pair to assign as the first pair of the routine
  if (!isFeaturedMoveSelected) {
    const firstPair = polePairs[Math.floor(Math.random() * polePairs.length)];
    return firstPair.pair;
  } else {
    // If a featured move is selected, find a pair that includes the featured move and set this as the first pair
    const firstPair = polePairs.find(
      (obj: { pair: any[] }) => obj.pair[0] === featuredMove
    );
    return firstPair.pair;
  }
}

// Function to generate a sequence of moves that will make up the routine
function generateRoutineSegments(
  length: number,
  routine: any[],
  startingPosition: number,
  polePairs: any[]
) {
  // Finding a move for each position in the routine based on the selected length
  for (let i = startingPosition; i < length; i++) {
    const lastMove = routine[routine.length - 1];
    let nextPair;
    let attempts = 0;
    const maxAttempts = polePairs.length;
    let tempPolePairs = polePairs;

    while (attempts < maxAttempts) {
      // Find the next pair where the first move matches the last move and the second move is not already in the routine
      nextPair = tempPolePairs.find(
        (obj: { pair: any[] }) =>
          obj.pair[0] === lastMove && !routine.includes(obj.pair[1])
      );
      // Exit the loop if a matching move is found
      if (nextPair) break;

      // Get Index of nextPair in tempPolePairs
      const nextPairIndex = tempPolePairs.indexOf(nextPair);
      // Remove the nextPair from the tempPolePairs array
      tempPolePairs = tempPolePairs.splice(nextPairIndex, 1);

      attempts++;
    }

    // Stop when the routine is at chosen length or if no matching move is found
    if (routine.length == length * 2 - 2 || !nextPair) {
      break;
    }
    routine.push(...nextPair.pair);
  }

  // Remove consecutive duplicate moves
  routine = routine.filter(
    (move, index, arr) => index === 0 || move !== arr[index - 1]
  );
  return routine;
}

// Function to build the routine
function buildRoutine(
  routine: any[],
  routineLength: number,
  featuredMove: string,
  polePairs: any[]
) {
  // Ensures that the routine is generated with the correct number of moves
  routine = [];
  if (featuredMove == "") {
    // Call to a function that randomly selects the first pair for the routine, push it to the routine array
    routine.push(...selectFirstPair(false, featuredMove, polePairs));
    // Generate the routine without a featured move selected
    routine = generateRoutineSegments(routineLength, routine, 1, polePairs);
  } else {
    // Call to a function that assigns the featured move to a random point in the routine
    const featuredMoveIndex = assignPositionOfFeaturedMove(routineLength);
    // Call to a function that selects the initial pair for the routine with the featured move as the first move, push it to the routine array
    routine.push(...selectFirstPair(true, featuredMove, polePairs));
    // Generate the initial part of the routine up to the featured move index
    routine = generateRoutineSegments(featuredMoveIndex, routine, 1, polePairs);
    if (featuredMoveIndex != 1) {
      // Reverse the routine array to generate the second part of the routine after the featured move
      routine = routine.reverse();
    }
    // Generate the second part of the routine after the featured move
    routine = generateRoutineSegments(
      routineLength,
      routine,
      featuredMoveIndex,
      polePairs
    );
  }
  return routine;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const desiredLength = parseInt(searchParams.get("length") || "5");
  const desiredLevel = searchParams.get("level") || "Beginner";
  const featuredMove = (searchParams.get("featuredMove") || "").replaceAll(
    "_",
    " "
  );
  const filePath = path.join(process.cwd(), "data", "data.json");

  try {
    // Read the JSON file
    const jsonData = fs.readFileSync(filePath, "utf-8");

    // Define the array of appropriate levels
    const polePairs = getAppropriateLevelPairs(
      desiredLevel,
      JSON.parse(jsonData)
    );

    // Define the empty routine array
    let routine: any[] = [];

    // Define the number of moves to generate in the routine
    const routineLength = desiredLength;

    routine = buildRoutine(routine, routineLength, featuredMove, polePairs);

    return NextResponse.json({
      // Output all data for testing purposes
      success: true,
      desiredLength,
      desiredLevel,
      featuredMove,
      routine,
      polePairs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error processing data" },
      { status: 500 }
    );
  }
}
