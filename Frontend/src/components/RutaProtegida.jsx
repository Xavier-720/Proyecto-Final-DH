import { Link, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Protege un grupo de rutas.
// OJO: esto solo mejora la experiencia, la seguridad real la hace el backend con el token y los roles.
function RutaProtegida({ soloAdmin = false }) {
  const { usuario, esAdmin, abrirLogin } = useAuth();

  if (!usuario) {
    return (
      <div className="acceso-restringido">
        <h2>Necesitás iniciar sesión</h2>
        <p>Iniciá sesión para ver esta sección.</p>
        <button className="back-btn-clean" onClick={() => abrirLogin()}>Iniciar sesión</button>
      </div>
    );
  }

  if (soloAdmin && !esAdmin) {
    return (
      <div className="acceso-restringido">
        <h2>Acceso restringido</h2>
        <p>Esta sección es solo para administradores.</p>
        <Link className="back-btn-clean" to="/">Volver al inicio</Link>
      </div>
    );
  }

  return <Outlet />;
}

export default RutaProtegida;
