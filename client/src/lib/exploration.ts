export const PROJECT_HEATMAP_FILTERS = ["ALL", "AI", "AUTOMATION", "WEB", "BACKEND"] as const;

export type ProjectHeatmapFilter = (typeof PROJECT_HEATMAP_FILTERS)[number];

type ProjectSearchable = {
  title: string;
  type: string;
  description: string;
  stack: readonly string[];
};

export function projectMatchesHeatmap(project: ProjectSearchable, filter: ProjectHeatmapFilter) {
  if (filter === "ALL") return true;
  const searchable = `${project.title} ${project.type} ${project.description} ${project.stack.join(" ")}`.toUpperCase();
  const terms: Record<Exclude<ProjectHeatmapFilter, "ALL">, string[]> = {
    AI: ["AI", "RAG", "CHATGPT", "AGENTS", "LLM"],
    AUTOMATION: ["AUTOMATION", "N8N", "WORKFLOW", "FFMPEG"],
    WEB: ["WEB", "NEXT.JS", "FLASK", "APPLICATION"],
    BACKEND: ["API", "MONGODB", "PINECONE", "SANDBOX"],
  };
  return terms[filter].some((term) => searchable.includes(term));
}

export function getCareerDecoderMeta(index: number, total: number) {
  return {
    channel: `DECODER NODE ${String(index + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`,
    state: index === total - 1 ? "CURRENT FOCUS" : "ROUTE INTEL",
  };
}
