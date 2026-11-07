import { WHATSAPP_NUMBER } from '../config';
import './WhatsAppButton.css';

// US#34: botón flotante abajo a la derecha, no hace falta estar logueado.
// Usa el teléfono del hotel y, si no tiene, el teléfono general del .env (VITE_WHATSAPP_NUMBER).
// Si no hay ningún teléfono configurado el botón no se muestra.
function WhatsAppButton({ hotelNombre, telefono }) {
  const numero = telefono || WHATSAPP_NUMBER;
  if (!numero) return null;

  const handleClick = () => {
    const mensaje = encodeURIComponent(`Hola, tengo una consulta sobre el alojamiento ${hotelNombre || 'Anteiku Stays'}.`);
    window.open(`https://api.whatsapp.com/send?phone=${numero}&text=${mensaje}`, '_blank');
  };

  return (
    <button className="whatsapp-float-btn" onClick={handleClick} title="Consultar por WhatsApp">
      💬
    </button>
  );
}

export default WhatsAppButton;
