// Teléfono general de contacto para WhatsApp (solo números, con código de país).
// Se configura en el .env con VITE_WHATSAPP_NUMBER. Si el hotel tiene su propio teléfono se usa ese.
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '';
