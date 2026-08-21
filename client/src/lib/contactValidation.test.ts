import { describe, expect, it } from "vitest";
import { shouldEscalateWantedLevel, validateContactField, validateContactForm } from "./contactValidation";

describe("Contact form live validation", () => {
  it("reports a GTA-style message for an incomplete name", () => {
    expect(validateContactField("name", "S")).toBe("NAME TOO SHORT — USE 2+ CHARACTERS.");
  });

  it("rejects malformed email addresses and accepts a valid reply channel", () => {
    expect(validateContactField("email", "sikandar-at-example")).toBe("EMAIL SIGNAL INVALID — CHECK ADDRESS.");
    expect(validateContactField("email", "sikandar@example.com")).toBeUndefined();
  });

  it("returns every invalid field before a transmission can be sent", () => {
    expect(validateContactForm({ name: "", email: "", subject: "", message: "" })).toMatchObject({
      name: "NAME REQUIRED — ENTER YOUR CALLSIGN.",
      email: "EMAIL REQUIRED — OPEN A REPLY CHANNEL.",
      subject: "SUBJECT REQUIRED — ADD A MISSION TITLE.",
      message: "MESSAGE REQUIRED — WRITE YOUR TRANSMISSION.",
    });
  });

  it("keeps valid Contact details clear of local errors", () => {
    expect(validateContactForm({
      name: "Sikandar Jadoon",
      email: "sikandar@example.com",
      subject: "Automation consultation",
      message: "I would like to discuss an automation project.",
    })).toEqual({});
  });

  it("raises Wanted Level only for a newly detected field error", () => {
    expect(shouldEscalateWantedLevel(undefined, "EMAIL SIGNAL INVALID — CHECK ADDRESS.")).toBe(true);
    expect(shouldEscalateWantedLevel("EMAIL SIGNAL INVALID — CHECK ADDRESS.", "EMAIL SIGNAL INVALID — CHECK ADDRESS.")).toBe(false);
    expect(shouldEscalateWantedLevel("EMAIL SIGNAL INVALID — CHECK ADDRESS.", undefined)).toBe(false);
  });
});
