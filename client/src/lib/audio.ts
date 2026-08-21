export type PlayableAudio = Pick<HTMLAudioElement, "currentTime" | "volume" | "play">;
export type AutoplayableAudio = PlayableAudio & Pick<HTMLAudioElement, "muted">;

export async function attemptAudioPlayback(audio: PlayableAudio | null, volume: number) {
  if (!audio) return false;
  try {
    audio.currentTime = 0;
    audio.volume = volume;
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

/** Starts background audio through a muted handoff that browser autoplay policies allow. */
export async function attemptBackgroundAutoplay(audio: AutoplayableAudio | null, volume: number) {
  if (!audio) return false;
  try {
    audio.currentTime = 0;
    audio.volume = volume;
    audio.muted = true;
    const didStart = await Promise.race([
      audio.play().then(() => true).catch(() => false),
      new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 1_500)),
    ]);
    if (!didStart) {
      audio.muted = true;
      return false;
    }
    audio.muted = false;
    return true;
  } catch {
    audio.muted = true;
    return false;
  }
}

/** UI interactions may play a cue only when the user has explicitly enabled sound. */
export function shouldPlayUiAudio(isMuted: boolean) {
  return !isMuted;
}

/** Keeps input feedback tactile without turning fast typing into a wall of audio. */
export function shouldPlayTypingCue({
  isMuted,
  now,
  lastCueAt,
  cooldownMs = 72,
}: {
  isMuted: boolean;
  now: number;
  lastCueAt: number;
  cooldownMs?: number;
}) {
  return shouldPlayUiAudio(isMuted) && now - lastCueAt >= cooldownMs;
}

export function shouldAutoStartBackgroundAudio({
  isBooting,
  hasUserMuted,
  hasAlreadyStarted,
}: {
  isBooting: boolean;
  hasUserMuted: boolean;
  hasAlreadyStarted: boolean;
}) {
  return !isBooting && !hasUserMuted && !hasAlreadyStarted;
}

export function shouldStartBlockedAutoplayOnUserInteraction({ hasUserMuted, isPaused }: { hasUserMuted: boolean; isPaused: boolean }) {
  return !hasUserMuted && isPaused;
}
