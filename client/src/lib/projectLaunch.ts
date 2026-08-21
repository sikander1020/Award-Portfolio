export const PROJECT_LAUNCH_DURATION_MS = 1100;

export function canLaunchGithubRepository(href?: string) {
  return Boolean(href);
}
