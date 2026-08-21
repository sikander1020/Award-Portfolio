import { describe, expect, it } from "vitest";
import { getContactSuccessCopy } from "./contactFeedback";

describe("Contact success feedback", () => {
  it("confirms when the owner notification was delivered", () => {
    expect(getContactSuccessCopy(true)).toContain("notified");
  });

  it("keeps a reassuring stored-message confirmation when notification delivery is unavailable", () => {
    expect(getContactSuccessCopy(false)).toContain("stored securely");
  });
});
