import { describe, expect, it } from "vitest";
import { cycleRadioStationIndex, getRadioStationWaveform, getRadioWaveformMode, radioStations } from "./radio";

describe("radio station selector", () => {
  it("cycles forward and backward through all available stations", () => {
    expect(cycleRadioStationIndex(0, 1)).toBe(1);
    expect(cycleRadioStationIndex(radioStations.length - 1, 1)).toBe(0);
    expect(cycleRadioStationIndex(0, -1)).toBe(radioStations.length - 1);
  });

  it("keeps the three named station sources distinct for manual selection", () => {
    expect(radioStations.map((station) => station.id)).toEqual(["V01", "V02", "V03"]);
    expect(new Set(radioStations.map((station) => station.src)).size).toBe(3);
  });

  it("assigns a compact, distinct waveform signature to each active station", () => {
    expect(getRadioStationWaveform("V01")).toEqual([4, 7, 10, 6, 4]);
    expect(getRadioStationWaveform("V02")).toEqual([5, 10, 6, 9, 5]);
    expect(getRadioStationWaveform("V03")).toEqual([3, 6, 9, 7, 4]);
    expect(getRadioStationWaveform("unknown")).toEqual(getRadioStationWaveform("V01"));
  });

  it("dims and pauses the waveform only when music is muted", () => {
    expect(getRadioWaveformMode({ isMuted: false, reduceMotion: false })).toBe("animated");
    expect(getRadioWaveformMode({ isMuted: false, reduceMotion: true })).toBe("static");
    expect(getRadioWaveformMode({ isMuted: true, reduceMotion: false })).toBe("muted");
    expect(getRadioWaveformMode({ isMuted: true, reduceMotion: true })).toBe("muted");
  });
});
