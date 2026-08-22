import { describe, expect, it } from "vitest";
import { portableMedia } from "./portableMedia";

describe("mission loading cue assets", () => {
  it("assigns every Mission Select screen a dedicated release-hosted radio cue", () => {
    expect(portableMedia.audio.missionTuning).toEqual({
      start: expect.stringContaining("mission-city-arrival.mp3"),
      about: expect.stringContaining("mission-character-file.mp3"),
      skills: expect.stringContaining("mission-operation-skills.mp3"),
      projects: expect.stringContaining("mission-project-heist.mp3"),
      experience: expect.stringContaining("mission-career-run.mp3"),
      academy: expect.stringContaining("mission-training-grounds.mp3"),
      contact: expect.stringContaining("mission-open-channel.mp3"),
    });
  });

  it("uses direct release delivery for Mission Select cues so production never falls through to the app HTML route", () => {
    for (const cueSource of Object.values(portableMedia.audio.missionTuning)) {
      expect(cueSource).toContain("github.com/sikander1020/Award-Portfolio/releases/download/portfolio-media-v1/");
    }
  });

  it("keeps all seven mission cues distinct", () => {
    const cueSources = Object.values(portableMedia.audio.missionTuning);
    expect(cueSources).toHaveLength(7);
    expect(new Set(cueSources).size).toBe(cueSources.length);
  });
});
