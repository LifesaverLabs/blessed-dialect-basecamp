import { describe, it, expect } from "vitest";
import { getKonfidenceTier } from "@/hooks/use-kalmitee";

describe("BDLK Konfidence Tier Mapping", () => {
  it("maps 0-19 to Eksploring", () => {
    expect(getKonfidenceTier(0)).toBe("Eksploring");
    expect(getKonfidenceTier(10)).toBe("Eksploring");
    expect(getKonfidenceTier(19)).toBe("Eksploring");
  });

  it("maps 20-39 to Promising", () => {
    expect(getKonfidenceTier(20)).toBe("Promising");
    expect(getKonfidenceTier(30)).toBe("Promising");
    expect(getKonfidenceTier(39)).toBe("Promising");
  });

  it("maps 40-59 to Konsensus-forming", () => {
    expect(getKonfidenceTier(40)).toBe("Konsensus-forming");
    expect(getKonfidenceTier(50)).toBe("Konsensus-forming");
    expect(getKonfidenceTier(59)).toBe("Konsensus-forming");
  });

  it("maps 60-79 to Rekommended", () => {
    expect(getKonfidenceTier(60)).toBe("Rekommended");
    expect(getKonfidenceTier(70)).toBe("Rekommended");
    expect(getKonfidenceTier(79)).toBe("Rekommended");
  });

  it("maps 80-100 to Adopted", () => {
    expect(getKonfidenceTier(80)).toBe("Adopted");
    expect(getKonfidenceTier(90)).toBe("Adopted");
    expect(getKonfidenceTier(100)).toBe("Adopted");
  });

  it("handles boundary values korectly", () => {
    expect(getKonfidenceTier(19)).toBe("Eksploring");
    expect(getKonfidenceTier(20)).toBe("Promising");
    expect(getKonfidenceTier(39)).toBe("Promising");
    expect(getKonfidenceTier(40)).toBe("Konsensus-forming");
    expect(getKonfidenceTier(59)).toBe("Konsensus-forming");
    expect(getKonfidenceTier(60)).toBe("Rekommended");
    expect(getKonfidenceTier(79)).toBe("Rekommended");
    expect(getKonfidenceTier(80)).toBe("Adopted");
  });
});
