export function shouldRenderHeroMotion({
  activeScreen,
  reduceMotion,
  videoFailed,
  hasOwnerApprovedSource,
}: {
  activeScreen: string;
  reduceMotion: boolean | null;
  videoFailed: boolean;
  hasOwnerApprovedSource: boolean;
}) {
  // The static original portrait stays the source of truth unless an owner has
  // explicitly supplied and approved a replacement motion asset.
  return activeScreen === "start" && hasOwnerApprovedSource && !reduceMotion && !videoFailed;
}
