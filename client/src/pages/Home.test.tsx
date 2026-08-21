import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MissionPassedOverlay } from "./Home";

describe("MissionPassedOverlay", () => {
  it("renders a mission-complete confirmation for the selected project", () => {
    const markup = renderToStaticMarkup(<MissionPassedOverlay projectTitle="Neon Commerce" onDismiss={() => undefined} />);
    expect(markup).toContain("MISSION PASSED");
    expect(markup).toContain("Neon Commerce");
  });
});
