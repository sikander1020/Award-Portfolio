export const CONTACT_SUCCESS_VISIBLE_MS = 3600;

export function getContactSuccessCopy(notificationDelivered: boolean) {
  return notificationDelivered
    ? "Sikandar has been notified. Your transmission is now in the queue."
    : "Your transmission is stored securely and will be reviewed shortly.";
}
