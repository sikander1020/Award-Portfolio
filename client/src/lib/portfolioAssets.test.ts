import { describe, expect, it } from "vitest";
import { resolvePortfolioScreenArt } from "./portfolioAssets";

describe("resolvePortfolioScreenArt", () => {
  it("uses the freshly assigned storage URL for the matching portfolio screen", () => {
    const slots = { hero: { url: "/manus-storage/new-hero.webp" } };
    expect(resolvePortfolioScreenArt("start", slots, "/fallback.webp")).toBe("/manus-storage/new-hero.webp");
  });

  it("maps Academy and Contact to their shared image slots", () => {
    const slots = { about: { url: "/manus-storage/about.webp" }, projects: { url: "/manus-storage/projects.webp" } };
    expect(resolvePortfolioScreenArt("academy", slots, "/fallback.webp")).toBe("/manus-storage/about.webp");
    expect(resolvePortfolioScreenArt("contact", slots, "/fallback.webp")).toBe("/manus-storage/projects.webp");
  });

  it("keeps the existing scene art when a slot has not been assigned", () => {
    expect(resolvePortfolioScreenArt("skills", {}, "/existing-skills.webp")).toBe("/existing-skills.webp");
  });
});
