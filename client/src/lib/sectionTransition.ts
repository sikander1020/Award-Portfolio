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

export const sectionMissionVariants = {
  start: { id: "arrival", code: "ROUTE 01", signal: "CITY GATEWAY LOCKED" },
  about: { id: "dossier", code: "FILE 02", signal: "IDENTITY DOSSIER SCANNED" },
  skills: { id: "matrix", code: "NODE 03", signal: "STAT MATRIX CALIBRATED" },
  projects: { id: "heist", code: "VAULT 04", signal: "HEIST MAP ARMED" },
  experience: { id: "velocity", code: "RUN 05", signal: "CAREER ROUTE ENGAGED" },
  academy: { id: "training", code: "DRILL 06", signal: "TRAINING GRID READY" },
  contact: { id: "signal", code: "COMMS 07", signal: "OPEN CHANNEL ACQUIRED" },
} as const;

export type SectionMissionVariant = (typeof sectionMissionVariants)[keyof typeof sectionMissionVariants];

export function getSectionMissionTitle(sectionId: string) {
  return sectionMissionTitles[sectionId] ?? "Vice Signal Operation";
}

export function getSectionMissionVariant(sectionId: string): SectionMissionVariant {
  return sectionMissionVariants[sectionId as keyof typeof sectionMissionVariants] ?? sectionMissionVariants.start;
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
