import { GET } from "../../../app/api/getFeaturedMoveOptions/route"; // Use ES6 import syntax
import { NextRequest } from "next/server";

describe("GET /api/getFeaturedMoveOptions", () => {
  it("should return a default list of featured move options for the beginner level", async () => {
    const req = new NextRequest("http://localhost/api/getFeaturedMoveOptions/");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.featuredMoves).toEqual(
      expect.arrayContaining([
        "Fireman Spin",
        "Chair Spin",
        "Back Hook Spin",
        "Front Hook Spin",
        "Step Around",
        "Pirouette",
        "Climb",
        "Pole Sit",
        "Crucifix",
        "Side Sit",
        "Side Climb",
      ])
    );
  });

  it("should return a list of featured move options for the intermediate level", async () => {
    const req = new NextRequest(
      "http://localhost/api/getFeaturedMoveOptions/?level=Intermediate"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.featuredMoves).toEqual(
      expect.arrayContaining([
        "Side Sit",
        "Butterfly",
        "Scorpio",
        "Gemini",
        "Jasmine",
        "Superman",
        "Brass Monkey",
        "Climb",
        "Cartwheel",
        "Straddle Invert",
        "Crucifix",
        "Knee Hook",
        "Side Climb",
        "Ayesha",
      ])
    );
  });

  it("should return a list of featured move options for the advanced level", async () => {
    const req = new NextRequest(
      "http://localhost/api/getFeaturedMoveOptions/?level=Advanced"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.featuredMoves).toEqual(
      expect.arrayContaining([
        "Brass Monkey",
        "Shoulder Mount",
        "Ayesha",
        "Deadlift",
        "Iron X",
        "Dismount",
        "Jasmine",
        "Cartwheel",
        "Superman",
        "Straddle Invert",
        "Handspring",
        "Butterfly",
      ])
    );
  });
});
