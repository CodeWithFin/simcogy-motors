import { whatsappLink } from "./format";

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254711812043";

export function viewingLink(message = "Hi Simcogy Motors, I'd like to book a viewing.") {
  return whatsappLink(WHATSAPP_NUMBER, message);
}
