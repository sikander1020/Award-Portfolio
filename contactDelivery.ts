import type { ContactFormValues } from "./contactValidation";

export const CONTACT_DELIVERY_ENDPOINT = "https://formsubmit.co/ajax/Jadoonsikander7@gmail.com";

type ContactTransport = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

/**
 * Delivers a portfolio contact submission without depending on the Manus-only
 * tRPC server. The service accepts the request directly from the static Vercel
 * frontend and forwards it to the public portfolio email channel.
 */
export async function submitContactTransmission(
  values: ContactFormValues,
  transport: ContactTransport = fetch,
) {
  const response = await transport(CONTACT_DELIVERY_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...values,
      _subject: `Portfolio transmission: ${values.subject}`,
      _template: "table",
    }),
  });

  if (!response.ok) {
    throw new Error("Message transmission failed. Please try again.");
  }

  return { notificationDelivered: true } as const;
}
