import type { ScreenId } from "@/data/portfolioData";

export const portfolioSlotByScreen: Record<ScreenId, "hero" | "about" | "skills" | "projects" | "experience"> = {
  start: "hero",
  about: "about",
  skills: "skills",
  projects: "projects",
  experience: "experience",
  academy: "about",
  contact: "projects",
};

export type CurrentSlotAssets = Partial<Record<keyof typeof portfolioSlotByScreen extends never ? never : "hero" | "about" | "skills" | "projects" | "experience", { url: string }>>;

export function resolvePortfolioScreenArt(screenId: ScreenId, slots: CurrentSlotAssets | undefined, fallbackArt: string) {
  return slots?.[portfolioSlotByScreen[screenId]]?.url ?? fallbackArt;
}
