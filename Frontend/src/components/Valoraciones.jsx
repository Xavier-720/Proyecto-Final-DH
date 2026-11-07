import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useAvisos from '../hooks/useAvisos';
import useDatos from '../hooks/useDatos';
import { listarValoraciones, crearValoracion } from '../services/valoracionService';
import './Valoraciones.css';

// US#28: puntuar el hotel y ver las reseñas
function Valoraciones({ hotelId }) {
  const { usuario } = useAuth();
  const { mostrarToast } = useAvisos();
  const { recargarResumenes } = useDatos();

  const [lista, setLista] = useState([]);
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    listarValoraciones(hotelId)
      .then(setLista)
      .catch((err) => console.error('Error al cargar valoraciones:', err));
  }, [hotelId]);

  // el promedio se calcula con todas las valoraciones, asi se actualiza solo
  const promedio = lista.length > 0
    ? (lista.reduce((suma, v) => suma + v.puntuacion, 0) / lista.length).toFixed(1)
    : null;

  // cada usuario puede valorar un hotel una sola vez
  const yaValoro = usuario && lista.some((v) => v.usuarioId === usuario.id);

  const enviar = async () => {
    setMensaje('');
    setEnviando(true);

    try {
      const nueva = await crearValoracion(hotelId, estrellas, comentario.trim());
      setLista((prev) => [nueva, ...prev]);
      setComentario('');
      recargarResumenes();
      mostrarToast('¡Gracias por tu opinión!');
    } catch (err) {
      setMensaje(err.message);
    } finally {
      setEnviando(false);
    }
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

      {!usuario && (
        <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1.5rem' }}>
          <em>Iniciá sesión para poder calificar este alojamiento.</em>
        </p>
      )}

      {yaValoro && (
        <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1.5rem' }}>
          <em>Ya dejaste tu opinión sobre este alojamiento. ¡Gracias!</em>
        </p>
      )}

      {usuario && !yaValoro && (
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
            maxLength={1000}
          />
          {mensaje && <p className="modal-error">⚠️ {mensaje}</p>}
          <button className="btn-submit-rating" onClick={enviar} disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar reseña'}
          </button>
        </div>
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
