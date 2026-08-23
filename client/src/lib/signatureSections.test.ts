import { describe, expect, it } from "vitest";
import { getMissionRouteMeta, getProjectEvidenceMeta, getSignalInterceptStatus } from "./signatureSections";

describe("signature portfolio section metadata", () => {
  it("preserves whether a project has a verified repository or a CV-backed dossier", () => {
    expect(getProjectEvidenceMeta({ code: "MISSION 01", href: "https://example.com/repo" }, 0)).toMatchObject({ caseId: "CASE-01", source: "VERIFIED REPOSITORY", status: "UPLINK AVAILABLE", marker: "M-01" });
    expect(getProjectEvidenceMeta({ code: "MISSION 04" }, 3)).toMatchObject({ caseId: "CASE-04", source: "CV-VERIFIED DOSSIER", status: "ARCHIVED RECORD" });
  });

  it("labels each experience item as an ordered route checkpoint", () => {
    expect(getMissionRouteMeta(0, 3)).toEqual({ checkpoint: "CHECKPOINT 01/03", status: "ROUTE LOGGED" });
    expect(getMissionRouteMeta(2, 3)).toEqual({ checkpoint: "CHECKPOINT 03/03", status: "CURRENT ROUTE" });
  });

  it("reports real contact form states without changing delivery behavior", () => {
    expect(getSignalInterceptStatus({ hasErrors: false, isSubmitting: false, submissionSuccess: false })).toBe("CHANNEL SECURE");
    expect(getSignalInterceptStatus({ hasErrors: true, isSubmitting: false, submissionSuccess: false })).toBe("SIGNAL NEEDS REVIEW");
    expect(getSignalInterceptStatus({ hasErrors: false, isSubmitting: true, submissionSuccess: false })).toBe("UPLINK IN PROGRESS");
    expect(getSignalInterceptStatus({ hasErrors: false, isSubmitting: false, submissionSuccess: true })).toBe("TRANSMISSION CONFIRMED");
  });
});
