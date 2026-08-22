import { describe, expect, it } from "vitest";
import { exitFarewellCopy, shouldDismissExitExperience } from "./exitExperience";

describe("Exit Game farewell experience", () => {
  it("keeps the visitor in the portfolio with a clear return action", () => {
    expect(exitFarewellCopy.action).toBe("RETURN TO THE CITY");
    expect(exitFarewellCopy.message).toContain("mission log");
  });

  it("supports Escape as a keyboard dismissal path", () => {
    expect(shouldDismissExitExperience("Escape")).toBe(true);
    expect(shouldDismissExitExperience("Enter")).toBe(false);
  });
});
