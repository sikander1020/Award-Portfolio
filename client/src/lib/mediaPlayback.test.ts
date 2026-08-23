import { describe, expect, it } from "vitest";
import { getActiveVideoPreload, shouldPauseMobileSceneVideo, shouldWarmSceneVideos } from "./mediaPlayback";

describe("mobile media playback safeguards", () => {
  it("does not preload every scene video on mobile devices", () => {
    expect(shouldWarmSceneVideos({ isBooting: false, isMobile: true, reduceMotion: false })).toBe(false);
    expect(shouldWarmSceneVideos({ isBooting: false, isMobile: false, reduceMotion: false })).toBe(true);
  });

  it("keeps active mobile videos lightweight while preserving full desktop warmup", () => {
    expect(getActiveVideoPreload(true)).toBe("metadata");
    expect(getActiveVideoPreload(false)).toBe("auto");
  });

  it("never warms optional scene videos before boot completes or with reduced motion", () => {
    expect(shouldWarmSceneVideos({ isBooting: true, isMobile: false, reduceMotion: false })).toBe(false);
    expect(shouldWarmSceneVideos({ isBooting: false, isMobile: false, reduceMotion: true })).toBe(false);
  });

  it("pauses an active mobile scene video while the tab is hidden without affecting desktop playback", () => {
    expect(shouldPauseMobileSceneVideo({ isMobile: true, isDocumentHidden: true })).toBe(true);
    expect(shouldPauseMobileSceneVideo({ isMobile: true, isDocumentHidden: false })).toBe(false);
    expect(shouldPauseMobileSceneVideo({ isMobile: false, isDocumentHidden: true })).toBe(false);
  });
});
