import { useState, useEffect } from 'react';
import { API_URL } from '../services/api';
import './UserBookings.css';

const IMAGEN_POR_DEFECTO = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80';

// historial de reservas del usuario (US#33)
function UserBookings({ usuario, onBack, darkMode, onSelectHotel }) {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!usuario) {
      setCargando(false);
      return;
    }

    fetch(`${API_URL}/reservas/usuario/${usuario.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener reservas');
        return res.json();
      })
      .then((data) => {
        // las mas nuevas primero
        const ordenadas = [...data].sort((a, b) => (b.fechaCheckIn || '').localeCompare(a.fechaCheckIn || ''));
        setReservas(ordenadas);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setCargando(false));
  }, [usuario]);

  return (
    <div className={`user-bookings-container ${darkMode ? 'dark-card' : 'light-card'}`}>
      <div className="user-bookings-header">
        <button className="back-arrow-btn" onClick={onBack} title="Volver atrás">
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
            const h = reserva.hotel || {};
            return (
              <div key={reserva.id} className="booking-card">
                <img src={h.imagen || IMAGEN_POR_DEFECTO} alt={h.nombre || 'Alojamiento'} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <h4>{h.nombre || 'Alojamiento Anteiku'}</h4>
                  <p className="hotel-city">📍 {h.ciudad || 'Ubicación'}</p>
                  <p className="booking-dates"><strong>Check-in:</strong> {reserva.fechaCheckIn}</p>
                  <p className="booking-dates"><strong>Check-out:</strong> {reserva.fechaCheckOut}</p>
                  {reserva.fechaCreacion && (
                    <p className="booking-dates"><strong>Reservado el:</strong> {reserva.fechaCreacion.slice(0, 10)}</p>
                  )}
                </div>
                {onSelectHotel && reserva.hotel && (
                  <button className="booking-view-btn" onClick={() => onSelectHotel(reserva.hotel)}>
                    Ver Alojamiento
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserBookings;
