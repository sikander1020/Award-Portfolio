import { describe, expect, it } from "vitest";
import { getMobileMotionDurations } from "./mobileMotion";

describe("mobile motion timings", () => {
  it("uses lighter and faster timings on mobile", () => {
    expect(getMobileMotionDurations({ isMobile: true, reduceMotion: false })).toEqual({ scene: 0.34, panel: 0.26, wipe: 0.34 });
  });

  it("removes optional motion when reduced motion is requested", () => {
    expect(getMobileMotionDurations({ isMobile: false, reduceMotion: true })).toEqual({ scene: 0, panel: 0, wipe: 0 });
  });
});
