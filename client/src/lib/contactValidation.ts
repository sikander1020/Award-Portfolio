export type ContactField = "name" | "email" | "subject" | "message";

export type ContactFormValues = Record<ContactField, string>;
export type ContactFormErrors = Partial<Record<ContactField, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactField(field: ContactField, value: string): string | undefined {
  const trimmed = value.trim();

  if (field === "name") {
    if (!trimmed) return "NAME REQUIRED — ENTER YOUR CALLSIGN.";
    if (trimmed.length < 2) return "NAME TOO SHORT — USE 2+ CHARACTERS.";
    if (trimmed.length > 120) return "NAME LIMIT REACHED — USE 120 CHARACTERS OR LESS.";
    return undefined;
  }

  if (field === "email") {
    if (!trimmed) return "EMAIL REQUIRED — OPEN A REPLY CHANNEL.";
    if (!EMAIL_PATTERN.test(trimmed)) return "EMAIL SIGNAL INVALID — CHECK ADDRESS.";
    if (trimmed.length > 320) return "EMAIL LIMIT REACHED — USE 320 CHARACTERS OR LESS.";
    return undefined;
  }

  if (field === "subject") {
    if (!trimmed) return "SUBJECT REQUIRED — ADD A MISSION TITLE.";
    if (trimmed.length < 3) return "SUBJECT TOO SHORT — USE 3+ CHARACTERS.";
    if (trimmed.length > 180) return "SUBJECT LIMIT REACHED — USE 180 CHARACTERS OR LESS.";
    return undefined;
  }

  if (!trimmed) return "MESSAGE REQUIRED — WRITE YOUR TRANSMISSION.";
  if (trimmed.length < 10) return "TRANSMISSION TOO SHORT — USE 10+ CHARACTERS.";
  if (trimmed.length > 4000) return "TRANSMISSION LIMIT REACHED — USE 4000 CHARACTERS OR LESS.";
  return undefined;
}

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  return (Object.keys(values) as ContactField[]).reduce<ContactFormErrors>((errors, field) => {
    const error = validateContactField(field, values[field]);
    if (error) errors[field] = error;
    return errors;
  }, {});
}

/** Wanted Level rises only when a field first enters an invalid state. */
export function shouldEscalateWantedLevel(previousError: string | undefined, nextError: string | undefined) {
  return !previousError && Boolean(nextError);
}
