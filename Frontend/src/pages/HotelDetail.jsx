import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RangoFechas from '../components/RangoFechas';
import CompartirModal from '../components/CompartirModal';
import Valoraciones from '../components/Valoraciones';
import WhatsAppButton from '../components/WhatsAppButton';
import Modal from '../components/Modal';
import useAuth from '../hooks/useAuth';
import useVolver from '../hooks/useVolver';
import { obtenerHotel, listarFechasOcupadas } from '../services/hotelService';
import { IMAGEN_POR_DEFECTO, imagenesGaleria } from '../constants/imagenes';
import './HotelDetail.css';

// detalle de un hotel. El hotel se busca por el id que viene en la url (/hoteles/:id),
// así funciona al recargar la página o al abrir un link compartido.
function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const volver = useVolver();
  const { usuario, abrirLogin } = useAuth();

  const [hotel, setHotel] = useState(null);
  const [errorHotel, setErrorHotel] = useState('');
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [errorCalendario, setErrorCalendario] = useState(false);
  const [intentos, setIntentos] = useState(0); // sube cada vez que se toca "Intentar nuevamente"
  const [mostrarCompartir, setMostrarCompartir] = useState(false);
  const [mostrarGaleria, setMostrarGaleria] = useState(false);

  useEffect(() => {
    setHotel(null);
    setErrorHotel('');
    obtenerHotel(id)
      .then(setHotel)
      .catch((err) => setErrorHotel(err.status === 404 ? 'El alojamiento no existe o fue eliminado.' : err.message));
  }, [id]);

  // fechas ocupadas para el calendario (US#23)
  useEffect(() => {
    setErrorCalendario(false);
    listarFechasOcupadas(id)
      .then(setFechasOcupadas)
      .catch(() => setErrorCalendario(true));
  }, [id, intentos]);

  if (errorHotel) {
    return (
      <div className="acceso-restringido">
        <h2>No encontramos el alojamiento</h2>
        <p>{errorHotel}</p>
        <Link className="back-btn-clean" to="/">Volver al inicio</Link>
      </div>
    );
  }

  if (!hotel) return <p style={{ textAlign: 'center' }}>Cargando alojamiento...</p>;

  const imagenPrincipal = hotel.imagen || IMAGEN_POR_DEFECTO;

  // 4 imagenes distintas entre si y distintas a la principal (US#6)
  const subImagenes = imagenesGaleria(hotel.id, imagenPrincipal);

  // US#30: si no esta logueado se abre el login avisando que es obligatorio
  const reservar = () => {
    if (usuario) navigate(`/hoteles/${hotel.id}/reservar`);
    else abrirLogin(true);
  };

  return (
    <div className="hotel-detail-container tema-card">
      {/* US#5: titulo a la izquierda, flecha de volver a la derecha */}
      <div className="hotel-detail-header">
        <h2 className="detail-hotel-title">{hotel.nombre}</h2>
        <div className="detail-header-actions">
          <button className="book-btn-header" onClick={reservar}>📅 Reservar</button>
          <button className="share-btn-header" onClick={() => setMostrarCompartir(true)}>📤 Compartir</button>
          <button className="back-arrow-btn" onClick={volver} title="Volver atrás">←</button>
        </div>
      </div>

      <div className="hotel-gallery">
        <div className="main-image">
          <img src={imagenPrincipal} alt={hotel.nombre} />
        </div>
        <div className="sub-images-grid">
          <img src={subImagenes[0]} alt={`${hotel.nombre} vista 1`} />
          <img src={subImagenes[1]} alt={`${hotel.nombre} vista 2`} />
          <img src={subImagenes[2]} alt={`${hotel.nombre} vista 3`} />
          <div className="more-images-container">
            <img src={subImagenes[3]} alt={`${hotel.nombre} vista 4`} />
            <button className="btn-ver-mas" onClick={() => setMostrarGaleria(true)}>Ver más</button>
          </div>
        </div>
      </div>

      <div className="hotel-info-section">
        <p className="detail-city">📍 {hotel.ciudad}</p>
        <p className="detail-category">Categoría: {hotel.categoria?.titulo || 'Sin categoría'}</p>
        <p className="detail-description">{hotel.descripcion}</p>
      </div>

      {/* US#18 */}
      <div className="hotel-features-section">
        <h3>¿Qué ofrece este lugar?</h3>
        {hotel.caracteristicas.length === 0 ? (
          <p style={{ opacity: 0.7 }}>Este alojamiento todavía no tiene características cargadas.</p>
        ) : (
          <div className="features-grid">
            {hotel.caracteristicas.map((c) => (
              <div key={c.id} className="feature-item">
                <span className="feature-icon">{c.icono || '✨'}</span>
                <span className="feature-name">{c.nombre}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* US#23: calendario con los dias ocupados */}
      <div className="hotel-availability-section">
        <h3>Fechas disponibles</h3>
        {errorCalendario ? (
          <div className="calendar-error">
            <p>⚠️ No se pudo obtener la información de disponibilidad en este momento.</p>
            <button onClick={() => setIntentos(intentos + 1)} className="action-btn">Intentar nuevamente</button>
          </div>
        ) : (
          <RangoFechas ocupadas={fechasOcupadas} soloLectura />
        )}
      </div>

      {/* US#26: politicas en columnas (son iguales para todos los hoteles) */}
      <div className="hotel-policies-section">
        <h3 className="policies-main-title">Qué tenés que saber</h3>
        <div className="policies-grid">
          <div className="policy-column">
            <h4>Normas de la casa</h4>
            <p>Check-in desde las 14:00. Check-out hasta las 11:00. No se permite fumar en espacios cerrados ni hacer fiestas dentro de las habitaciones.</p>
          </div>
          <div className="policy-column">
            <h4>Salud y seguridad</h4>
            <p>Se siguen las pautas de limpieza y desinfección. El establecimiento cuenta con elementos de seguridad y asistencia médica rápida.</p>
          </div>
          <div className="policy-column">
            <h4>Política de cancelación</h4>
            <p>Cancelación gratuita hasta 48 horas antes de la fecha de ingreso. Pasado ese plazo, se cobrará la primera noche.</p>
          </div>
        </div>
      </div>

      <Valoraciones hotelId={hotel.id} />

      {mostrarCompartir && (
        <CompartirModal hotel={hotel} imagen={imagenPrincipal} onClose={() => setMostrarCompartir(false)} />
      )}

      {/* "Ver más": todas las imagenes juntas */}
      {mostrarGaleria && (
        <Modal titulo={hotel.nombre} onClose={() => setMostrarGaleria(false)} claseContenido="gallery-modal-content">
          <div className="gallery-modal-grid">
            {[imagenPrincipal, ...subImagenes].map((src, i) => (
              <img key={src} src={src} alt={`${hotel.nombre} imagen ${i + 1}`} />
            ))}
          </div>
          <button className="btn-close-share" onClick={() => setMostrarGaleria(false)}>Cerrar</button>
        </Modal>
      )}

      <WhatsAppButton hotelNombre={hotel.nombre} telefono={hotel.telefono} />
    </div>
  );
}

export default HotelDetail;
