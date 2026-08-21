export function getMobileMotionDurations({ isMobile, reduceMotion }: { isMobile: boolean; reduceMotion: boolean }) {
  if (reduceMotion) return { scene: 0, panel: 0, wipe: 0 };
  if (isMobile) return { scene: 0.34, panel: 0.26, wipe: 0.34 };
  return { scene: 0.82, panel: 0.52, wipe: 0.68 };
}
