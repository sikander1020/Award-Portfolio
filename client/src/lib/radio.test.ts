import { describe, expect, it } from "vitest";
import { cycleRadioStationIndex, radioStations } from "./radio";

describe("radio station selector", () => {
  it("cycles forward and backward through all available stations", () => {
    expect(cycleRadioStationIndex(0, 1)).toBe(1);
    expect(cycleRadioStationIndex(radioStations.length - 1, 1)).toBe(0);
    expect(cycleRadioStationIndex(0, -1)).toBe(radioStations.length - 1);
  });
});
