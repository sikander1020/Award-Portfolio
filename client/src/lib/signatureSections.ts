export function getProjectEvidenceMeta({ code, href }: { code: string; href?: string }, index: number) {
  return {
    caseId: `CASE-${String(index + 1).padStart(2, "0")}`,
    source: href ? "VERIFIED REPOSITORY" : "CV-VERIFIED DOSSIER",
    status: href ? "UPLINK AVAILABLE" : "ARCHIVED RECORD",
    marker: code.replace("MISSION ", "M-")
  };
}

export function getMissionRouteMeta(index: number, total: number) {
  return {
    checkpoint: `CHECKPOINT ${String(index + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`,
    status: index === total - 1 ? "CURRENT ROUTE" : "ROUTE LOGGED",
  };
}

export function getSignalInterceptStatus({ hasErrors, isSubmitting, submissionSuccess }: { hasErrors: boolean; isSubmitting: boolean; submissionSuccess: boolean }) {
  if (isSubmitting) return "UPLINK IN PROGRESS";
  if (submissionSuccess) return "TRANSMISSION CONFIRMED";
  if (hasErrors) return "SIGNAL NEEDS REVIEW";
  return "CHANNEL SECURE";
}
