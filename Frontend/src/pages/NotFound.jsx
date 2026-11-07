import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="acceso-restringido">
      <h2>Página no encontrada</h2>
      <p>La dirección que buscás no existe o el contenido fue eliminado.</p>
      <Link className="back-btn-clean" to="/">Volver al inicio</Link>
    </div>
  );
}

export default NotFound;
