import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import RangoFechas from '../components/RangoFechas';
import WhatsAppButton from '../components/WhatsAppButton';
import useAuth from '../hooks/useAuth';
import useDatos from '../hooks/useDatos';
import useVolver from '../hooks/useVolver';
import { obtenerHotel, listarFechasOcupadas } from '../services/hotelService';
import { crearReserva } from '../services/reservaService';
import { IMAGEN_POR_DEFECTO } from '../constants/imagenes';
import './BookingPage.css';

// pagina de reserva (US#31 y US#32). La ruta está protegida: hay que estar logueado.
function BookingPage() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const { recargarOcupacion } = useDatos();
  const volver = useVolver(`/hoteles/${id}`);

  const [hotel, setHotel] = useState(null);
  const [errorHotel, setErrorHotel] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  // dias que ya estan reservados en este hotel
  const cargarFechasOcupadas = () => {
    listarFechasOcupadas(id)
      .then(setFechasOcupadas)
      .catch((err) => console.error('No se pudieron cargar las fechas ocupadas:', err));
  };

  useEffect(() => {
    obtenerHotel(id)
      .then(setHotel)
      .catch((err) => setErrorHotel(err.message));
    cargarFechasOcupadas();
  }, [id]);

  if (errorHotel) {
    return (
      <div className="acceso-restringido">
        <h2>No encontramos el alojamiento</h2>
        <p>{errorHotel}</p>
        <Link className="back-btn-clean" to="/">Volver al inicio</Link>
      </div>
    );
  }

  if (!hotel) return <p style={{ textAlign: 'center' }}>Cargando...</p>;

  // el nombre completo viene en un solo campo, lo separamos
  const [nombre, ...resto] = usuario.nombre.split(' ');
  const apellido = resto.join(' ');

  const elegirFechas = (inicio, fin) => {
    setFechaInicio(inicio);
    setFechaFin(fin);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fechaInicio || !fechaFin) {
      setError('Elegí en el calendario la fecha de check-in y la de check-out.');
      return;
    }

    setCargando(true);
    setError('');

    try {
      // el backend sabe quién es el usuario por el token, solo mandamos hotel y fechas
      await crearReserva(hotel.id, fechaInicio, fechaFin);
      recargarOcupacion();
      setReservaConfirmada(true);
    } catch (err) {
      setError(err.message);
      // si alguien reservó justo antes, se actualiza el calendario
      if (err.status === 409) {
        cargarFechasOcupadas();
        setFechaInicio('');
        setFechaFin('');
      }
    } finally {
      setCargando(false);
    }
  };

  // pantalla de confirmacion
  if (reservaConfirmada) {
    return (
      <div className="booking-container tema-card">
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

          <Link className="btn-confirm-booking" to="/mis-reservas">
            Ir a mis reservas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-container tema-card">
      <div className="booking-header">
        <button className="back-arrow-btn" onClick={volver} title="Volver atrás">←</button>
        <h2>Completar Reserva</h2>
      </div>

      <div className="booking-grid">
        <div className="booking-product-summary">
          <h3>Detalle del Alojamiento</h3>
          <img src={hotel.imagen || IMAGEN_POR_DEFECTO} alt={hotel.nombre} />
          <h4>{hotel.nombre}</h4>
          <p className="summary-city">📍 {hotel.ciudad}</p>
          <p className="summary-category">Categoría: {hotel.categoria?.titulo || 'Sin categoría'}</p>
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

      <WhatsAppButton hotelNombre={hotel.nombre} telefono={hotel.telefono} />
    </div>
  );
}

export default BookingPage;
