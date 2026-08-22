export type LocalTimeModeId = "dawn" | "day" | "sunset" | "night";

export type LocalTimeMode = {
  id: LocalTimeModeId;
  radioStationIndex: 0 | 1 | 2;
};

const localTimeModes: Record<LocalTimeModeId, LocalTimeMode> = {
  dawn: { id: "dawn", radioStationIndex: 2 },
  day: { id: "day", radioStationIndex: 1 },
  sunset: { id: "sunset", radioStationIndex: 0 },
  night: { id: "night", radioStationIndex: 0 },
};

/** Maps the visitor's local hour to a cinematic tint and compatible radio ambience preset. */
export function getLocalTimeMode(hour: number): LocalTimeMode {
  const normalizedHour = ((Math.floor(hour) % 24) + 24) % 24;
  if (normalizedHour >= 5 && normalizedHour < 9) return localTimeModes.dawn;
  if (normalizedHour >= 9 && normalizedHour < 17) return localTimeModes.day;
  if (normalizedHour >= 17 && normalizedHour < 21) return localTimeModes.sunset;
  return localTimeModes.night;
}

/** Time-based station changes must never override explicit visitor control. */
export function shouldApplyLocalTimeRadioPreset({
  hasUserMuted,
  hasUserSelectedRadioStation,
}: {
  hasUserMuted: boolean;
  hasUserSelectedRadioStation: boolean;
}) {
  return !hasUserMuted && !hasUserSelectedRadioStation;
}
