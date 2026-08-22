import { describe, expect, it, vi } from "vitest";
import { BACKGROUND_MUSIC_VOLUME, UI_CUE_VOLUME, attemptAudioPlayback, attemptBackgroundAutoplay, shouldAutoStartBackgroundAudio, shouldPlayTypingCue, shouldPlayUiAudio, shouldStartBlockedAutoplayOnUserInteraction } from "./audio";

describe("attemptAudioPlayback", () => {
  it("starts a supplied audio element from the beginning at the requested volume", async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const audio = { currentTime: 11, volume: 0, muted: true, play };

    await expect(attemptAudioPlayback(audio, 0.24)).resolves.toBe(true);
    expect(audio.currentTime).toBe(0);
    expect(audio.volume).toBe(0.24);
    expect(audio.muted).toBe(false);
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

  it("plays UI cues only for deliberate button actions and never overrides a manual mute", () => {
    expect(shouldPlayUiAudio(true)).toBe(false);
    expect(shouldPlayUiAudio(false, "button")).toBe(true);
    expect(shouldPlayUiAudio(false, "typing")).toBe(false);
    expect(shouldPlayUiAudio(false, "ambient")).toBe(false);
    expect(shouldPlayTypingCue({ isMuted: false, lastCueAt: 0, now: 1000 })).toBe(false);
  });

  it("keeps interface and background audio below the previously overpowering cue level", () => {
    expect(UI_CUE_VOLUME).toBeLessThan(0.3);
    expect(BACKGROUND_MUSIC_VOLUME).toBeLessThan(0.3);
  });

  it("auto-starts music only after loading completes and never overrides a manual mute", () => {
    expect(shouldAutoStartBackgroundAudio({ isBooting: true, hasUserMuted: false, hasAlreadyStarted: false })).toBe(false);
    expect(shouldAutoStartBackgroundAudio({ isBooting: false, hasUserMuted: false, hasAlreadyStarted: false })).toBe(true);
    expect(shouldAutoStartBackgroundAudio({ isBooting: false, hasUserMuted: true, hasAlreadyStarted: false })).toBe(false);
    expect(shouldAutoStartBackgroundAudio({ isBooting: false, hasUserMuted: false, hasAlreadyStarted: true })).toBe(false);
  });

  it("uses a first user interaction for blocked background playback but never after manual mute", () => {
    expect(shouldStartBlockedAutoplayOnUserInteraction({ hasUserMuted: false, isPaused: true })).toBe(true);
    expect(shouldStartBlockedAutoplayOnUserInteraction({ hasUserMuted: true, isPaused: true })).toBe(false);
    expect(shouldStartBlockedAutoplayOnUserInteraction({ hasUserMuted: false, isPaused: false })).toBe(false);
  });
});
