import { useState, useEffect } from 'react';
import { API_URL, leerError } from '../services/api';

// US#28: puntuar el hotel y ver las reseñas
function Valoraciones({ hotelId, usuario, onNuevaValoracion }) {
  const [lista, setLista] = useState([]);
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargar = () => {
    fetch(`${API_URL}/hoteles/${hotelId}/valoraciones`)
      .then((res) => res.json())
      .then((data) => setLista(data))
      .catch((err) => console.error('Error al cargar valoraciones:', err));
  };

  useEffect(cargar, [hotelId]);

  // el promedio se calcula con todas las valoraciones, asi se actualiza solo
  const promedio = lista.length > 0
    ? (lista.reduce((suma, v) => suma + v.puntuacion, 0) / lista.length).toFixed(1)
    : null;

  const enviar = async () => {
    setMensaje('');

    const res = await fetch(`${API_URL}/hoteles/${hotelId}/valoraciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: usuario.id, puntuacion: estrellas, comentario }),
    });

    if (!res.ok) {
      setMensaje(await leerError(res, 'No se pudo guardar la valoración.'));
      return;
    }

    setComentario('');
    cargar();
    onNuevaValoracion();
  };

  return (
    <div className="hotel-ratings-section">
      <div className="ratings-header-flex">
        <h3 className="policies-main-title">Opiniones y Puntuación</h3>
        <div className="average-badge">
          {promedio ? (
            <>⭐ <strong>{promedio}</strong> <span className="cantidad-resenas">({lista.length} valoraciones)</span></>
          ) : (
            <span className="cantidad-resenas">Todavía no hay valoraciones</span>
          )}
        </div>
      </div>

      {usuario ? (
        <div className="user-rating-box">
          <h4>Dejanos tu opinión</h4>
          <div className="star-selector">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                onClick={() => setEstrellas(n)}
                style={{ color: n <= estrellas ? '#f5a623' : '#ccc' }}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Contanos cómo fue tu experiencia (opcional)..."
            rows="2"
          />
          {mensaje && <p className="modal-error">⚠️ {mensaje}</p>}
          <button className="btn-submit-rating" onClick={enviar}>Enviar reseña</button>
        </div>
      ) : (
        <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1.5rem' }}>
          <em>Iniciá sesión para poder calificar este alojamiento.</em>
        </p>
      )}

      <div className="reviews-grid">
        {lista.map((v) => (
          <div className="review-card" key={v.id}>
            <div className="review-user-info">
              <strong>{v.usuario}</strong>
              <span className="review-date">{v.fecha}</span>
            </div>
            <div className="review-stars">{'⭐'.repeat(v.puntuacion)}</div>
            {v.comentario && <p className="review-text">{v.comentario}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Valoraciones;
