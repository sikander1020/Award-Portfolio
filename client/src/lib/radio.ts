import { portableMedia } from "@/data/portableMedia";

export const radioStations = [
  { id: "V01", title: "NIGHT DRIVE", src: portableMedia.audio.nightDrive },
  { id: "V02", title: "NEON CRUISE", src: portableMedia.audio.neonCruise },
  { id: "V03", title: "COASTAL AFTERHOURS", src: portableMedia.audio.coastalAfterhours },
] as const;

export function cycleRadioStationIndex(currentIndex: number, direction: -1 | 1) {
  return (currentIndex + direction + radioStations.length) % radioStations.length;
}
