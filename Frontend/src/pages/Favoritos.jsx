import { Link } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import useDatos from '../hooks/useDatos';
import useFavoritos from '../hooks/useFavoritos';
import './Favoritos.css';

// lista de favoritos (US#25)
function Favoritos() {
  const { hoteles, resumenes } = useDatos();
  const { favoritos } = useFavoritos();

  const hotelesFavoritos = hoteles.filter((h) => favoritos.includes(h.id));

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h2>Mis Alojamientos Favoritos</h2>
        <Link className="btn-back" to="/">Volver</Link>
      </div>

      {hotelesFavoritos.length === 0 ? (
        <div className="favorites-empty-container">
          <p className="no-favorites">No tenés alojamientos guardados en favoritos.</p>
        </div>
      ) : (
        <div className="hotels-grid">
          {hotelesFavoritos.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} resumen={resumenes[hotel.id]} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favoritos;
