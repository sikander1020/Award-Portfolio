import { describe, expect, it } from "vitest";
import { getCareerDecoderMeta, projectMatchesHeatmap } from "./exploration";

const workflowProject = {
  title: "N8N Workflow Hub",
  type: "AI AUTOMATION PORTFOLIO",
  description: "A curated workflow collection for AI content and video automation.",
  stack: ["n8n", "RAG", "Pinecone", "Google Drive"],
};

describe("portfolio exploration helpers", () => {
  it("filters project heatmap categories using existing authentic project text", () => {
    expect(projectMatchesHeatmap(workflowProject, "ALL")).toBe(true);
    expect(projectMatchesHeatmap(workflowProject, "AI")).toBe(true);
    expect(projectMatchesHeatmap(workflowProject, "AUTOMATION")).toBe(true);
    expect(projectMatchesHeatmap(workflowProject, "BACKEND")).toBe(true);
    expect(projectMatchesHeatmap(workflowProject, "WEB")).toBe(false);
  });

  it("labels career decoder nodes deterministically without changing career records", () => {
    expect(getCareerDecoderMeta(0, 3)).toEqual({ channel: "DECODER NODE 01/03", state: "ROUTE INTEL" });
    expect(getCareerDecoderMeta(2, 3)).toEqual({ channel: "DECODER NODE 03/03", state: "CURRENT FOCUS" });
  });
});
