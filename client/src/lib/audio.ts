export type PlayableAudio = Pick<HTMLAudioElement, "currentTime" | "volume" | "play"> & Partial<Pick<HTMLAudioElement, "muted">>;
export type MissionCueAudio = PlayableAudio & Partial<Pick<HTMLAudioElement, "src" | "load" | "pause">>;
export type AutoplayableAudio = PlayableAudio & Pick<HTMLAudioElement, "muted">;

/** Kept intentionally quiet so the interface acknowledges actions without overpowering music. */
export const UI_CUE_VOLUME = 0.18;
export const BACKGROUND_MUSIC_VOLUME = 0.18;
export const MISSION_LOADING_CUE_VOLUME = 0.24;
export const MISSION_LOADING_BACKGROUND_VOLUME = 0.055;

export async function attemptAudioPlayback(audio: PlayableAudio | null, volume: number) {
  if (!audio) return false;
  try {
    audio.currentTime = 0;
    audio.volume = volume;
    // This helper is used only from deliberate user interactions. Explicitly
    // release a prior autoplay mute before starting the audible track or cue.
    if ("muted" in audio) audio.muted = false;
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

/**
 * Starts the selected Mission Select cue inside the pointer event that opened
 * the loader. This retains browser user activation, unlike effect-only playback
 * which can be rejected after React schedules the loading state update.
 */
export async function playMissionLoadingCue(audio: MissionCueAudio | null, source: string, volume: number) {
  if (!audio) return false;
  try {
    audio.pause?.();
    if (audio.src !== source) {
      audio.src = source;
      audio.load?.();
    }
    audio.currentTime = 0;
    audio.volume = volume;
    if ("muted" in audio) audio.muted = false;
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

/** Resumes an already-started background track without resetting its playhead. */
export async function resumeBackgroundAudio(audio: AutoplayableAudio | null, volume: number) {
  if (!audio) return false;
  try {
    audio.volume = volume;
    audio.muted = false;
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

export type UiAudioSource = "button" | "ambient" | "typing";

/** Interaction SFX stay disabled so a click can never create a duplicated or delayed cue. */
export function shouldPlayUiAudio(_isMuted: boolean, _source: UiAudioSource = "button") {
  return false;
}

/** Compatibility safeguard: typing never emits the navigation cue. */
export function shouldPlayTypingCue({ isMuted }: { isMuted: boolean; now: number; lastCueAt: number; cooldownMs?: number }) {
  return shouldPlayUiAudio(isMuted, "typing");
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

/** Allows only background music to recover after the first deliberate interaction. */
export function shouldStartBlockedAutoplayOnUserInteraction({ hasUserMuted, isPaused }: { hasUserMuted: boolean; isPaused: boolean }) {
  return !hasUserMuted && isPaused;
}

export function shouldResumeBackgroundAudio({
  isDocumentHidden,
  hasUserMuted,
  wasPlayingWhenHidden,
}: {
  isDocumentHidden: boolean;
  hasUserMuted: boolean;
  wasPlayingWhenHidden: boolean;
}) {
  return !isDocumentHidden && !hasUserMuted && wasPlayingWhenHidden;
}

/** The mission loader is the only deliberate non-music cue retained after UI SFX removal. */
export function shouldPlayMissionLoadingCue({
  isMuted,
  hasUserMuted,
  isDocumentHidden,
}: {
  isMuted: boolean;
  hasUserMuted: boolean;
  isDocumentHidden: boolean;
}) {
  return !isMuted && !hasUserMuted && !isDocumentHidden;
}
