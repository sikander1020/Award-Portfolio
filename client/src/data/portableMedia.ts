import type { ScreenId } from "./portfolioData";

/**
 * Public delivery URLs for the Vercel deployment. The media release is kept
 * separate from the app bundle so large approved videos and audio files do not
 * block frontend deployment builds.
 */
const githubReleaseBase = "https://github.com/sikander1020/Award-Portfolio/releases/download/portfolio-media-v1";

// Vercel rewrites this same-origin route to the approved GitHub Release assets.
// Keeping production media on the portfolio origin lets mobile Safari/Chrome
// receive explicit MIME types and range-friendly CDN delivery. The local
// full-stack preview continues to use the direct public assets because its
// Express development gateway does not own Vercel's rewrite rules.
const releaseBase = import.meta.env.DEV ? githubReleaseBase : "/portfolio-media";

const releaseAsset = (fileName: string) => `${releaseBase}/${fileName}`;
const directReleaseAsset = (fileName: string) => `${githubReleaseBase}/${fileName}`;

export const portableMedia = {
  cv: releaseAsset("Sikandar_Jadoon_AI_Automation_CV.pdf"),
  signalMark: releaseAsset("vice-signal-mark_62213c0b.png"),
  art: {
    start: releaseAsset("user-gta-hero-pose_a5bf3574.webp"),
    about: releaseAsset("user-gta-about-pose_4d2884ca.webp"),
    skills: releaseAsset("user-gta-skills-pose_87080bf9.webp"),
    projects: releaseAsset("user-gta-projects-pose_73e11eb7.webp"),
    experience: releaseAsset("user-gta-experience-pose_d56487d5.webp"),
  },
  video: {
    hero: releaseAsset("sikandar-hero-seamless-loop_67150277.mp4"),
    aboutAcademy: releaseAsset("sikandar-about-academy-seamless_b3d7b214.mp4"),
    skills: releaseAsset("sikandar-skills-seamless_10c06fd2.mp4"),
    experience: releaseAsset("sikandar-experience-original-quality_39e3eb8b.mp4"),
    rooftop: releaseAsset("sikandar-rooftop-seamless_b1cc01a8.mp4"),
  },
  projectExplainers: {
    n8nArchitecture: directReleaseAsset("n8n-workflow-hub-architecture.png"),
    forgeArchitecture: directReleaseAsset("forgeai-architecture.png"),
    n8nWalkthrough: directReleaseAsset("n8n-workflow-hub-walkthrough.mp4"),
    n8nWalkthroughPoster: directReleaseAsset("n8n-workflow-hub-walkthrough-poster.jpg"),
  },
  audio: {
    nightDrive: releaseAsset("vice-night-drive_b8777cf7.mp3"),
    neonCruise: releaseAsset("vice-radio-neon-cruise_01117322.mp3"),
    coastalAfterhours: releaseAsset("vice-radio-coastal-afterhours_cc66c69d.mp3"),
    navigation: releaseAsset("vice-nav_c81f2224.mp3"),
    bootReady: releaseAsset("vice-boot-ready_f783e2aa.mp3"),
    missionPassed: releaseAsset("vice-mission-passed_fb89ebaf.mp3"),
    // These compact cues are intentionally served straight from the release.
    // Unlike the larger approved media bundle, they are not copied into the
    // Vercel public directory, so using /portfolio-media would return the app
    // HTML document instead of an audio stream in production.
    missionTuning: {
      start: directReleaseAsset("mission-city-arrival.mp3"),
      about: directReleaseAsset("mission-character-file.mp3"),
      skills: directReleaseAsset("mission-operation-skills.mp3"),
      projects: directReleaseAsset("mission-project-heist.mp3"),
      experience: directReleaseAsset("mission-career-run.mp3"),
      academy: directReleaseAsset("mission-training-grounds.mp3"),
      contact: directReleaseAsset("mission-open-channel.mp3"),
    } satisfies Record<ScreenId, string>,
  },
} as const;
