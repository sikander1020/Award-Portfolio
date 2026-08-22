export const MENU_SECTION_LOADING_DURATION_MS = 680;
export const MENU_SECTION_REVEAL_DELAY_MS = 420;

export function shouldRunMenuTransition({
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
