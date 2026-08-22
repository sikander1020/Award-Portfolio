export const MENU_SECTION_LOADING_DURATION_MS = 1500;
export const MENU_SECTION_REVEAL_DELAY_MS = 1160;

const sectionMissionTitles: Record<string, string> = {
  start: "City Arrival",
  about: "Character File",
  skills: "Operation: Skills",
  projects: "Project Heist",
  experience: "Career Run",
  academy: "Training Grounds",
  contact: "Open Channel",
};

export function getSectionMissionTitle(sectionId: string) {
  return sectionMissionTitles[sectionId] ?? "Vice Signal Operation";
}

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
