import { useState, useEffect } from 'react';
import { API_URL } from '../services/api';
import RangoFechas from './RangoFechas';
import CompartirModal from './CompartirModal';
import Valoraciones from './Valoraciones';
import './HotelDetail.css';

const IMAGEN_POR_DEFECTO = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

// el hotel tiene una sola imagen, las otras de la galeria salen de este grupo
const IDS_UNSPLASH = [
  '1554118811-1e0d58224f24', '1582719478250-c89cae4dc85b', '1542314831-068cd1dbfeeb',
  '1590490360182-c33d57733427', '1578683010236-d716f9a3f461', '1512917774080-9991f1c4c750',
  '1618773928121-c32242e63f39', '1591088398332-8a7791972843', '1568495248636-6432b97bd949',
  '1584132967334-10e028bd69f7', '1596394516093-501ba68a0ba6', '1445019980597-93fa8acb246c',
  '1507652313519-d4e9174996dd', '1551882547-ff40c63fe5fa', '1571896349842-33c89424de2d',
  '1520250497591-112f2f40a3f4', '1514933651103-005eec06c04b', '1533105079780-92b9be482077',
  '1566073771259-6a8506099945', '1582719508461-905c673771fd', '1519671482749-fd09be7ccebf',
  '1540555700478-4be289fbecef', '1543007630-9710e4a00a20', '1566665797739-1674de7a421a',
];

function HotelDetail({ hotel, onBack, darkMode, usuarioLogueado, onIniciarReserva, onRequireLogin, onNuevaValoracion }) {
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [errorCalendario, setErrorCalendario] = useState(false);
  const [intentos, setIntentos] = useState(0); // sube cada vez que se toca "Intentar nuevamente"
  const [mostrarCompartir, setMostrarCompartir] = useState(false);
  const [mostrarGaleria, setMostrarGaleria] = useState(false);

  // al entrar al detalle se vuelve arriba de todo
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [hotel]);

  // fechas ocupadas para el calendario (US#23)
  useEffect(() => {
    if (!hotel) return;

    setErrorCalendario(false);
    fetch(`${API_URL}/hoteles/${hotel.id}/reservas`)
      .then((res) => {
        if (!res.ok) throw new Error('error al conectar');
        return res.json();
      })
      .then((data) => setFechasOcupadas(data))
      .catch(() => setErrorCalendario(true));
  }, [hotel, intentos]);

  if (!hotel) return null;

  const imagenPrincipal = hotel.imagen || IMAGEN_POR_DEFECTO;

  // 4 imagenes distintas entre si y distintas a la principal (US#6)
  const subImagenes = [];
  for (let i = 0; subImagenes.length < 4 && i < 30; i++) {
    const id = IDS_UNSPLASH[((hotel.id || 1) * 5 + i * 7) % IDS_UNSPLASH.length];
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`;
    if (url !== imagenPrincipal && !subImagenes.includes(url)) subImagenes.push(url);
  }

  const caracteristicas = hotel.caracteristicas || [];

  // US#30: si no esta logueado se abre el login avisando que es obligatorio
  const reservar = () => {
    if (usuarioLogueado) onIniciarReserva();
    else onRequireLogin();
  };

  return (
    <div className={`hotel-detail-container ${darkMode ? 'dark-card' : 'light-card'}`}>
      {/* US#5: titulo a la izquierda, flecha de volver a la derecha */}
      <div className="hotel-detail-header">
        <h2 className="detail-hotel-title">{hotel.nombre}</h2>
        <div className="detail-header-actions">
          <button className="book-btn-header" onClick={reservar}>📅 Reservar</button>
          <button className="share-btn-header" onClick={() => setMostrarCompartir(true)}>📤 Compartir</button>
          <button className="back-arrow-btn" onClick={onBack} title="Volver atrás">←</button>
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
        <p className="detail-category">Categoría: {hotel.categoria || 'Sin categoría'}</p>
        <p className="detail-description">{hotel.descripcion}</p>
      </div>

      {/* US#18 */}
      <div className="hotel-features-section">
        <h3>¿Qué ofrece este lugar?</h3>
        {caracteristicas.length === 0 ? (
          <p style={{ opacity: 0.7 }}>Este alojamiento todavía no tiene características cargadas.</p>
        ) : (
          <div className="features-grid">
            {caracteristicas.map((c) => (
              <div key={c.id} className={`feature-item ${darkMode ? 'dark-feature' : ''}`}>
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

      <Valoraciones hotelId={hotel.id} usuario={usuarioLogueado} onNuevaValoracion={onNuevaValoracion} />

      {mostrarCompartir && (
        <CompartirModal
          hotel={hotel}
          imagen={imagenPrincipal}
          darkMode={darkMode}
          onClose={() => setMostrarCompartir(false)}
        />
      )}

      {/* "Ver más": todas las imagenes juntas */}
      {mostrarGaleria && (
        <div className="gallery-modal-overlay" onClick={() => setMostrarGaleria(false)}>
          <div
            className={`gallery-modal-content ${darkMode ? 'dark-card' : 'light-card'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{hotel.nombre}</h3>
            <div className="gallery-modal-grid">
              {[imagenPrincipal, ...subImagenes].map((src, i) => (
                <img key={i} src={src} alt={`${hotel.nombre} imagen ${i + 1}`} />
              ))}
            </div>
            <button className="btn-close-share" onClick={() => setMostrarGaleria(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotelDetail;
