import HotelCard from './HotelCard';
import './FavoritesView.css';

// lista de favoritos (US#25)
function FavoritesView({ hoteles, favoritos, resumenes, onToggleFavorito, onSelectHotel, onBack, darkMode }) {
  const hotelesFavoritos = hoteles.filter((h) => favoritos.includes(h.id));

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h2>Mis Alojamientos Favoritos</h2>
        <button className="btn-back" onClick={onBack}>Volver</button>
      </div>

      {hotelesFavoritos.length === 0 ? (
        <div className="favorites-empty-container">
          <p className="no-favorites">No tenés alojamientos guardados en favoritos.</p>
        </div>
      ) : (
        <div className="hotels-grid">
          {hotelesFavoritos.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              esFavorito={true}
              resumen={resumenes[hotel.id]}
              darkMode={darkMode}
              onToggleFavorito={onToggleFavorito}
              onClick={() => onSelectHotel(hotel)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesView;
