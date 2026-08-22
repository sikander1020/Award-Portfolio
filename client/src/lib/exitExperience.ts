export const exitFarewellCopy = {
  channel: "VICE SIGNAL / SESSION COMPLETE",
  heading: "THANKS FOR PLAYING",
  message: "The city stays open. Your mission log is saved.",
  action: "RETURN TO THE CITY",
} as const;

export function shouldDismissExitExperience(key: string) {
  return key === "Escape";
}
