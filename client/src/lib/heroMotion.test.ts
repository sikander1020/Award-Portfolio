import { describe, expect, it } from "vitest";
import { shouldRenderHeroMotion } from "./heroMotion";

describe("shouldRenderHeroMotion", () => {
  it("renders only an owner-approved Hero source on the non-reduced-motion Start screen", () => {
    expect(shouldRenderHeroMotion({ activeScreen: "start", reduceMotion: false, videoFailed: false, hasOwnerApprovedSource: true })).toBe(true);
    expect(shouldRenderHeroMotion({ activeScreen: "start", reduceMotion: false, videoFailed: false, hasOwnerApprovedSource: false })).toBe(false);
  });

  it("keeps the static Hero art across reduced-motion, error and non-Hero states", () => {
    expect(shouldRenderHeroMotion({ activeScreen: "start", reduceMotion: true, videoFailed: false, hasOwnerApprovedSource: true })).toBe(false);
    expect(shouldRenderHeroMotion({ activeScreen: "start", reduceMotion: null, videoFailed: true, hasOwnerApprovedSource: true })).toBe(false);
    expect(shouldRenderHeroMotion({ activeScreen: "projects", reduceMotion: false, videoFailed: false, hasOwnerApprovedSource: true })).toBe(false);
  });
});
