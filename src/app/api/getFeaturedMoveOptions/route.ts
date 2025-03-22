import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Function to get the appropriate level for moves, returns array of level specific moves
function getAppropriateLevelPairs(level: string, data: any[]) {
  let routineDifficulty = [];

  switch (level) {
    case "Beginner":
      routineDifficulty = ["Beginner"];
      break;
    case "Intermediate":
      routineDifficulty = ["Intermediate"];
      break;
    case "Advanced":
      routineDifficulty = ["Advanced"];
      break;
    default:
      routineDifficulty = ["Beginner"];
      break;
  }
  // Returns an array of string arrays that contain the move names of the move pairs within the apparopriate level
  return data.filter((obj: { level: string }) =>
    routineDifficulty.includes(obj.level)
  );
}

// Function to strip duplicate moves from the featured move options array, only includes the name of the move
function sanitiseFeaturedMoveOptions(data: any[]) {
  let sanitisedOptionsArray: Array<string> = [];
  for (let i = 0; i < data.length; i++) {
    let pair = data[i].pair;
    if (!sanitisedOptionsArray.includes(pair[0])) {
      sanitisedOptionsArray.push(pair[0]);
    }
    if (!sanitisedOptionsArray.includes(pair[1])) {
      sanitisedOptionsArray.push(pair[1]);
    }
  }
  // Returns an array of strings that contain the names of the possible options for a featured move
  return sanitisedOptionsArray;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const desiredLevel = searchParams.get("level") || "Beginner";
  const filePath = path.join(process.cwd(), "data", "data.json");

  try {
    // Read the JSON file
    const jsonData = fs.readFileSync(filePath, "utf-8");

    // Define the array for the appropriate selected level
    const polePairs = getAppropriateLevelPairs(
      desiredLevel,
      JSON.parse(jsonData)
    );

    // Define the array for the featured move options
    const featuredMoveOptions = sanitiseFeaturedMoveOptions(polePairs);

    return NextResponse.json({
      // Output all data for testing purposes
      success: true,
      featuredMoves: featuredMoveOptions,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error processing data" },
      { status: 500 }
    );
  }
}
