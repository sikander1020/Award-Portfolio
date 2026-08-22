import type { ScreenId } from "./portfolioData";

/**

 * Production media uses the portfolio origin. Vercel rewrites this route to

 * the approved GitHub Release bundle while adding explicit media MIME headers

 * for dependable playback in mobile Safari and Chrome.

 */

const releaseBase = "/portfolio-media";
const githubReleaseBase = "https://github.com/sikander1020/Award-Portfolio/releases/download/portfolio-media-v1";



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
  
  audio: {
    
    nightDrive: releaseAsset("vice-night-drive_b8777cf7.mp3"),
    
    neonCruise: releaseAsset("vice-radio-neon-cruise_01117322.mp3"),
    
    coastalAfterhours: releaseAsset("vice-radio-coastal-afterhours_cc66c69d.mp3"),
    
    navigation: releaseAsset("vice-nav_c81f2224.mp3"),
    
    bootReady: releaseAsset("vice-boot-ready_f783e2aa.mp3"),
    
    missionPassed: releaseAsset("vice-mission-passed_fb89ebaf.mp3"),
    // Compact Mission Select cues live in the release rather than the Vercel
    // public directory. A same-origin path would otherwise fall through to
    // index.html and be rejected by the audio decoder.
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
























