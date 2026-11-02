import { useState } from 'react';

// US#27: ventana para compartir el hotel en redes
function CompartirModal({ hotel, imagen, darkMode, onClose }) {
  const [mensaje, setMensaje] = useState('');

  const compartir = (red) => {
    const url = window.location.href;
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
        .then(() => alert('Enlace copiado, ya podés pegarlo en Instagram.'))
        .catch(() => alert('No se pudo copiar el enlace.'));
    }
    onClose();
  };

  return (
    <div className="share-modal-overlay">
      <div className={`share-modal-content ${darkMode ? 'dark-card' : 'light-card'}`}>
        <h3>Compartir alojamiento</h3>

        <div className="share-preview-card">
          <img src={imagen} alt={hotel.nombre} />
          <div>
            <h4>{hotel.nombre}</h4>
            <p>📍 {hotel.ciudad}</p>
            <p>{(hotel.descripcion || '').slice(0, 80)}...</p>
            <span className="share-link-text">{window.location.href}</span>
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
      </div>
    </div>
  );
}

export default CompartirModal;
