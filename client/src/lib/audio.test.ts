import { describe, expect, it, vi } from "vitest";
import { BACKGROUND_MUSIC_VOLUME, MISSION_LOADING_BACKGROUND_VOLUME, MISSION_LOADING_CUE_VOLUME, UI_CUE_VOLUME, attemptAudioPlayback, attemptBackgroundAutoplay, playMissionLoadingCue, resumeBackgroundAudio, shouldAutoStartBackgroundAudio, shouldPlayMissionLoadingCue, shouldPlayUiAudio, shouldResumeBackgroundAudio } from "./audio";

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

  it("loads and starts the selected Mission Select cue before the loading state renders", async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const pause = vi.fn();
    const load = vi.fn();
    const audio = { src: "previous-cue.mp3", currentTime: 9, volume: 0, muted: true, play, pause, load };

    await expect(playMissionLoadingCue(audio, "project-heist.mp3", MISSION_LOADING_CUE_VOLUME)).resolves.toBe(true);
    expect(audio.src).toBe("project-heist.mp3");
    expect(audio.currentTime).toBe(0);
    expect(audio.volume).toBe(MISSION_LOADING_CUE_VOLUME);
    expect(audio.muted).toBe(false);
    expect(pause).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledTimes(1);
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

  it("resumes a visibility-paused background track without resetting its progress", async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const audio = { currentTime: 47, volume: 0, muted: true, play };

    await expect(resumeBackgroundAudio(audio, 0.18)).resolves.toBe(true);
    expect(audio.currentTime).toBe(47);
    expect(audio.volume).toBe(0.18);
    expect(audio.muted).toBe(false);
  });

  it("fails gracefully when browser playback is blocked or unavailable", async () => {
    const blocked = { currentTime: 9, volume: 0, play: vi.fn().mockRejectedValue(new Error("autoplay blocked")) };

    await expect(attemptAudioPlayback(blocked, 0.55)).resolves.toBe(false);
    await expect(attemptAudioPlayback(null, 0.55)).resolves.toBe(false);
    await expect(attemptBackgroundAutoplay(null, 0.24)).resolves.toBe(false);
  });

  it("keeps every interaction SFX disabled so clicks cannot generate duplicate or delayed cues", () => {
    expect(shouldPlayUiAudio(true)).toBe(false);
    expect(shouldPlayUiAudio(false, "button")).toBe(false);
    expect(shouldPlayUiAudio(false, "typing")).toBe(false);
    expect(shouldPlayUiAudio(false, "ambient")).toBe(false);
  });

  it("keeps interface and background audio controlled while preserving an audible dedicated Mission Select mix", () => {
    expect(UI_CUE_VOLUME).toBeLessThan(0.3);
    expect(BACKGROUND_MUSIC_VOLUME).toBeLessThan(0.3);
    expect(MISSION_LOADING_CUE_VOLUME).toBeLessThan(0.3);
    expect(MISSION_LOADING_CUE_VOLUME).toBeGreaterThan(MISSION_LOADING_BACKGROUND_VOLUME);
  });

  it("plays the mission loading cue only for an audible visible session", () => {
    expect(shouldPlayMissionLoadingCue({ isMuted: false, hasUserMuted: false, isDocumentHidden: false })).toBe(true);
    expect(shouldPlayMissionLoadingCue({ isMuted: true, hasUserMuted: false, isDocumentHidden: false })).toBe(false);
    expect(shouldPlayMissionLoadingCue({ isMuted: false, hasUserMuted: true, isDocumentHidden: false })).toBe(false);
    expect(shouldPlayMissionLoadingCue({ isMuted: false, hasUserMuted: false, isDocumentHidden: true })).toBe(false);
  });

  it("auto-starts music only after loading completes and never overrides a manual mute", () => {
    expect(shouldAutoStartBackgroundAudio({ isBooting: true, hasUserMuted: false, hasAlreadyStarted: false })).toBe(false);
    expect(shouldAutoStartBackgroundAudio({ isBooting: false, hasUserMuted: false, hasAlreadyStarted: false })).toBe(true);
    expect(shouldAutoStartBackgroundAudio({ isBooting: false, hasUserMuted: true, hasAlreadyStarted: false })).toBe(false);
    expect(shouldAutoStartBackgroundAudio({ isBooting: false, hasUserMuted: false, hasAlreadyStarted: true })).toBe(false);
  });

  it("resumes only a track that was actively playing before the tab became hidden", () => {
    expect(shouldResumeBackgroundAudio({ isDocumentHidden: true, hasUserMuted: false, wasPlayingWhenHidden: true })).toBe(false);
    expect(shouldResumeBackgroundAudio({ isDocumentHidden: false, hasUserMuted: true, wasPlayingWhenHidden: true })).toBe(false);
    expect(shouldResumeBackgroundAudio({ isDocumentHidden: false, hasUserMuted: false, wasPlayingWhenHidden: false })).toBe(false);
    expect(shouldResumeBackgroundAudio({ isDocumentHidden: false, hasUserMuted: false, wasPlayingWhenHidden: true })).toBe(true);
  });
});
