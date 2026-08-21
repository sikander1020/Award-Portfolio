import { beforeEach, describe, expect, it, vi } from "vitest";

const { createContactMessage, notifyOwner } = vi.hoisted(() => ({
  createContactMessage: vi.fn(),
  notifyOwner: vi.fn(),
}));

vi.mock("../db", () => ({ createContactMessage }));
vi.mock("../_core/notification", () => ({ notifyOwner }));

import { contactRouter } from "./contact";

describe("contact.submit", () => {
  beforeEach(() => {
    createContactMessage.mockReset();
    notifyOwner.mockReset();
    createContactMessage.mockResolvedValue(undefined);
    notifyOwner.mockResolvedValue(true);
  });

  it("stores a valid visitor message and alerts the owner", async () => {
    const caller = contactRouter.createCaller({} as never);
    const input = { name: "Aisha Khan", email: "aisha@example.com", subject: "Automation project", message: "I would like to discuss an AI automation project." };

    await expect(caller.submit(input)).resolves.toEqual({ success: true, notificationDelivered: true });
    expect(createContactMessage).toHaveBeenCalledWith({ ...input, notificationDelivered: 1 });
    expect(notifyOwner).toHaveBeenCalledWith({
      title: "New portfolio message: Automation project",
      content: "From: Aisha Khan <aisha@example.com>\n\nI would like to discuss an AI automation project.",
    });
  });

  it("keeps a stored message successful when the owner alert is temporarily unavailable", async () => {
    notifyOwner.mockResolvedValue(false);
    const caller = contactRouter.createCaller({} as never);

    const input = { name: "Aisha Khan", email: "aisha@example.com", subject: "Automation project", message: "I would like to discuss an AI automation project." };
    await expect(caller.submit(input)).resolves.toEqual({ success: true, notificationDelivered: false });
    expect(createContactMessage).toHaveBeenCalledWith({ ...input, notificationDelivered: 0 });
  });

  it("rejects malformed visitor input before it is stored", async () => {
    const caller = contactRouter.createCaller({} as never);
    await expect(caller.submit({ name: "A", email: "invalid", subject: "Hi", message: "Too short" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(createContactMessage).not.toHaveBeenCalled();
  });
});
