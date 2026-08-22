import { describe, expect, it } from "vitest";
import { getSectionMissionTitle, MENU_SECTION_LOADING_DURATION_MS, MENU_SECTION_REVEAL_DELAY_MS, shouldRunMenuTransition } from "./sectionTransition";

describe("section transition policy", () => {
  it("uses a compact mission-loading envelope before revealing a new menu section", () => {
    expect(MENU_SECTION_LOADING_DURATION_MS).toBe(1500);
    expect(MENU_SECTION_REVEAL_DELAY_MS).toBeLessThan(MENU_SECTION_LOADING_DURATION_MS);
    expect(shouldRunMenuTransition({ from: "about", to: "skills", reduceMotion: false })).toBe(true);
  });

  it("does not run a visual glitch for the current section or reduced-motion visitors", () => {
    expect(shouldRunMenuTransition({ from: "skills", to: "skills", reduceMotion: false })).toBe(false);
    expect(shouldRunMenuTransition({ from: "skills", to: "projects", reduceMotion: true })).toBe(false);
  });

  it("maps every requested section to a distinct GTA-style mission title", () => {
    expect(getSectionMissionTitle("skills")).toBe("Operation: Skills");
    expect(getSectionMissionTitle("projects")).toBe("Project Heist");
    expect(getSectionMissionTitle("contact")).toBe("Open Channel");
  });
});
