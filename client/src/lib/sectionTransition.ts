export const MENU_GLITCH_DURATION_MS = 200;
export const MENU_GLITCH_REVEAL_DELAY_MS = 70;

export function shouldRunMenuGlitch({
  from,
  to,
  reduceMotion,
}: {
  from: string;
  to: string;
  reduceMotion: boolean;
}) {
  return !reduceMotion && from !== to;
}
