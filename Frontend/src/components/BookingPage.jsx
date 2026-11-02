import { useState, useEffect } from 'react';
import { API_URL, leerError } from '../services/api';
import RangoFechas from './RangoFechas';
import './BookingPage.css';

const IMAGEN_POR_DEFECTO = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';

// pagina de reserva (US#31 y US#32)
function BookingPage({ hotel, usuario, onBack, darkMode, onReservaExitosa }) {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  // dias que ya estan reservados en este hotel
  useEffect(() => {
    if (!hotel) return;

    fetch(`${API_URL}/hoteles/${hotel.id}/reservas`)
      .then((res) => res.json())
      .then((data) => setFechasOcupadas(data))
      .catch((err) => console.error('No se pudieron cargar las fechas ocupadas:', err));
  }, [hotel]);

  if (!hotel || !usuario) return null;

  // el nombre completo viene en un solo campo, lo separamos
  const [nombre, ...resto] = (usuario.nombre || '').split(' ');
  const apellido = resto.join(' ');

  const elegirFechas = (inicio, fin) => {
    setFechaInicio(inicio);
    setFechaFin(fin);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fechaInicio || !fechaFin) {
      setError('Elegí en el calendario la fecha de check-in y la de check-out.');
      return;
    }

    setCargando(true);
    setError('');

    // al backend solo le mandamos los ids del hotel y del usuario
    fetch(`${API_URL}/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotel: { id: hotel.id },
        usuario: { id: usuario.id },
        fechaCheckIn: fechaInicio,
        fechaCheckOut: fechaFin,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await leerError(res, 'No se pudo procesar la reserva. Probá de nuevo.'));
        setReservaConfirmada(true);
      })
      .catch((err) => {
        console.error('Error al reservar:', err);
        setError(err instanceof TypeError ? 'No se pudo conectar con el servidor.' : err.message);
      })
      .finally(() => setCargando(false));
  };

  // pantalla de confirmacion
  if (reservaConfirmada) {
    return (
      <div className={`booking-container ${darkMode ? 'dark-card' : 'light-card'}`}>
        <div className="booking-success-card">
          <span className="success-icon">🎉</span>
          <h2>¡Reserva Realizada con Éxito!</h2>
          <p>Hemos registrado tu estadía en <strong>{hotel.nombre}</strong>.</p>

          <div className="summary-box">
            <p><strong>Check-in:</strong> {fechaInicio}</p>
            <p><strong>Check-out:</strong> {fechaFin}</p>
            <p><strong>Titular:</strong> {usuario.nombre}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
          </div>

          <button className="btn-confirm-booking" onClick={onReservaExitosa}>
            Ir a mis reservas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`booking-container ${darkMode ? 'dark-card' : 'light-card'}`}>
      <div className="booking-header">
        <button className="back-arrow-btn" onClick={onBack} title="Volver atrás">←</button>
        <h2>Completar Reserva</h2>
      </div>

      <div className="booking-grid">
        <div className="booking-product-summary">
          <h3>Detalle del Alojamiento</h3>
          <img src={hotel.imagen || IMAGEN_POR_DEFECTO} alt={hotel.nombre} />
          <h4>{hotel.nombre}</h4>
          <p className="summary-city">📍 {hotel.ciudad}</p>
          <p className="summary-category">Categoría: {hotel.categoria || 'Sin categoría'}</p>
          <p className="summary-desc">{hotel.descripcion}</p>
        </div>

        <div className="booking-form-section">
          <h3>Tus Datos</h3>
          <div className="user-info-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" value={nombre} disabled />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input type="text" value={apellido} disabled />
            </div>
            <div className="form-group full-width">
              <label>Correo Electrónico</label>
              <input type="email" value={usuario.email} disabled />
            </div>
          </div>

          <h3 style={{ marginTop: '1.5rem' }}>Seleccioná las fechas</h3>
          <form onSubmit={handleSubmit}>
            <RangoFechas
              inicio={fechaInicio}
              fin={fechaFin}
              onChange={elegirFechas}
              ocupadas={fechasOcupadas}
            />

            {error && <div className="booking-error-msg">⚠️ {error}</div>}

            <button type="submit" className="btn-confirm-booking" disabled={cargando}>
              {cargando ? 'Procesando...' : 'Confirmar Reserva'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
