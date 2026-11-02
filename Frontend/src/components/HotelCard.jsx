const IMAGEN_POR_DEFECTO = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';

function HotelCard({ hotel, esFavorito, resumen, darkMode, onToggleFavorito, onClick }) {
  return (
    <div className={`card ${darkMode ? 'dark-card' : 'light-card'}`} onClick={onClick}>
      <button
        className={`favorite-btn ${esFavorito ? 'is-favorite' : ''}`}
        onClick={(e) => onToggleFavorito(e, hotel.id)}
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
