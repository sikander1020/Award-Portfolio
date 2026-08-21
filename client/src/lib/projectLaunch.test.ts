import { describe, expect, it } from "vitest";
import { canLaunchGithubRepository, PROJECT_LAUNCH_DURATION_MS } from "./projectLaunch";

describe("project repository launch", () => {
  it("launches verified repository links through the loading handoff", () => {
    expect(canLaunchGithubRepository("https://github.com/sikander1020/example")).toBe(true);
    expect(PROJECT_LAUNCH_DURATION_MS).toBe(1100);
  });

  it("does not launch CV-only projects externally", () => {
    expect(canLaunchGithubRepository()).toBe(false);
  });
});
