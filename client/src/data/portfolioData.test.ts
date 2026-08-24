import { describe, expect, it } from "vitest";
import { portfolioData } from "./portfolioData";
import { portableMedia } from "./portableMedia";

describe("portfolioData real professional profile", () => {
  it("uses Sikandar's CV-verified identity and professional contact channel", () => {
    expect(portfolioData.profile.fullName).toBe("SIKANDAR JADOON");
    expect(portfolioData.profile.role).toBe("AI Automation Engineer");
    expect(portfolioData.profile.email).toBe("Jadoonsikander7@gmail.com");
  });

  it("exposes the public GitHub and LinkedIn profiles", () => {
    expect(portfolioData.profile.socials).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "GITHUB", href: "https://github.com/sikander1020" }),
        expect.objectContaining({ label: "LINKEDIN", href: "https://www.linkedin.com/in/sikandar-jadoon-117403313" }),
      ]),
    );
  });

  it("keeps the downloadable CV action and Contact profile destinations source-backed", () => {
    expect(portfolioData.profile.socials.map((social) => social.href)).toEqual([
      "https://github.com/sikander1020",
      "https://www.linkedin.com/in/sikandar-jadoon-117403313",
    ]);
  });

  it("expands case files with every CV- and GitHub-verified project", () => {
    expect(portfolioData.projects).toHaveLength(6);
    expect(portfolioData.projects.map((project) => project.title)).toEqual([
      "N8N Workflow Hub",
      "ForgeAI",
      "Sikandar Video Suite",
      "MediBot",
      "AI Ad Generator",
      "Zaybaash Storefront",
    ]);
    expect(portfolioData.projects.filter((project) => project.href).map((project) => project.href)).toEqual([
      "https://github.com/sikander1020/N8N-Workflows",
      "https://github.com/sikander1020/Forge-AI-Pentest-Assistant",
      "https://github.com/sikander1020/Facebook-Automation",
      "https://github.com/sikander1020/zaybaash",
    ]);
    expect(portfolioData.projects.filter((project) => !project.href).map((project) => project.title)).toEqual(["MediBot", "AI Ad Generator"]);
  });

  it("provides source-backed Problem, Solution and Result scanning cues for every project without inventing numeric outcomes", () => {
    expect(portfolioData.projects.every((project) => Boolean(project.caseStudy.problem) && Boolean(project.caseStudy.solution) && Boolean(project.caseStudy.result))).toBe(true);
    expect(JSON.stringify(portfolioData.projects)).not.toMatch(/saved \d+|\d+ users|\d+%/i);
    expect(portfolioData.profile.proofPills).toEqual(["AI AGENTS", "WORKFLOW AUTOMATION", "API INTEGRATIONS"]);
  });

  it("attaches labelled explainers only to the two verified top projects", () => {
    const [n8n, forgeAI, ...otherProjects] = portfolioData.projects;
    expect(n8n.explainer).toMatchObject({
      diagram: { src: portableMedia.projectExplainers.n8nArchitecture },
      walkthrough: {
        kind: "video",
        title: "6-SECOND ILLUSTRATIVE FLOW",
        poster: portableMedia.projectExplainers.n8nWalkthroughPoster,
      },
    });
    expect(forgeAI.explainer).toMatchObject({
      diagram: { src: portableMedia.projectExplainers.forgeArchitecture },
      walkthrough: { kind: "animated", title: "LIVE UI FLOW MAP" },
    });
    expect(otherProjects.every((project) => project.explainer === undefined)).toBe(true);
  });

  it("keeps every visual-first project explainer grouped as diagram plus a labelled walkthrough", () => {
    const explainers = portfolioData.projects.flatMap((project) => project.explainer ? [project.explainer] : []);
    expect(explainers).toHaveLength(2);
    expect(explainers.every((explainer) => Boolean(explainer.diagram.src) && Boolean(explainer.diagram.alt) && Boolean(explainer.walkthrough.title) && Boolean(explainer.walkthrough.summary))).toBe(true);
  });

  it("keeps source-backed skills non-quantified and experience project-based", () => {
    expect(portfolioData.skills.every((skill) => !("level" in skill))).toBe(true);
    expect(portfolioData.experience.map((item) => item.period)).toEqual([
      "SELECTED PROJECT",
      "SELECTED PROJECT",
      "DEVELOPMENT PRACTICE",
    ]);
    expect(portfolioData.profile.location).toBe("PAKISTAN");
    expect(portfolioData.profile).not.toHaveProperty("money");
    expect(portfolioData.ui.hudCode).toBe("SYS // 2026");
  });

  it("provides a unique stable identity for every Experience timeline entry", () => {
    const timelineKeys = portfolioData.experience.map((item) => `${item.period}-${item.role}`);
    expect(new Set(timelineKeys).size).toBe(portfolioData.experience.length);
  });

  it("keeps the approved static Hero source and its mobile focal configuration", () => {
    const hero = portfolioData.screens.find((screen) => screen.id === "start");
    expect(hero).toMatchObject({
      art: portableMedia.art.start,
      mobileFocus: "84%",
    });
  });

  it("maps each approved scene video only to its matching screen", () => {
    const portraitVideo = portableMedia.video.aboutAcademy;
    const rooftopVideo = portableMedia.video.rooftop;
    expect(portfolioData.media.sceneVideos).toMatchObject({
      about: { src: portraitVideo, ownerApproved: true },
      academy: { src: portraitVideo, ownerApproved: true },
      skills: { src: portableMedia.video.skills, ownerApproved: true },
      experience: { src: portableMedia.video.experience, ownerApproved: true },
      projects: { src: rooftopVideo, ownerApproved: true },
      contact: { src: rooftopVideo, ownerApproved: true },
    });
  });

  it("uses user-approved scene sources and preserves the original-quality Experience clip", () => {
    expect(Object.values(portfolioData.media.sceneVideos).every((video) => video?.ownerApproved)).toBe(true);
    expect(portfolioData.media.sceneVideos.experience).toMatchObject({
      src: portableMedia.video.experience,
    });
  });

  it("uses a visible high-resolution fit for active Hero, About and Academy videos", () => {
    const screens = Object.fromEntries(portfolioData.screens.map((screen) => [screen.id, screen]));
    expect(screens.about.visualFit).toBe("contain");
    expect(screens.academy.visualFit).toBe("contain");
    expect(screens.start.visualFit).toBe("cover");
    expect(screens.start.mobileVideoFit).toBe("cover");
    expect(screens.about).toMatchObject({ videoFit: "contain", mobileVideoFit: "contain", videoScale: 1.1, mobileVideoScale: 1.28 });
    expect(screens.academy).toMatchObject({ videoFit: "contain", mobileVideoFit: "contain", videoScale: 1.1, mobileVideoScale: 1.28 });
  });

  it("keeps the Hero video below the fixed navbar through a bottom-anchored safe framing", () => {
    const hero = portfolioData.screens.find((screen) => screen.id === "start");
    expect(hero).toMatchObject({
      videoScale: 0.96,
      mobileVideoScale: 0.92,
      videoTransformOrigin: "76% 100%",
      mobileVideoTransformOrigin: "84% 100%",
    });
  });

  it("keeps Skills and Projects scene media fully framed rather than cover-cropped", () => {
    const screens = Object.fromEntries(portfolioData.screens.map((screen) => [screen.id, screen]));
    expect(screens.skills).toMatchObject({ visualFit: "contain", videoFit: "contain", mobileVideoFit: "contain" });
    expect(screens.projects).toMatchObject({ visualFit: "contain", videoFit: "contain", mobileVideoFit: "contain" });
  });

  it("provides styled RPG stat metadata for every verified skill card", () => {
    expect(portfolioData.skills).toHaveLength(5);
    expect(portfolioData.skills.every((skill) => Boolean(skill.category) && Boolean(skill.status) && !("level" in skill))).toBe(true);
  });

  it("uses the supplied rooftop video as a copy-safe Contact scene with full mobile composition", () => {
    const contact = portfolioData.screens.find((screen) => screen.id === "contact");
    expect(contact).toMatchObject({
      videoFit: "cover",
      mobileVideoFit: "contain",
      videoScale: 1,
      mobileVideoScale: 1.18,
    });
  });

  it("keeps the supplied Experience rooftop video at full widescreen composition", () => {
    const experience = portfolioData.screens.find((screen) => screen.id === "experience");
    expect(experience).toMatchObject({
      videoFit: "contain",
      mobileVideoFit: "contain",
      videoScale: 1,
      mobileVideoScale: 1,
    });
  });
});
