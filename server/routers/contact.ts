import { z } from "zod";
import { createContactMessage } from "../db";
import { notifyOwner } from "../_core/notification";
import { publicProcedure, router } from "../_core/trpc";

const contactMessageInput = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(320),
  subject: z.string().trim().min(3, "Please add a short subject.").max(180),
  message: z.string().trim().min(10, "Please write a message of at least 10 characters.").max(4000),
});

export const contactRouter = router({
  submit: publicProcedure.input(contactMessageInput).mutation(async ({ input }) => {
    let notificationDelivered = false;
    try {
      notificationDelivered = await notifyOwner({
        title: `New portfolio message: ${input.subject}`,
        content: `From: ${input.name} <${input.email}>\n\n${input.message}`,
      });
    } catch (error) {
      console.warn("[Contact] Owner notification unavailable; submission was stored.", error);
    }

    await createContactMessage({
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      notificationDelivered: notificationDelivered ? 1 : 0,
    });

    return { success: true, notificationDelivered } as const;
  }),
});
