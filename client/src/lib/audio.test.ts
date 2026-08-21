import { describe, expect, it, vi } from "vitest";
import { attemptAudioPlayback, attemptBackgroundAutoplay, shouldAutoStartBackgroundAudio, shouldPlayTypingCue, shouldPlayUiAudio, shouldStartBlockedAutoplayOnUserInteraction } from "./audio";

describe("attemptAudioPlayback", () => {
  it("starts a supplied audio element from the beginning at the requested volume", async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const audio = { currentTime: 11, volume: 0, play };

    await expect(attemptAudioPlayback(audio, 0.24)).resolves.toBe(true);
    expect(audio.currentTime).toBe(0);
    expect(audio.volume).toBe(0.24);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("starts background music muted for autoplay permission, then restores sound", async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const audio = { currentTime: 4, volume: 0, muted: false, play };

    await expect(attemptBackgroundAutoplay(audio, 0.24)).resolves.toBe(true);
    expect(audio.currentTime).toBe(0);
    expect(audio.volume).toBe(0.24);
    expect(audio.muted).toBe(false);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("fails gracefully when browser playback is blocked or unavailable", async () => {
    const blocked = { currentTime: 9, volume: 0, play: vi.fn().mockRejectedValue(new Error("autoplay blocked")) };

    await expect(attemptAudioPlayback(blocked, 0.55)).resolves.toBe(false);
    await expect(attemptAudioPlayback(null, 0.55)).resolves.toBe(false);
    await expect(attemptBackgroundAutoplay(null, 0.24)).resolves.toBe(false);
  });

  it("never permits navigation or mission cues to re-enable a manual mute", () => {
    expect(shouldPlayUiAudio(true)).toBe(false);
    expect(shouldPlayUiAudio(false)).toBe(true);
  });

  it("throttles typing sounds while respecting the manual sound-off state", () => {
    expect(shouldPlayTypingCue({ isMuted: false, lastCueAt: 100, now: 172 })).toBe(true);
    expect(shouldPlayTypingCue({ isMuted: false, lastCueAt: 100, now: 171 })).toBe(false);
    expect(shouldPlayTypingCue({ isMuted: true, lastCueAt: 0, now: 1000 })).toBe(false);
  });

  it("auto-starts music only after loading completes and never overrides a manual mute", () => {
    expect(shouldAutoStartBackgroundAudio({ isBooting: true, hasUserMuted: false, hasAlreadyStarted: false })).toBe(false);
    expect(shouldAutoStartBackgroundAudio({ isBooting: false, hasUserMuted: false, hasAlreadyStarted: false })).toBe(true);
    expect(shouldAutoStartBackgroundAudio({ isBooting: false, hasUserMuted: true, hasAlreadyStarted: false })).toBe(false);
    expect(shouldAutoStartBackgroundAudio({ isBooting: false, hasUserMuted: false, hasAlreadyStarted: true })).toBe(false);
  });

  it("starts a blocked background track on the first user interaction but never after manual mute", () => {
    expect(shouldStartBlockedAutoplayOnUserInteraction({ hasUserMuted: false, isPaused: true })).toBe(true);
    expect(shouldStartBlockedAutoplayOnUserInteraction({ hasUserMuted: true, isPaused: true })).toBe(false);
    expect(shouldStartBlockedAutoplayOnUserInteraction({ hasUserMuted: false, isPaused: false })).toBe(false);
  });
});
