import { useState } from 'react';
import Modal from './Modal';
import useAvisos from '../hooks/useAvisos';
import './CompartirModal.css';

// US#27: ventana para compartir el hotel en redes
// window.location.href es la url del hotel (/hoteles/:id), así el link lleva directo a ese alojamiento
function CompartirModal({ hotel, imagen, onClose }) {
  const [mensaje, setMensaje] = useState('');
  const { mostrarToast } = useAvisos();

  const url = window.location.href;

  const compartir = (red) => {
    const texto = `${mensaje ? mensaje + ' - ' : ''}Mirá este alojamiento: ${hotel.nombre} en ${hotel.ciudad}. ${url}`;

    if (red === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (red === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}`, '_blank');
    } else if (red === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
    } else {
      // instagram no deja compartir con un link, asi que se copia el enlace
      navigator.clipboard.writeText(url)
        .then(() => mostrarToast('Enlace copiado, ya podés pegarlo en Instagram.'))
        .catch(() => mostrarToast('No se pudo copiar el enlace.', 'error'));
    }
    onClose();
  };

  return (
    <Modal titulo="Compartir alojamiento" onClose={onClose} claseContenido="share-modal-content">
      <div className="share-preview-card">
        <img src={imagen} alt={hotel.nombre} />
        <div>
          <h4>{hotel.nombre}</h4>
          <p>📍 {hotel.ciudad}</p>
          <p>{(hotel.descripcion || '').slice(0, 80)}...</p>
          <span className="share-link-text">{url}</span>
        </div>
      </div>

      <div className="share-mensaje">
        <label>Mensaje personalizado:</label>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribí un mensaje opcional..."
          rows="2"
        />
      </div>

      <p style={{ fontSize: '0.85rem', marginBottom: '1rem', opacity: 0.8 }}>Elegí dónde querés compartirlo:</p>

      <div className="share-social-buttons">
        <button className="social-btn fb" onClick={() => compartir('facebook')}>
          <span className="social-icon">f</span> Facebook
        </button>
        <button className="social-btn tw" onClick={() => compartir('twitter')}>
          <span className="social-icon">𝕏</span> Twitter / X
        </button>
        <button className="social-btn wa" onClick={() => compartir('whatsapp')}>
          <span className="social-icon">💬</span> WhatsApp
        </button>
        <button className="social-btn ig" onClick={() => compartir('instagram')}>
          <span className="social-icon">📷</span> Copiar enlace (Instagram)
        </button>
      </div>

      <button className="btn-close-share" onClick={onClose}>Cancelar</button>
    </Modal>
  );
}

export default CompartirModal;
