import { describe, expect, it, vi } from "vitest";
import { CONTACT_DELIVERY_ENDPOINT, submitContactTransmission } from "./contactDelivery";

describe("Vercel-safe contact delivery", () => {
  it("posts validated portfolio contact details to the public delivery endpoint", async () => {
    const transport = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));

    await expect(submitContactTransmission({
      name: "Ayesha Khan",
      email: "ayesha@example.com",
      subject: "Automation project",
      message: "I would like to discuss a workflow automation project.",
    }, transport)).resolves.toEqual({ notificationDelivered: true });

    expect(transport).toHaveBeenCalledWith(CONTACT_DELIVERY_ENDPOINT, expect.objectContaining({ method: "POST" }));
    const request = transport.mock.calls[0]?.[1] as RequestInit;
    expect(JSON.parse(String(request.body))).toMatchObject({
      email: "ayesha@example.com",
      _subject: "Portfolio transmission: Automation project",
      _template: "table",
    });
  });

  it("reports an error when the delivery endpoint rejects a submission", async () => {
    const transport = vi.fn().mockResolvedValue(new Response(null, { status: 502 }));

    await expect(submitContactTransmission({
      name: "Ayesha Khan",
      email: "ayesha@example.com",
      subject: "Automation project",
      message: "I would like to discuss a workflow automation project.",
    }, transport)).rejects.toThrow("Message transmission failed. Please try again.");
  });
});
