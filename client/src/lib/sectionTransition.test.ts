import { describe, expect, it } from "vitest";
import { MENU_GLITCH_DURATION_MS, MENU_GLITCH_REVEAL_DELAY_MS, shouldRunMenuGlitch } from "./sectionTransition";

describe("section transition policy", () => {
  it("uses a compact glitch envelope before revealing a new menu section", () => {
    expect(MENU_GLITCH_DURATION_MS).toBe(200);
    expect(MENU_GLITCH_REVEAL_DELAY_MS).toBeLessThan(MENU_GLITCH_DURATION_MS);
    expect(shouldRunMenuGlitch({ from: "about", to: "skills", reduceMotion: false })).toBe(true);
  });

  it("does not run a visual glitch for the current section or reduced-motion visitors", () => {
    expect(shouldRunMenuGlitch({ from: "skills", to: "skills", reduceMotion: false })).toBe(false);
    expect(shouldRunMenuGlitch({ from: "skills", to: "projects", reduceMotion: true })).toBe(false);
  });
});
