import { describe, expect, it } from "vitest";
import { getLocalTimeMode, shouldApplyLocalTimeRadioPreset } from "./timeMode";

describe("local-time cinematic mode", () => {
  it("maps local hours to the intended dawn, day, sunset, and night presets", () => {
    expect(getLocalTimeMode(5).id).toBe("dawn");
    expect(getLocalTimeMode(12).id).toBe("day");
    expect(getLocalTimeMode(18).id).toBe("sunset");
    expect(getLocalTimeMode(23).id).toBe("night");
    expect(getLocalTimeMode(3).id).toBe("night");
  });

  it("assigns a valid ambient radio station to every local-time preset", () => {
    expect(getLocalTimeMode(7).radioStationIndex).toBe(2);
    expect(getLocalTimeMode(13).radioStationIndex).toBe(1);
    expect(getLocalTimeMode(19).radioStationIndex).toBe(0);
  });

  it("does not override a manual mute or manual track selection", () => {
    expect(shouldApplyLocalTimeRadioPreset({ hasUserMuted: false, hasUserSelectedRadioStation: false })).toBe(true);
    expect(shouldApplyLocalTimeRadioPreset({ hasUserMuted: true, hasUserSelectedRadioStation: false })).toBe(false);
    expect(shouldApplyLocalTimeRadioPreset({ hasUserMuted: false, hasUserSelectedRadioStation: true })).toBe(false);
  });
});
