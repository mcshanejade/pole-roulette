import { GET } from "../../../app/api/getMoves/route"; // Use ES6 import syntax
import { NextRequest } from "next/server";
import fs from "fs";

describe("GET /api", () => {
  it("should return a default routine of 5 moves", async () => {
    const req = new NextRequest("http://localhost/api/getMoves/");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.routine.length).toBeGreaterThanOrEqual(5);
  });

  it("should return a routine of the specified length", async () => {
    const req = new NextRequest("http://localhost/api/getMoves?length=3");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.routine.length).toBeGreaterThanOrEqual(3);
  });

  it("should return a routine of the beginner level", async () => {
    const req = new NextRequest("http://localhost/api/getMoves?level=Beginner");
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
      "http://localhost/api/getMoves?level=Intermediate"
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
    const req = new NextRequest("http://localhost/api/getMoves?level=Advanced");
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

  it("should return an error if JSON file cannot be read", async () => {
    jest.spyOn(fs, "readFileSync").mockImplementation(() => {
      throw new Error("File not found");
    });

    const req = new NextRequest("http://localhost/api/getMoves/");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Error processing data");
  });
});
