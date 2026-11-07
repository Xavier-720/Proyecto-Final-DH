import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useVolver from '../hooks/useVolver';
import { listarMisReservas } from '../services/reservaService';
import { IMAGEN_POR_DEFECTO } from '../constants/imagenes';
import './UserBookings.css';

// historial de reservas del usuario (US#33)
// el backend devuelve solo las reservas del usuario del token, ya ordenadas (las más nuevas primero)
function UserBookings() {
  const volver = useVolver();
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    listarMisReservas()
      .then(setReservas)
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="user-bookings-container tema-card">
      <div className="user-bookings-header">
        <button className="back-arrow-btn" onClick={volver} title="Volver atrás">
          ←
        </button>
        <h2>Mis Reservas Realizadas</h2>
      </div>

      {cargando ? (
        <p className="no-bookings">Cargando tus reservas...</p>
      ) : error ? (
        <p className="no-bookings">⚠️ No pudimos cargar tus reservas. Probá de nuevo más tarde.</p>
      ) : reservas.length === 0 ? (
        <div className="no-bookings">
          <p>☕ Todavía no realizaste ninguna reserva.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {reservas.map((reserva) => {
            const h = reserva.hotel;
            return (
              <div key={reserva.id} className="booking-card">
                <img src={h.imagen || IMAGEN_POR_DEFECTO} alt={h.nombre} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <h4>{h.nombre}</h4>
                  <p className="hotel-city">📍 {h.ciudad}</p>
                  <p className="booking-dates"><strong>Check-in:</strong> {reserva.fechaCheckIn}</p>
                  <p className="booking-dates"><strong>Check-out:</strong> {reserva.fechaCheckOut}</p>
                  {reserva.fechaCreacion && (
                    <p className="booking-dates"><strong>Reservado el:</strong> {reserva.fechaCreacion.slice(0, 10)}</p>
                  )}
                </div>
                <Link className="booking-view-btn" to={`/hoteles/${h.id}`}>
                  Ver Alojamiento
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserBookings;
