export const radioStations = [
  { id: "V01", title: "NIGHT DRIVE", src: "/manus-storage/vice-night-drive_b8777cf7.mp3" },
  { id: "V02", title: "NEON CRUISE", src: "/manus-storage/vice-radio-neon-cruise_01117322.mp3" },
  { id: "V03", title: "COASTAL AFTERHOURS", src: "/manus-storage/vice-radio-coastal-afterhours_cc66c69d.mp3" },
] as const;

export function cycleRadioStationIndex(currentIndex: number, direction: -1 | 1) {
  return (currentIndex + direction + radioStations.length) % radioStations.length;
}
