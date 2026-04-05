export const WHATSAPP_PHONE = "910000000000";

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
