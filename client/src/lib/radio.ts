import { portableMedia } from "@/data/portableMedia";

export const radioStations = [
  { id: "V01", title: "NIGHT DRIVE", src: portableMedia.audio.nightDrive },
  { id: "V02", title: "NEON CRUISE", src: portableMedia.audio.neonCruise },
  { id: "V03", title: "COASTAL AFTERHOURS", src: portableMedia.audio.coastalAfterhours },
] as const;

const stationWaveforms: Record<(typeof radioStations)[number]["id"], readonly number[]> = {
  V01: [4, 7, 10, 6, 4],
  V02: [5, 10, 6, 9, 5],
  V03: [3, 6, 9, 7, 4],
};

export function cycleRadioStationIndex(currentIndex: number, direction: -1 | 1) {
  return (currentIndex + direction + radioStations.length) % radioStations.length;
}

export function getRadioStationWaveform(stationId: string) {
  return stationWaveforms[stationId as keyof typeof stationWaveforms] ?? stationWaveforms.V01;
}
