import { portableMedia } from "./portableMedia";

/**
 * GTA VI portfolio replica personalization map.
 * All profile content below is sourced from Sikandar Jadoon's supplied CV,
 * public GitHub repositories, and publicly indexed LinkedIn posts.
 */

export type ScreenId =
  | "start"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "academy"
  | "contact";

export type PortfolioScreen = {
  id: ScreenId;
  navLabel: string;
  subtitle: string;
  title: string;
  art: string;
  desktopFocus: string;
  mobileFocus: string;
  visualFit: "cover" | "contain";
  mobileVisualFit: "cover" | "contain";
  videoFit: "cover" | "contain";
  mobileVideoFit: "cover" | "contain";
  videoScale: number;
  mobileVideoScale: number;
  videoTransformOrigin?: string;
  mobileVideoTransformOrigin?: string;
};

type SceneMotionVideo = { src: string; ownerApproved: boolean };

export const portfolioData = {
  profile: {
    fullName: "SIKANDAR JADOON",
    shortName: "SIKANDAR",
    role: "AI Automation Engineer",
    location: "PAKISTAN",
    email: "Jadoonsikander7@gmail.com",
    availability: "SEEKING AI ENGINEERING ROLES",
    intro:
      "Software Engineering graduate with hands-on experience building AI-powered applications, automation systems and full-stack software projects.",
    valuePromise:
      "I build AI automation systems that connect real tools, streamline repetitive work and turn manual workflows into reliable software.",
    proofPills: ["AI AGENTS", "WORKFLOW AUTOMATION", "API INTEGRATIONS"],
    about:
      "Experienced with Python, Flask, AI integrations, video automation, AI agents, REST APIs, Git/GitHub and modern web technologies. Built independent projects including an AI-powered video automation platform and an AI penetration-testing assistant.",
    speciality: "AI AGENTS + WORKFLOWS",
    mode: "PYTHON + API INTEGRATION",
    socials: [
      { label: "GITHUB", href: "https://github.com/sikander1020" },
      { label: "LINKEDIN", href: "https://www.linkedin.com/in/sikandar-jadoon-117403313" },
    ],
  },
  ui: {
    // Decorative game-interface text only; it is not a professional/profile claim.
    hudCode: "SYS // 2026",
  },
  media: {
    // User-supplied and approved Hero motion source. Keep the static art as its poster/fallback.
    heroVideo: {
      src: portableMedia.video.hero,
      ownerApproved: true,
    },
    sceneVideos: {
      about: {
        src: portableMedia.video.aboutAcademy,
        ownerApproved: true,
      },
      academy: {
        src: portableMedia.video.aboutAcademy,
        ownerApproved: true,
      },
      skills: {
        src: portableMedia.video.skills,
        ownerApproved: true,
      },
      experience: {
        src: portableMedia.video.experience,
        ownerApproved: true,
      },
      projects: {
        src: portableMedia.video.rooftop,
        ownerApproved: true,
      },
      contact: {
        src: portableMedia.video.rooftop,
        ownerApproved: true,
      },
    } as Partial<Record<ScreenId, SceneMotionVideo>>,
  },
  screens: [
    {
      id: "start",
      navLabel: "START GAME",
      subtitle: "PLAYER ONE",
      title: "SIKANDAR AUTOMATES",
      art: portableMedia.art.start,
      desktopFocus: "76%",
      mobileFocus: "84%",
      visualFit: "cover",
      mobileVisualFit: "contain",
      videoFit: "cover",
      mobileVideoFit: "cover",
      videoScale: 0.96,
      mobileVideoScale: 0.92,
      videoTransformOrigin: "76% 100%",
      mobileVideoTransformOrigin: "84% 100%",
    },
    {
      id: "about",
      navLabel: "ABOUT ME",
      subtitle: "CHARACTER FILE",
      title: "ABOUT",
      art: portableMedia.art.about,
      desktopFocus: "86%",
      mobileFocus: "80%",
      visualFit: "contain",
      mobileVisualFit: "contain",
      videoFit: "contain",
      mobileVideoFit: "contain",
      videoScale: 1.1,
      mobileVideoScale: 1.28,
    },
    {
      id: "skills",
      navLabel: "SKILLS",
      subtitle: "SKILL TREE",
      title: "SKILLS",
      art: portableMedia.art.skills,
      desktopFocus: "79%",
      mobileFocus: "84%",
      visualFit: "contain",
      mobileVisualFit: "contain",
      videoFit: "contain",
      mobileVideoFit: "contain",
      videoScale: 1,
      mobileVideoScale: 1,
    },
    {
      id: "projects",
      navLabel: "PROJECTS",
      subtitle: "MISSION SELECT",
      title: "PROJECTS",
      art: portableMedia.art.projects,
      desktopFocus: "76%",
      mobileFocus: "81%",
      visualFit: "contain",
      mobileVisualFit: "contain",
      videoFit: "contain",
      mobileVideoFit: "contain",
      videoScale: 1,
      mobileVideoScale: 1,
    },
    {
      id: "experience",
      navLabel: "EXPERIENCE",
      subtitle: "MISSION LOG",
      title: "EXPERIENCE",
      art: portableMedia.art.experience,
      desktopFocus: "78%",
      mobileFocus: "83%",
      visualFit: "cover",
      mobileVisualFit: "contain",
      videoFit: "contain",
      mobileVideoFit: "contain",
      videoScale: 1,
      mobileVideoScale: 1,
    },
    {
      id: "academy",
      navLabel: "ACADEMY",
      subtitle: "TRAINING RECORD",
      title: "ACADEMY",
      art: portableMedia.art.about,
      desktopFocus: "86%",
      mobileFocus: "80%",
      visualFit: "contain",
      mobileVisualFit: "contain",
      videoFit: "contain",
      mobileVideoFit: "contain",
      videoScale: 1.1,
      mobileVideoScale: 1.28,
    },
    {
      id: "contact",
      navLabel: "CONTACT",
      subtitle: "OPEN CHANNEL",
      title: "CONTACT",
      art: portableMedia.art.projects,
      desktopFocus: "76%",
      mobileFocus: "81%",
      visualFit: "cover",
      mobileVisualFit: "contain",
      videoFit: "cover",
      mobileVideoFit: "contain",
      videoScale: 1,
      mobileVideoScale: 1.18,
    },
  ] satisfies PortfolioScreen[],
  skills: [
    { label: "Python & Automation", color: "#ff2c8a", category: "AUTO", status: "MAX STAT" },
    { label: "AI Agents & Workflows", color: "#ff7a45", category: "AGENT", status: "LVL 99" },
    { label: "LLM / API Integration", color: "#7d86ff", category: "MODEL", status: "UNLOCKED" },
    { label: "Full-Stack Engineering", color: "#d75dff", category: "BUILD", status: "LVL 95" },
    { label: "Video Automation", color: "#f2d37b", category: "MEDIA", status: "UNLOCKED" },
  ],
  experience: [
    {
      period: "SELECTED PROJECT",
      role: "ForgeAI — AI Pentest Assistant",
      detail: "AI-powered penetration-testing assistant with autonomous agent workflow, sandbox execution and API integration for security testing and bug-bounty workflows.",
    },
    {
      period: "SELECTED PROJECT",
      role: "Sikandar Video Suite",
      detail: "AI-powered video creation and automation platform built with Python, Flask, FFmpeg, MoviePy and Edge TTS for short-form content workflows.",
    },
    {
      period: "DEVELOPMENT PRACTICE",
      role: "Self-Directed Project Development",
      detail: "Technical experimentation across AI, automation, backend and web technologies.",
    },
  ],
  projects: [
    {
      code: "MISSION 01",
      title: "N8N Workflow Hub",
      type: "AI AUTOMATION PORTFOLIO",
      description: "A curated workflow collection for AI content, RAG assistants, inbox operations and video automation, organized for safe import and reuse.",
      stack: ["n8n", "RAG", "Pinecone", "Google Drive"],
      href: "https://github.com/sikander1020/N8N-Workflows",
      caseStudy: {
        problem: "Reusable automation flows need a clear, safe starting point instead of being rebuilt from scratch.",
        solution: "A curated n8n workflow hub organized for import, reuse and practical AI operations.",
        result: "Covers four workflow domains: AI content, RAG assistants, inbox operations and video automation.",
      },
      explainer: {
        diagram: {
          src: portableMedia.projectExplainers.n8nArchitecture,
          alt: "N8N Workflow Hub architecture showing a curated automation hub branching to AI content, RAG assistants, inbox operations, video workflows, import guidance, Pinecone and Google Drive.",
        },
        walkthrough: {
          kind: "video" as const,
          src: portableMedia.projectExplainers.n8nWalkthrough,
          poster: portableMedia.projectExplainers.n8nWalkthroughPoster,
          title: "6-SECOND ILLUSTRATIVE FLOW",
          summary: "A visual walkthrough of the four documented automation domains converging into a reusable workflow library.",
        },
      },
    },
    {
      code: "MISSION 02",
      title: "ForgeAI",
      type: "AI SECURITY ASSISTANT",
      description: "An AI-powered penetration-testing assistant for ethical security testing and bug-bounty workflows, combining agent guidance with sandbox execution and model integrations.",
      stack: ["TypeScript", "AI Agents", "Sandbox", "APIs"],
      href: "https://github.com/sikander1020/Forge-AI-Pentest-Assistant",
      caseStudy: {
        problem: "Ethical security workflows need guided investigation without losing control of execution steps.",
        solution: "An AI assistant that combines agent guidance, sandbox execution and model integrations.",
        result: "Brings agent workflows, sandbox execution and API-based model integrations into one project.",
      },
      explainer: {
        diagram: {
          src: portableMedia.projectExplainers.forgeArchitecture,
          alt: "ForgeAI architecture showing an authorized user, Next.js interface, API routes, agent orchestration, AI providers, sandbox options, Trigger.dev workflows, Convex data and WorkOS authentication.",
        },
        walkthrough: {
          kind: "animated" as const,
          title: "LIVE UI FLOW MAP",
          summary: "An in-page animated walkthrough of the documented request, agent, sandbox, workflow and persistence path; this is not a live product recording.",
          stages: ["AUTHORIZED REQUEST", "AGENT ORCHESTRATION", "AI + SANDBOX TOOLS", "DURABLE WORKFLOW", "PERSISTED OUTCOME"],
        },
      },
    },
    {
      code: "MISSION 03",
      title: "Sikandar Video Suite",
      type: "AI VIDEO AUTOMATION",
      description: "An AI-powered short-form video creation platform with voice generation, video merging, script-to-video workflows and a Flask-based processing interface.",
      stack: ["Python", "Flask", "FFmpeg", "Edge TTS"],
      href: "https://github.com/sikander1020/Facebook-Automation",
      caseStudy: {
        problem: "Short-form video production requires several repeatable creation and processing steps.",
        solution: "A Flask-based AI video workflow that coordinates scripts, voice, merging and processing.",
        result: "Connects script-to-video, voice generation, video merging and a processing interface in one flow.",
      },
      explainer: undefined,
    },
    {
      code: "MISSION 04",
      title: "MediBot",
      type: "AI HEALTH ASSISTANT",
      description: "A CV-verified Final Year Project: an AI-powered assistant built around automated responses, user assistance, system design, APIs and application development.",
      stack: ["AI Integration", "Automation", "APIs", "Software Engineering"],
      caseStudy: {
        problem: "Users need responsive assistance through a structured software system.",
        solution: "A final-year AI assistant project focused on automated responses, user support and API-led development.",
        result: "Combines automated responses, system design, APIs and application development in a verified academic project.",
      },
      explainer: undefined,
    },
    {
      code: "MISSION 05",
      title: "AI Ad Generator",
      type: "AI MARKETING TOOL",
      description: "A CV-verified web application that uses ChatGPT-based functionality to automate advertising and marketing content generation.",
      stack: ["ChatGPT", "AI Integration", "Web Application"],
      caseStudy: {
        problem: "Advertising and marketing teams often repeat the same content-generation tasks.",
        solution: "A web application using ChatGPT-based functionality for marketing content generation.",
        result: "Automates advertising and marketing content generation through an AI-integrated web application.",
      },
      explainer: undefined,
    },
    {
      code: "MISSION 06",
      title: "Zaybaash Storefront",
      type: "E-COMMERCE ENGINEERING",
      description: "A TypeScript-based clothing storefront with dynamic administration, coupons, reviews, MongoDB-backed data handling, SEO work and catalog event tracking.",
      stack: ["Next.js", "TypeScript", "MongoDB", "Meta Pixel"],
      href: "https://github.com/sikander1020/zaybaash",
      caseStudy: {
        problem: "A storefront needs more than a catalog: administration, promotions, data handling and discoverability must work together.",
        solution: "A TypeScript storefront with dynamic administration, MongoDB-backed data and commerce-facing integrations.",
        result: "Includes dynamic administration, coupons, reviews, SEO work and catalog event tracking.",
      },
      explainer: undefined,
    },
  ],
  academy: [
    { label: "SOFTWARE ENGINEERING", meta: "IQRA UNIVERSITY / 2022 — 2026" },
    { label: "MEDIBOT", meta: "FINAL YEAR PROJECT / AI HEALTH ASSISTANT" },
    { label: "SELF-DIRECTED PROJECTS", meta: "TECHNICAL EXPERIMENTATION" },
  ],
};
