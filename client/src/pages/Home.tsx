/**
 * GTA VI portfolio replica screen.
 * Design reminder: cinematic pause-menu stage with a fixed left navigation lane,
 * right-side key art, hot-pink active state, HUD micro-details and state-driven motion.
 */

import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, LayoutGroup, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Crosshair,
  Download,
  Gamepad2,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MoveUpRight,
  Radio,
  Send,
  Star,
  Trophy,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { portfolioData, type ScreenId } from "@/data/portfolioData";
import { portableMedia } from "@/data/portableMedia";
import { CONTACT_SUCCESS_VISIBLE_MS, getContactSuccessCopy } from "@/lib/contactFeedback";
import { submitContactTransmission } from "@/lib/contactDelivery";
import { shouldEscalateWantedLevel, validateContactField, validateContactForm, type ContactField, type ContactFormErrors, type ContactFormValues } from "@/lib/contactValidation";
import { cycleRadioStationIndex, radioStations } from "@/lib/radio";
import { BACKGROUND_MUSIC_VOLUME, MISSION_LOADING_CUE_VOLUME, attemptAudioPlayback, attemptBackgroundAutoplay, resumeBackgroundAudio, shouldAutoStartBackgroundAudio, shouldPlayMissionLoadingCue, shouldResumeBackgroundAudio, shouldStartBlockedAutoplayOnUserInteraction } from "@/lib/audio";
import { shouldRenderHeroMotion } from "@/lib/heroMotion";
import { getMobileMotionDurations } from "@/lib/mobileMotion";
import { canLaunchGithubRepository, PROJECT_LAUNCH_DURATION_MS } from "@/lib/projectLaunch";
import { getSectionMissionTitle, MENU_SECTION_LOADING_DURATION_MS, MENU_SECTION_REVEAL_DELAY_MS, shouldRunMenuTransition } from "@/lib/sectionTransition";
import { useIsMobile } from "@/hooks/useMobile";

const screenIndex = Object.fromEntries(portfolioData.screens.map((screen, index) => [screen.id, index]));
const cinematicEase = [0.22, 1, 0.36, 1] as const;
const sceneVideoWarmupSources = Array.from(new Set(Object.values(portfolioData.media.sceneVideos).map((video) => video?.src).filter(Boolean)));
const radarPositions = [[50, 22], [76, 34], [79, 61], [62, 80], [34, 77], [18, 51], [30, 29]] as const;

function useLiveClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setTime(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Home() {

  const [activeId, setActiveId] = useState<ScreenId>(() => {
    const requestedScreen = new URLSearchParams(window.location.search).get("screen");
    return requestedScreen && requestedScreen in screenIndex ? (requestedScreen as ScreenId) : "start";
  });
  const [selectedProject, setSelectedProject] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [launchingProject, setLaunchingProject] = useState<(typeof portfolioData.projects)[number] | null>(null);
  const [isBooting, setIsBooting] = useState(
    () => new URLSearchParams(window.location.search).get("preview") !== "scene",
  );
  const [isMuted, setIsMuted] = useState(false);
  const [hasUserMuted, setHasUserMuted] = useState(false);
  const [radioStationIndex, setRadioStationIndex] = useState(0);
  const [wantedLevel, setWantedLevel] = useState(0);
  const [missionPassed, setMissionPassed] = useState<string | null>(null);
  const [isMissionPreview, setIsMissionPreview] = useState(false);
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);
  const [sceneVideoFailures, setSceneVideoFailures] = useState<Partial<Record<ScreenId, boolean>>>({});
  const [loadingSection, setLoadingSection] = useState<ScreenId | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);
  const missionLoadingAudioRef = useRef<HTMLAudioElement>(null);
  const backgroundAudioStartAttemptedRef = useRef(false);
  const resumeBackgroundAfterVisibilityRef = useRef(false);
  const sectionTransitionSequenceRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 22, mass: 0.35 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 22, mass: 0.35 });
  const backgroundX = useTransform(smoothX, (value) => value * -0.65);
  const backgroundY = useTransform(smoothY, (value) => value * -0.52);
  const portraitX = useTransform(smoothX, (value) => value * 1.15);
  const portraitY = useTransform(smoothY, (value) => value * 0.72);
  const contentX = useTransform(smoothX, (value) => value * 0.18);
  const contentY = useTransform(smoothY, (value) => value * 0.12);
  const time = useLiveClock();
  const activeScreen = useMemo(
    () => portfolioData.screens.find((screen) => screen.id === activeId) ?? portfolioData.screens[0],
    [activeId],
  );
  const activeArt = activeScreen.art;
  const heroArt = portfolioData.screens[0].art;
  const hasOwnerApprovedHeroVideo = portfolioData.media.heroVideo.ownerApproved && Boolean(portfolioData.media.heroVideo.src);
  const renderHeroMotion = shouldRenderHeroMotion({
    activeScreen: activeId,
    reduceMotion,
    videoFailed: heroVideoFailed,
    hasOwnerApprovedSource: hasOwnerApprovedHeroVideo,
  });
  const activeSceneVideo = portfolioData.media.sceneVideos[activeId];
  const renderSceneMotion = Boolean(
    activeSceneVideo?.ownerApproved && activeSceneVideo.src && !reduceMotion && !sceneVideoFailures[activeId],
  );
  const renderMotionVideo = renderHeroMotion || renderSceneMotion;
  const activeMotionVideo = renderHeroMotion ? portfolioData.media.heroVideo : activeSceneVideo;
  const activeRadioStation = radioStations[radioStationIndex];

  const enableAudio = () => {
    backgroundAudioStartAttemptedRef.current = true;
    setHasUserMuted(false);
    setIsMuted(false);
    void attemptAudioPlayback(backgroundAudioRef.current, BACKGROUND_MUSIC_VOLUME).then((didPlay) => {
      if (!didPlay) setIsMuted(true);
    });
  };

  const startAudioAfterLoading = () => {
    if (!shouldAutoStartBackgroundAudio({
      isBooting: false,
      hasUserMuted,
      hasAlreadyStarted: backgroundAudioStartAttemptedRef.current,
    })) return;

    backgroundAudioStartAttemptedRef.current = true;
    void attemptBackgroundAutoplay(backgroundAudioRef.current, BACKGROUND_MUSIC_VOLUME).then((didPlay) => {
      if (didPlay) setIsMuted(false);
      else backgroundAudioStartAttemptedRef.current = false;
    });
  };

  const startBlockedAudioOnInteraction = () => {
    const backgroundAudio = backgroundAudioRef.current;
    if (!backgroundAudio || !shouldStartBlockedAutoplayOnUserInteraction({ hasUserMuted, isPaused: backgroundAudio.paused })) return;

    backgroundAudioStartAttemptedRef.current = true;
    setIsMuted(false);
    void attemptAudioPlayback(backgroundAudio, BACKGROUND_MUSIC_VOLUME).then((didPlay) => setIsMuted(!didPlay));
  };

  useEffect(() => {
    if (!isBooting) startAudioAfterLoading();
  }, [isBooting]);

  useEffect(() => {
    if (isBooting || isMuted) return;
    void attemptAudioPlayback(backgroundAudioRef.current, BACKGROUND_MUSIC_VOLUME);
  }, [radioStationIndex]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = backgroundAudioRef.current;
      if (document.hidden) {
        resumeBackgroundAfterVisibilityRef.current = Boolean(audio && !audio.paused && !isMuted && !hasUserMuted);
        audio?.pause();
        missionLoadingAudioRef.current?.pause();
        return;
      }

      if (shouldResumeBackgroundAudio({
        isDocumentHidden: document.hidden,
        hasUserMuted,
        wasPlayingWhenHidden: resumeBackgroundAfterVisibilityRef.current,
      })) {
        resumeBackgroundAfterVisibilityRef.current = false;
        void resumeBackgroundAudio(audio, BACKGROUND_MUSIC_VOLUME).then((didResume) => {
          if (!didResume) setIsMuted(true);
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [hasUserMuted, isMuted]);

  useEffect(() => {
    const cue = missionLoadingAudioRef.current;
    if (!loadingSection || !shouldPlayMissionLoadingCue({ isMuted, hasUserMuted, isDocumentHidden: document.hidden })) {
      cue?.pause();
      return;
    }

    void attemptAudioPlayback(cue, MISSION_LOADING_CUE_VOLUME);
    return () => cue?.pause();
  }, [loadingSection, isMuted, hasUserMuted]);

  const toggleAudio = () => {
    if (isMuted) {
      enableAudio();
      return;
    }
    backgroundAudioRef.current?.pause();
    resumeBackgroundAfterVisibilityRef.current = false;
    setIsMuted(true);
    setHasUserMuted(true);
  };

  const changeRadioStation = (direction: -1 | 1) => {
    setRadioStationIndex((current) => cycleRadioStationIndex(current, direction));
  };

  const registerWantedLevelError = () => setWantedLevel((current) => Math.min(5, current + 1));

  useEffect(() => () => {
    sectionTransitionSequenceRef.current += 1;
  }, []);

  const switchScreen = (id: ScreenId, cinematic = true) => {
    if (id === activeId) return;
    setMobileNavOpen(false);
    if (!cinematic || !shouldRunMenuTransition({ from: activeId, to: id, reduceMotion: Boolean(reduceMotion) })) {
      setActiveId(id);
      return;
    }

    const sequence = ++sectionTransitionSequenceRef.current;
    setLoadingSection(id);
    window.setTimeout(() => {
      if (sectionTransitionSequenceRef.current === sequence) setActiveId(id);
    }, MENU_SECTION_REVEAL_DELAY_MS);
    window.setTimeout(() => {
      if (sectionTransitionSequenceRef.current === sequence) setLoadingSection(null);
    }, MENU_SECTION_LOADING_DURATION_MS);
  };

  const handleMissionPassed = (projectTitle: string) => {
    setMissionPassed(projectTitle);
  };

  const handleContactMissionPassed = () => handleMissionPassed("CONTACT TRANSMISSION");

  const launchGithubRepository = (project: (typeof portfolioData.projects)[number]) => {
    if (!canLaunchGithubRepository(project.href)) {
      toast("CV-VERIFIED CASE FILE — no GitHub repository is available.");
      return;
    }

    setLaunchingProject(project);
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        if (project.href) window.location.assign(project.href);
      }, PROJECT_LAUNCH_DURATION_MS);
    });
  };

  const handlePointerParallax = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 15);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 11);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedScreen = params.get("screen");
    if (requestedScreen && requestedScreen in screenIndex) {
      setActiveId(requestedScreen as ScreenId);
    }
    if (params.get("mission") === "passed") {
      setIsBooting(false);
      setIsMissionPreview(true);
      setActiveId("projects");
      setMissionPassed(portfolioData.projects[0].title);
    }
  }, []);

  useEffect(() => {
    if (!missionPassed || isMissionPreview) return;
    const timer = window.setTimeout(() => setMissionPassed(null), 3200);
    return () => window.clearTimeout(timer);
  }, [missionPassed, isMissionPreview]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const currentIndex = screenIndex[activeId];
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      switchScreen(portfolioData.screens[(currentIndex + 1) % portfolioData.screens.length].id, false);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      switchScreen(portfolioData.screens[(currentIndex - 1 + portfolioData.screens.length) % portfolioData.screens.length].id, false);
    }
  };

  const sceneVisualStyle = {
    "--scene-image": `url(${activeArt})`,
    "--scene-focus": activeScreen.desktopFocus,
    "--scene-mobile-focus": activeScreen.mobileFocus,
    "--scene-fit": activeScreen.visualFit,
    "--scene-mobile-fit": activeScreen.mobileVisualFit,
    "--scene-video-fit": activeScreen.videoFit,
    "--scene-mobile-video-fit": activeScreen.mobileVideoFit,
    "--scene-video-scale": activeScreen.videoScale,
    "--scene-mobile-video-scale": activeScreen.mobileVideoScale,
    "--scene-video-origin": activeScreen.videoTransformOrigin ?? `${activeScreen.desktopFocus} center`,
    "--scene-mobile-video-origin": activeScreen.mobileVideoTransformOrigin ?? `${activeScreen.mobileFocus} center`,
  } as CSSProperties;
  const motionDurations = getMobileMotionDurations({ isMobile, reduceMotion: Boolean(reduceMotion) });
  const sceneTransition = { duration: motionDurations.scene, ease: cinematicEase };
  const panelTransition = { duration: motionDurations.panel, ease: cinematicEase };

  return (
    <main
      className="vice-portfolio"
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerParallax}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      onPointerDownCapture={startBlockedAudioOnInteraction}
      tabIndex={0}
      aria-label="Interactive portfolio game menu"
    >
      <audio ref={backgroundAudioRef} loop preload="metadata"><source src={activeRadioStation.src} type="audio/mpeg" /></audio>
      <audio ref={missionLoadingAudioRef} preload="auto"><source src={portableMedia.audio.missionTuning} type="audio/mpeg" /></audio>
      <AnimatePresence>
        {isBooting && <BootIntro heroArt={heroArt} onComplete={() => setIsBooting(false)} onEnableAudio={enableAudio} />}
      </AnimatePresence>
      {!isBooting && !reduceMotion && <div className="scene-video-warmup" aria-hidden="true">
        {sceneVideoWarmupSources.map((src) => <video key={src} src={src} preload="auto" muted playsInline />)}
      </div>}
      <AnimatePresence>
        {missionPassed && <MissionPassedOverlay projectTitle={missionPassed} onDismiss={() => { setMissionPassed(null); setIsMissionPreview(false); }} />}
      </AnimatePresence>
      <AnimatePresence>
        {launchingProject && <ProjectLaunchOverlay project={launchingProject} />}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={`backdrop-${activeScreen.id}`}
          className={`scene-backdrop ${renderMotionVideo ? "is-scene-motion" : ""}`}
          style={{ ...sceneVisualStyle, x: backgroundX, y: backgroundY }}
          initial={reduceMotion ? false : { opacity: 0, scale: isMobile ? 1.025 : 1.07 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: isMobile ? 1.018 : 1.035 }}
          transition={sceneTransition}
          aria-hidden="true"
        />
      </AnimatePresence>
      <AnimatePresence initial={false} mode="sync">
        {!renderMotionVideo && <motion.div
            key={`portrait-${activeScreen.id}`}
            className="scene-portrait-layer"
            style={{ ...sceneVisualStyle, x: portraitX, y: portraitY }}
            initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
            transition={{ ...sceneTransition, delay: reduceMotion ? 0 : 0.06 }}
            aria-hidden="true"
          />}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {renderMotionVideo && activeMotionVideo && <motion.video
          key={`approved-motion-${activeScreen.id}`}
          className="scene-motion-video"
          style={sceneVisualStyle}
          src={activeMotionVideo.src}
          poster={activeArt}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onError={() => {
            if (activeId === "start") setHeroVideoFailed(true);
            else setSceneVideoFailures((current) => ({ ...current, [activeId]: true }));
          }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.38, ease: cinematicEase }}
          aria-hidden="true"
        />}
      </AnimatePresence>
      <motion.div className="ambient-bloom" style={{ x: portraitX, y: portraitY }} aria-hidden="true" />
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={`wipe-${activeScreen.id}`}
          className="scene-wipe"
          initial={reduceMotion ? false : { x: "-135%", opacity: 0 }}
          animate={reduceMotion ? { opacity: 0 } : { x: "135%", opacity: [0, 1, 0] }}
          transition={{ duration: motionDurations.wipe, ease: cinematicEase }}
          aria-hidden="true"
        />
      </AnimatePresence>
      <div className="scene-dust" aria-hidden="true" />
      <div className="grain-layer" aria-hidden="true" />

      <header className="top-hud" aria-label="Portfolio status">
        <div className="hud-left">
          <div className="signal-mark-wrap">
            <img src={portableMedia.signalMark} alt="Vice Signal logo" className="signal-mark" />
          </div>
          <span className="hud-status"><Radio size={12} /> LIVE PROFILE</span>
          <span className="hud-divider" />
          <span className="hud-muted">AUTOSAVE ON</span>
        </div>
        <div className="hud-right">
          <a
            className="hud-cv-download"
            href={portableMedia.cv}
            download="Sikandar_Jadoon_AI_Automation_CV.pdf"
            aria-label="Download Sikandar Jadoon's CV"
          >
            <Download size={13} /> DOWNLOAD CV
          </a>
          <div className={`hud-radio hud-radio-minimal ${isMuted ? "is-muted" : ""}`} aria-label="Radio station player">
            <button type="button" className="hud-radio-toggle" onClick={toggleAudio} aria-label={isMuted ? "Turn music on" : "Turn music off"}>{isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}<span><b className="music-prefix">MUSIC </b>{isMuted ? "OFF" : "ON"}</span></button>
            <button type="button" className="hud-radio-step" onClick={() => changeRadioStation(1)} aria-label={`Change track; current station is ${activeRadioStation.title}`}><span>TRACK</span><ChevronRight size={12} /></button>
            <span className="sr-only" aria-live="polite">{activeRadioStation.title}</span>
          </div>
          <span className="hud-time"><Clock3 size={13} /> {time}</span>
          <span className="hud-money">{portfolioData.ui.hudCode}</span>
          <span className="wanted" aria-label={`Wanted Level ${wantedLevel} of 5`} aria-live="polite">
            {Array.from({ length: 5 }).map((_, index) => <Star key={index} className={index < wantedLevel ? "is-active" : ""} size={13} fill="currentColor" />)}
          </span>
        </div>
      </header>

      <section className="game-shell">
        <aside className="interface-rail" aria-label="Portfolio navigation">
          <div className="mobile-rail-header">
            <div className="wordmark" aria-label={`${portfolioData.profile.fullName} Builds`}>
              <span>{portfolioData.profile.shortName}</span>
              <strong>BUILDS</strong>
            </div>
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <button
                type="button"
                className="mobile-nav-trigger"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open portfolio navigation"
                aria-expanded={mobileNavOpen}
              >
                <Menu size={18} />
                <span>MENU</span>
              </button>
              <SheetContent side="left" className="mobile-nav-sheet">
                <SheetTitle className="mobile-nav-title">MISSION SELECT</SheetTitle>
                <nav className="mobile-nav-list" aria-label="Mobile portfolio sections">
                  {portfolioData.screens.map((screen, index) => {
                    const active = activeId === screen.id;
                    return (
                      <button
                        key={screen.id}
                        type="button"
                        className={`mobile-nav-item ${active ? "is-active" : ""}`}
                        onClick={() => switchScreen(screen.id)}
                        aria-current={active ? "page" : undefined}
                      >
                        <span>0{index + 1}</span>
                        <strong>{screen.navLabel}</strong>
                        <ChevronRight size={16} />
                      </button>
                    );
                  })}
                  <button type="button" className="mobile-nav-item mobile-nav-exit" onClick={() => { setMobileNavOpen(false); toast("SESSION PAUSED — your progress is safe."); }}>
                    <span>08</span><strong>EXIT GAME</strong><MoveUpRight size={15} />
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <div className="rail-meta">
            <span className="pulse-dot" />
            <span>{portfolioData.profile.availability}</span>
          </div>

          <LayoutGroup id="pause-menu-navigation">
            <nav className="game-nav" aria-label="Portfolio sections">
              {portfolioData.screens.map((screen, index) => {
                const active = activeId === screen.id;
                return (
                  <motion.button
                    key={screen.id}
                    type="button"
                    className={`nav-item ${active ? "is-active" : ""}`}
                    onClick={() => switchScreen(screen.id)}
                    aria-pressed={active}
                    whileHover={reduceMotion ? undefined : { x: 4 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  >
                    {active && <motion.span layoutId="active-menu-runner" className="nav-motion-indicator" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                    <span className="nav-index">0{index + 1}</span>
                    <span className="nav-label">{screen.navLabel}</span>
                    <ChevronRight size={14} className="nav-arrow" />
                  </motion.button>
                );
              })}
              <button
                type="button"
                className="nav-item exit-item"
                onClick={() => toast("SESSION PAUSED — your progress is safe.")}
              >
                <span className="nav-index">08</span>
                <span className="nav-label">EXIT GAME</span>
                <MoveUpRight size={13} className="nav-arrow" />
              </button>
            </nav>
          </LayoutGroup>

          <div className="rail-footer">
            <button type="button" className="rail-audio-toggle" onClick={toggleAudio}>{isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />} RADIO: {isMuted ? "OFF" : "ON"}</button>
            <span>BUILD v1.0.0</span>
          </div>
        </aside>

      <AnimatePresence>
        {loadingSection && <SectionMissionLoadingOverlay screen={portfolioData.screens.find((screen) => screen.id === loadingSection) ?? activeScreen} />}
      </AnimatePresence>
      <motion.section className="content-stage" style={{ x: contentX, y: contentY }} aria-live="polite">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={`chapter-${activeScreen.id}`}
              className="chapter-head"
              initial={reduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ ...panelTransition, delay: reduceMotion ? 0 : 0.05 }}
            >
              <span className="chapter-rule" />
              <span>{activeScreen.subtitle}</span>
              <span className="chapter-count">{String(screenIndex[activeScreen.id] + 1).padStart(2, "0")} / 07</span>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeScreen.id}
              className={`screen-pane screen-${activeScreen.id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 15, filter: isMobile ? "blur(3px)" : "blur(8px)" }}
              animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={panelTransition}
            >
              {activeId === "start" && <StartScreen onEnter={() => switchScreen("about")} />}
              {activeId === "about" && <AboutScreen />}
              {activeId === "skills" && <SkillsScreen />}
              {activeId === "projects" && <ProjectsScreen selectedProject={selectedProject} onSelectProject={setSelectedProject} onMissionPassed={handleMissionPassed} onLaunchRepository={launchGithubRepository} />}
              {activeId === "experience" && <ExperienceScreen />}
              {activeId === "academy" && <AcademyScreen />}
              {activeId === "contact" && <ContactScreen onTypingCue={() => undefined} onSocialActivate={() => undefined} onMissionPassed={handleContactMissionPassed} onValidationError={registerWantedLevelError} />}
            </motion.div>
          </AnimatePresence>

          <div className="stage-controls">
            <span><Crosshair size={14} /> USE ↑ ↓ TO SELECT</span>
            <span><Gamepad2 size={14} /> ENTER TO OPEN</span>
          </div>
        </motion.section>

        <aside className="side-hud" aria-label="Game HUD">
          <div className="side-hud-item"><Trophy size={15} /><span>100%</span><small>DRIVE</small></div>
          <div className="side-hud-item"><BriefcaseBusiness size={15} /><span>24</span><small>MISSIONS</small></div>
          <div className="side-hud-item"><GraduationCap size={15} /><span>07</span><small>UPGRADES</small></div>
        </aside>

        <nav className="bottom-map radar-menu" aria-label="Radar section navigation">
          <div className="map-grid" />
          <MapPin size={14} className="map-pin" />
          {portfolioData.screens.map((screen, index) => <button key={screen.id} type="button" className={`radar-node ${activeId === screen.id ? "is-active" : ""}`} style={{ "--radar-x": `${radarPositions[index][0]}%`, "--radar-y": `${radarPositions[index][1]}%` } as CSSProperties} onClick={() => switchScreen(screen.id)} aria-label={`Navigate to ${screen.navLabel}`} aria-current={activeId === screen.id ? "page" : undefined}><span>{String(index + 1).padStart(2, "0")}</span></button>)}
          <span className="map-label">{activeScreen.navLabel.toUpperCase()}</span>
        </nav>
      </section>
    </main>
  );
}

function BootIntro({ heroArt, onComplete, onEnableAudio }: { heroArt: string; onComplete: () => void; onEnableAudio: () => void }) {
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const completeOnce = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setProgress(100);
    window.setTimeout(() => window.requestAnimationFrame(() => onCompleteRef.current()), 180);
  };

  useEffect(() => {
    if (reduceMotion) {
      setProgress(100);
      const reducedTimer = window.setTimeout(completeOnce, 180);
      return () => window.clearTimeout(reducedTimer);
    }

    let frame = 0;
    const startedAt = performance.now();
    const duration = 3150;
    const update = (now: number) => {
      const raw = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(Math.round(eased * 100));
      if (raw < 1) {
        frame = window.requestAnimationFrame(update);
      } else {
        completeOnce();
      }
    };
    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion]);

  const missionLine = progress < 28 ? "SYNCING CITY GRID" : progress < 64 ? "LOADING CHARACTER FILE" : progress < 92 ? "ARMING THE INTERFACE" : "MISSION READY";

  return (
    <motion.section
      className="boot-intro"
      initial={{ opacity: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.025, filter: "blur(7px)" }}
      transition={{ duration: reduceMotion ? 0.12 : 0.54, ease: cinematicEase }}
      aria-live="polite"
      aria-label="Portfolio loading cinematic"
    >
      <motion.div
        className="boot-art"
        style={{ "--boot-art": `url(${heroArt})` } as CSSProperties}
        initial={reduceMotion ? false : { scale: 1.12, x: 30 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ duration: reduceMotion ? 0 : 3.3, ease: cinematicEase }}
        aria-hidden="true"
      />
      <div className="boot-shade" aria-hidden="true" />
      <div className="boot-scanlines" aria-hidden="true" />
      <div className="boot-corner boot-corner-tl" aria-hidden="true" />
      <div className="boot-corner boot-corner-br" aria-hidden="true" />

      <div className="boot-topline">
        <div className="boot-brand"><img src={portableMedia.signalMark} alt="" /><span>VICE SIGNAL / ONLINE</span></div>
        <span>SESSION 01 — {String(progress).padStart(3, "0")}%</span>
      </div>

      <motion.div
        className="boot-content"
        initial={reduceMotion ? false : { opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.72, delay: reduceMotion ? 0 : 0.18, ease: cinematicEase }}
      >
        <span className="boot-kicker">PERSONAL PORTFOLIO / BOOT SEQUENCE</span>
        <h1>WELCOME TO<br /><em>THE CITY.</em></h1>
        {progress < 92 && <div className="boot-file"><span>PLAYER</span><strong>{portfolioData.profile.shortName}</strong><span>CLASS</span><strong>{portfolioData.profile.role}</strong></div>}
      </motion.div>

      <div className={`boot-loader ${progress === 100 ? "is-complete" : ""}`}>
        <div className="boot-loader-meta"><span>{missionLine}</span><strong>{String(progress).padStart(3, "0")}%</strong></div>
        <div className="boot-progress-track"><motion.i animate={{ scaleX: progress / 100 }} transition={{ duration: 0.12, ease: "linear" }} /></div>
        {progress < 100 && <div className="boot-loader-footer"><span>DO NOT SWITCH OFF THE CONSOLE</span><span>BUILD 1.0.0</span></div>}
      </div>

      <button type="button" className="boot-sound" onClick={onEnableAudio}><Volume2 size={14} /> ENABLE SOUND</button>
      <button type="button" className="boot-skip" onClick={() => { onEnableAudio(); onComplete(); }}>SKIP INTRO <ChevronRight size={15} /></button>
    </motion.section>
  );
}

function StartScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="start-screen">
      <span className="eyebrow">INTERACTIVE PORTFOLIO / 2026</span>
      <h1>
        AI AGENTS.<br />
        <em>REAL IMPACT.</em>
      </h1>
      <p>{portfolioData.profile.intro}</p>
      <button type="button" className="primary-mission" onClick={onEnter}>
        <span>ENTER CHARACTER FILE</span><ArrowUpRight size={17} />
      </button>
      <div className="mission-strip">
        <span>MISSION STATUS</span><strong>READY TO PLAY</strong><span className="mission-light" />
      </div>
    </div>
  );
}

function AboutScreen() {
  return (
    <div className="detail-card about-card">
      <span className="section-label">01 / PERSONAL INTEL</span>
      <h2>ABOUT <em>ME</em></h2>
      <p className="large-copy">{portfolioData.profile.about}</p>
      <dl className="intel-grid">
        <div><dt>ROLE</dt><dd>{portfolioData.profile.role}</dd></div>
        <div><dt>BASE</dt><dd>{portfolioData.profile.location}</dd></div>
        <div><dt>SPECIALITY</dt><dd>{portfolioData.profile.speciality}</dd></div>
        <div><dt>MODE</dt><dd>{portfolioData.profile.mode}</dd></div>
      </dl>
    </div>
  );
}

function SkillsScreen() {
  const [selectedSkill, setSelectedSkill] = useState(0);
  const skillSegments = [10, 10, 10, 10, 9];
  return (
    <div className="detail-card skills-card">
      <span className="section-label">02 / STAT SHEET</span>
      <h2>SKILLS <em>UNLOCKED</em></h2>
      <div className="skills-list">
        {portfolioData.skills.map((skill, index) => (
          <button
            type="button"
            className={`skill-card ${selectedSkill === index ? "is-selected" : ""}`}
            key={skill.label}
            onClick={() => setSelectedSkill(index)}
            style={{ "--skill-accent": skill.color, "--skill-index": index } as CSSProperties}
            aria-pressed={selectedSkill === index}
          >
            <span className="skill-card-topline"><span className="skill-number">0{index + 1}</span><span className="skill-category">{skill.category}</span><span className="skill-status">[ {skill.status} ]</span></span>
            <span className="skill-name">{skill.label}</span>
            <span className="skill-bar" aria-label={`${skill.label} RPG stat meter`}>
              {Array.from({ length: 10 }).map((_, segment) => <i key={segment} className={segment < skillSegments[index] ? "is-filled" : ""} style={{ "--segment-index": segment } as CSSProperties} />)}
            </span>
            <span className="skill-level">STAT METER</span>
          </button>
        ))}
      </div>
        <p className="micro-copy">BUILD PRACTICAL SYSTEMS. AUTOMATE THE REPETITIVE WORK.</p>
    </div>
  );
}

function ProjectsScreen({ selectedProject, onSelectProject, onMissionPassed, onLaunchRepository }: { selectedProject: number; onSelectProject: (index: number) => void; onMissionPassed: (projectTitle: string) => void; onLaunchRepository: (project: (typeof portfolioData.projects)[number]) => void }) {
  const project = portfolioData.projects[selectedProject];
  return (
    <div className="projects-layout">
      <div className="project-select" aria-label="Project selector">
        {portfolioData.projects.map((item, index) => (
          <button key={item.title} type="button" onClick={() => onSelectProject(index)} className={`project-tab ${selectedProject === index ? "is-selected" : ""}`}>
            <span>{item.code}</span><strong>{item.title}</strong><ChevronRight size={14} />
          </button>
        ))}
      </div>
      <article className="project-detail" key={project.title}>
        <span className="section-label">{project.type}</span>
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <div className="tag-row">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="project-actions">
          {project.href ? <button type="button" className="text-action" onClick={() => onLaunchRepository(project)}>OPEN GITHUB REPOSITORY <ArrowUpRight size={15} /></button> : <span className="project-source-note">CV-VERIFIED CASE FILE</span>}
          <button type="button" className="text-action mission-action" onClick={() => onMissionPassed(project.title)}>
            COMPLETE MISSION <ArrowUpRight size={15} />
          </button>
        </div>
      </article>
    </div>
  );
}

function ProjectLaunchOverlay({ project }: { project: (typeof portfolioData.projects)[number] }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.section className="project-launch-overlay" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.18, ease: cinematicEase }} role="status" aria-live="assertive">
      <div className="project-launch-grid" aria-hidden="true" />
      <div className="project-launch-card"><span>VICE SIGNAL / SECURE UPLINK</span><h2>LAUNCHING<br /><em>MISSION</em></h2><p>{project.title.toUpperCase()}</p><div className="project-launch-track"><i /></div><small>CONNECTING TO VERIFIED GITHUB REPOSITORY</small></div>
    </motion.section>
  );
}

function SectionMissionLoadingOverlay({ screen }: { screen: { id: ScreenId; navLabel: string; subtitle: string } }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.section className="section-mission-overlay" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.12, ease: cinematicEase }} role="status" aria-live="polite">
      <div className="section-mission-grid" aria-hidden="true" />
      <motion.div className="section-mission-card" initial={reduceMotion ? false : { opacity: 0, y: 14, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduceMotion ? 0 : 0.2, ease: cinematicEase }}>
        <span>VICE SIGNAL / MISSION SELECT</span>
        <h2>LOADING<br /><em>{getSectionMissionTitle(screen.id)}</em></h2>
        <p>PREPARING {screen.subtitle}</p>
        <div className="section-mission-track"><i /></div>
        <small>SYNCING CITY GRID • PLEASE STAND BY</small>
      </motion.div>
    </motion.section>
  );
}

export function MissionPassedOverlay({ projectTitle, onDismiss }: { projectTitle: string; onDismiss: () => void }) {
  const reduceMotion = useReducedMotion();
  const isContactTransmission = projectTitle === "CONTACT TRANSMISSION";
  return (
    <motion.section
      className="mission-passed-overlay"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.32, ease: cinematicEase }}
      role="status"
      aria-live="assertive"
    >
      <motion.div className="mission-passed-flash" initial={reduceMotion ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduceMotion ? 0 : 0.52, ease: cinematicEase }} />
      <motion.div className="mission-passed-card" initial={reduceMotion ? false : { opacity: 0, y: 34, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: reduceMotion ? 0 : 0.54, delay: reduceMotion ? 0 : 0.18, ease: cinematicEase }}>
        <span>{isContactTransmission ? "VICE SIGNAL / TRANSMISSION COMPLETE" : "VICE SIGNAL / CASE FILE COMPLETE"}</span>
        <h2>MISSION<br /><em>PASSED</em></h2>
        <p>{isContactTransmission ? "MESSAGE DELIVERED — CHANNEL CONFIRMED" : `${projectTitle.toUpperCase()} — OBJECTIVE CLEARED`}</p>
        <button type="button" onClick={onDismiss}>{isContactTransmission ? "RETURN TO CONTACT" : "CONTINUE"} <ChevronRight size={16} /></button>
      </motion.div>
    </motion.section>
  );
}

function ExperienceScreen() {
  return (
    <div className="detail-card experience-card">
      <span className="section-label">04 / CAREER LOG</span>
      <h2>EXPERIENCE</h2>
      <div className="timeline-list">
        {portfolioData.experience.map((item) => (
          <article className="timeline-item" key={`${item.period}-${item.role}`}>
            <span className="timecode">{item.period}</span>
            <div><h3>{item.role}</h3><p>{item.detail}</p></div>
          </article>
        ))}
      </div>
    </div>
  );
}

function AcademyScreen() {
  return (
    <div className="detail-card academy-card">
      <span className="section-label">05 / TRAINING RECORD</span>
      <h2>ACADEMY</h2>
      <p className="large-copy">Training in software engineering, reinforced by self-directed work in AI, automation, backend systems and modern web development.</p>
      <div className="academy-list">
        {portfolioData.academy.map((item, index) => <div key={item.label}><span>0{index + 1}</span><strong>{item.label}</strong><small>{item.meta}</small></div>)}
      </div>
    </div>
  );
}

function ContactScreen({ onTypingCue, onSocialActivate, onMissionPassed, onValidationError }: { onTypingCue: () => void; onSocialActivate: () => void; onMissionPassed: () => void; onValidationError: () => void }) {
  const [form, setForm] = useState<ContactFormValues>({ name: "", email: "", subject: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Partial<Record<ContactField, boolean>>>({});
  const errorStateRef = useRef<ContactFormErrors>({});
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [notificationDelivered, setNotificationDelivered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const successTimerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => () => {
    if (successTimerRef.current !== null) window.clearTimeout(successTimerRef.current);
  }, []);

  const copyEmail = async () => {
    await navigator.clipboard?.writeText(portfolioData.profile.email);
    toast("COMMS CHANNEL COPIED.");
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateContactForm(form);
    (Object.keys(form) as ContactField[]).forEach((field) => {
      if (shouldEscalateWantedLevel(errorStateRef.current[field], errors[field])) onValidationError();
    });
    errorStateRef.current = errors;
    setFieldErrors(errors);
    setTouchedFields({ name: true, email: true, subject: true, message: true });
    if (Object.keys(errors).length > 0) {
      toast("TRANSMISSION BLOCKED — resolve the marked intel.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await submitContactTransmission(form);
      toast("MESSAGE TRANSMITTED — Sikandar has been notified.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setFieldErrors({});
      setTouchedFields({});
      errorStateRef.current = {};
      setNotificationDelivered(result.notificationDelivered);
      setSubmissionSuccess(true);
      onMissionPassed();
      if (successTimerRef.current !== null) window.clearTimeout(successTimerRef.current);
      successTimerRef.current = window.setTimeout(() => setSubmissionSuccess(false), CONTACT_SUCCESS_VISIBLE_MS);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Message transmission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: ContactField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setTouchedFields((current) => ({ ...current, [field]: true }));
    const error = validateContactField(field, value);
    if (shouldEscalateWantedLevel(errorStateRef.current[field], error)) onValidationError();
    errorStateRef.current = { ...errorStateRef.current, [field]: error };
    setFieldErrors((current) => ({ ...current, [field]: error }));
    onTypingCue();
  };

  const validateOnBlur = (field: ContactField) => {
    setTouchedFields((current) => ({ ...current, [field]: true }));
    const error = validateContactField(field, form[field]);
    if (shouldEscalateWantedLevel(errorStateRef.current[field], error)) onValidationError();
    errorStateRef.current = { ...errorStateRef.current, [field]: error };
    setFieldErrors((current) => ({ ...current, [field]: error }));
  };

  const fieldClass = (field: ContactField) => `contact-field ${touchedFields[field] && fieldErrors[field] ? "has-error" : ""}`;
  const errorId = (field: ContactField) => `contact-${field}-error`;

  return (
    <div className="contact-card">
      <span className="section-label">06 / OPEN CHANNEL</span>
      <h2>LET'S BUILD<br /><em>THE NEXT ONE.</em></h2>
      <p>For AI automation, agent workflows and practical software collaborations.</p>
      <a href={`mailto:${portfolioData.profile.email}`} className="contact-address"><Mail size={17} /> {portfolioData.profile.email}<ArrowUpRight size={17} /></a>
      <button type="button" className="copy-button" onClick={copyEmail}><Copy size={15} /> COPY CHANNEL</button>
      <form className="contact-form" onSubmit={submitContact}>
        <div className="contact-form-heading"><span>DIRECT TRANSMISSION</span><small>ALL FIELDS REQUIRED</small></div>
        <div className="contact-form-grid">
          <label className={fieldClass("name")}>
            <span>YOUR NAME</span>
            <input value={form.name} onChange={(event) => updateField("name", event.target.value)} onBlur={() => validateOnBlur("name")} maxLength={120} placeholder="NAME" autoComplete="name" disabled={isSubmitting} aria-invalid={Boolean(touchedFields.name && fieldErrors.name)} aria-describedby={touchedFields.name && fieldErrors.name ? errorId("name") : undefined} required />
            <AnimatePresence initial={false}>{touchedFields.name && fieldErrors.name && <motion.small id={errorId("name")} className="contact-field-error" role="alert" initial={reduceMotion ? false : { opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.16, ease: cinematicEase }}>{fieldErrors.name}</motion.small>}</AnimatePresence>
          </label>
          <label className={fieldClass("email")}>
            <span>EMAIL ADDRESS</span>
            <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} onBlur={() => validateOnBlur("email")} maxLength={320} placeholder="EMAIL@EXAMPLE.COM" autoComplete="email" disabled={isSubmitting} aria-invalid={Boolean(touchedFields.email && fieldErrors.email)} aria-describedby={touchedFields.email && fieldErrors.email ? errorId("email") : undefined} required />
            <AnimatePresence initial={false}>{touchedFields.email && fieldErrors.email && <motion.small id={errorId("email")} className="contact-field-error" role="alert" initial={reduceMotion ? false : { opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.16, ease: cinematicEase }}>{fieldErrors.email}</motion.small>}</AnimatePresence>
          </label>
        </div>
        <label className={fieldClass("subject")}>
          <span>SUBJECT</span>
          <input value={form.subject} onChange={(event) => updateField("subject", event.target.value)} onBlur={() => validateOnBlur("subject")} minLength={3} maxLength={180} placeholder="HOW CAN WE BUILD TOGETHER?" disabled={isSubmitting} aria-invalid={Boolean(touchedFields.subject && fieldErrors.subject)} aria-describedby={touchedFields.subject && fieldErrors.subject ? errorId("subject") : undefined} required />
          <AnimatePresence initial={false}>{touchedFields.subject && fieldErrors.subject && <motion.small id={errorId("subject")} className="contact-field-error" role="alert" initial={reduceMotion ? false : { opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.16, ease: cinematicEase }}>{fieldErrors.subject}</motion.small>}</AnimatePresence>
        </label>
        <label className={fieldClass("message")}>
          <span>MESSAGE</span>
          <textarea value={form.message} onChange={(event) => updateField("message", event.target.value)} onBlur={() => validateOnBlur("message")} minLength={10} maxLength={4000} placeholder="WRITE YOUR MESSAGE..." disabled={isSubmitting} aria-invalid={Boolean(touchedFields.message && fieldErrors.message)} aria-describedby={touchedFields.message && fieldErrors.message ? errorId("message") : undefined} required />
          <AnimatePresence initial={false}>{touchedFields.message && fieldErrors.message && <motion.small id={errorId("message")} className="contact-field-error" role="alert" initial={reduceMotion ? false : { opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.16, ease: cinematicEase }}>{fieldErrors.message}</motion.small>}</AnimatePresence>
        </label>
        <button type="submit" className="contact-submit" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? <><Spinner className="contact-submit-spinner" aria-hidden="true" /> TRANSMITTING...</> : <><Send size={14} /> SEND MESSAGE</>}
        </button>
        <AnimatePresence initial={false}>
          {submissionSuccess && <motion.div
            className="contact-success"
            role="status"
            aria-live="polite"
            initial={reduceMotion ? false : { opacity: 0, y: 11, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -7 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: cinematicEase }}
          >
            <div className="contact-success-sparks" aria-hidden="true">
              {Array.from({ length: 7 }).map((_, index) => <i key={index} style={{ "--spark": index } as CSSProperties} />)}
            </div>
            <span>TRANSMISSION RECEIVED</span>
            <strong>MESSAGE <em>SENT</em></strong>
            <small>{getContactSuccessCopy(notificationDelivered)}</small>
          </motion.div>}
        </AnimatePresence>
      </form>
      <div className="contact-social-panel" aria-label="Professional profiles">
        <span>MORE WAYS TO CONNECT</span>
        <div className="contact-socials">
          {portfolioData.profile.socials.map((social) => (
            <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={`Open Sikandar Jadoon's ${social.label} profile`} onClick={onSocialActivate}>
              <span className="social-weapon-wheel" aria-hidden="true" />
              <span className="social-link-icon">{social.label === "GITHUB" ? <Github size={14} /> : <Linkedin size={14} />}</span>
              <span className="social-link-label">{social.label} PROFILE</span>
              <span className="social-link-arrow"><ArrowUpRight size={13} /></span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
