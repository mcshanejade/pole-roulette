import { GET } from "../../../app/api/getRoutine/route"; // Use ES6 import syntax
import { NextRequest } from "next/server";
import fs from "fs";

describe("GET /api/getRoutine", () => {
  it("should return a default routine of 3 moves", async () => {
    const req = new NextRequest("http://localhost/api/getRoutine/");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.routine.length).toBeGreaterThanOrEqual(3);
  });

  it("should return a routine of the specified length", async () => {
    const req = new NextRequest("http://localhost/api/getRoutine?length=3");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.routine.length).toBeGreaterThanOrEqual(3);
  });

  it("should return a routine of the beginner level", async () => {
    const req = new NextRequest(
      "http://localhost/api/getRoutine?level=Beginner"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.polePairs.every((move: any) => move.level === "Beginner")).toBe(
      true
    );
  });

  it("should return a routine of the intermediate level", async () => {
    const req = new NextRequest(
      "http://localhost/api/getRoutine?level=Intermediate"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(
      data.polePairs.every(
        (move: any) =>
          move.level === "Beginner" || move.level === "Intermediate"
      )
    ).toBe(true);
  });

  it("should return a routine of the advanced level", async () => {
    const req = new NextRequest(
      "http://localhost/api/getRoutine?level=Advanced"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(
      data.polePairs.every(
        (move: any) =>
          move.level === "Intermediate" || move.level === "Advanced"
      )
    ).toBe(true);
  });

  it("should return a beginner routine with a beginner featured move, which is 'Side Climb'", async () => {
    const req = new NextRequest(
      "http://localhost/api/getRoutine?level=Beginner&featuredMove=Side_Climb"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.polePairs.every((move: any) => move.level === "Beginner")).toBe(
      true
    );
    expect(data.routine.some((move: any) => move === "Side Climb")).toBe(true);
  });

  it("should return an intermediate routine with an intermediate featured move, which is 'Butterfly'", async () => {
    const req = new NextRequest(
      "http://localhost/api/getRoutine?level=Intermediate&featuredMove=Butterfly"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(
      data.polePairs.every(
        (move: any) =>
          move.level === "Beginner" || move.level === "Intermediate"
      )
    ).toBe(true);
    expect(data.routine.some((move: any) => move === "Butterfly")).toBe(true);
  });

  it("should return an advanced routine with an advanced featured move, which is 'Ayesha'", async () => {
    const req = new NextRequest(
      "http://localhost/api/getRoutine?level=Advanced&featuredMove=Ayesha"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(
      data.polePairs.every(
        (move: any) =>
          move.level === "Intermediate" || move.level === "Advanced"
      )
    ).toBe(true);
    expect(data.routine.some((move: any) => move === "Ayesha")).toBe(true);
  });

  it("should return an error if JSON file cannot be read", async () => {
    jest.spyOn(fs, "readFileSync").mockImplementation(() => {
      throw new Error("File not found");
    });

    const req = new NextRequest("http://localhost/api/getRoutine/");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Error processing data");
  });
});
