import './WhatsAppButton.css';

// US#34: boton flotante abajo a la derecha, no hace falta estar logueado
// el telefono por defecto es de prueba, cambiarlo por el real
function WhatsAppButton({ hotelNombre, telefonoProveedor = '5491123456789' }) {
  const handleClick = () => {
    const mensaje = encodeURIComponent(`Hola, tengo una consulta sobre el alojamiento ${hotelNombre || 'Anteiku Stays'}.`);
    window.open(`https://api.whatsapp.com/send?phone=${telefonoProveedor}&text=${mensaje}`, '_blank');
  };

  return (
    <button className="whatsapp-float-btn" onClick={handleClick} title="Consultar por WhatsApp">
      💬
    </button>
  );
}

export default WhatsAppButton;
