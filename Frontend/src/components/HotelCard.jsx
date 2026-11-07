import { useNavigate } from 'react-router-dom';
import useFavoritos from '../hooks/useFavoritos';
import { IMAGEN_POR_DEFECTO } from '../constants/imagenes';
import './HotelCard.css';

function HotelCard({ hotel, resumen }) {
  const { favoritos, alternarFavorito } = useFavoritos();
  const navigate = useNavigate();

  const esFavorito = favoritos.includes(hotel.id);

  const handleFavorito = (e) => {
    // para que el clic no abra también el detalle del hotel
    e.stopPropagation();
    alternarFavorito(hotel.id);
  };

  return (
    <div className="card tema-card" onClick={() => navigate(`/hoteles/${hotel.id}`)}>
      <button
        className={`favorite-btn ${esFavorito ? 'is-favorite' : ''}`}
        onClick={handleFavorito}
        title={esFavorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      >
        {esFavorito ? '❤️' : '🤍'}
      </button>

      <img className="card-img" src={hotel.imagen || IMAGEN_POR_DEFECTO} alt={hotel.nombre} />

      <div className="card-body">
        <h4>{hotel.nombre}</h4>
        <p className="hotel-city">📍 {hotel.ciudad}</p>
        {resumen && <p className="hotel-rating">⭐ {resumen.promedio} ({resumen.total})</p>}
        <p className="hotel-desc">{hotel.descripcion}</p>
      </div>
    </div>
  );
}

export default HotelCard;
