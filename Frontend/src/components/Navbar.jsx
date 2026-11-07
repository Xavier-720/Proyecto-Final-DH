import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useTema from '../hooks/useTema';
import useDatos from '../hooks/useDatos';
import useFavoritos from '../hooks/useFavoritos';
import './Navbar.css';
import logoNormalImg from '../assets/Anteiku_Stay_redondo.png';
import logoEyesImg from '../assets/Anteiku_Stay_eyes.png';

function Navbar() {
  const { usuario, esAdmin, logout, abrirLogin, abrirRegistro } = useAuth();
  const { darkMode, alternarTema } = useTema();
  const { limpiarFiltros } = useDatos();
  const { favoritos } = useFavoritos();
  const navigate = useNavigate();

  const [currentLogo, setCurrentLogo] = useState(logoNormalImg);

  const obtenerIniciales = (nombreCompleto) => {
    if (!nombreCompleto) return 'U';
    const partes = nombreCompleto.trim().split(' ');
    if (partes.length >= 2) {
      return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    }
    return partes[0].substring(0, 2).toUpperCase();
  };

  const irAlInicio = () => {
    limpiarFiltros();
    navigate('/');
  };

  const cerrarSesion = () => {
    logout();
    navigate('/');
  };

  const botonTema = (
    <button className="theme-toggle-circle" onClick={alternarTema} title="Cambiar tema">
      {darkMode ? '☀️' : '🌙'}
    </button>
  );

  return (
    <header className="navbar">
      <div className="navbar-logo" onClick={irAlInicio} title="Ir a la página principal">
        <img
          src={currentLogo}
          alt="Anteiku Stay Logo"
          className="navbar-logo-img"
          onMouseEnter={() => setCurrentLogo(logoEyesImg)}
          onMouseLeave={() => setCurrentLogo(logoNormalImg)}
        />
        <div className="logo-text-container">
          <span className="logo-title">ANTEIKU STAY</span>
          <span className="logo-subtitle">Sentite como en tu hogar</span>
        </div>
      </div>

      <div className="navbar-actions">
        {usuario ? (
          <div className="user-control-group">
            {botonTema}

            <div className="user-profile-pill">
              <div className="user-avatar" title={usuario.email}>{obtenerIniciales(usuario.nombre)}</div>
              <span className="user-greeting">Hola, {usuario.nombre.split(' ')[0]}</span>
            </div>

            <Link className="btn-nav btn-favorites" to="/favoritos">
              ❤️ Favoritos ({favoritos.length})
            </Link>

            <Link className="btn-nav btn-my-bookings" to="/mis-reservas">
              📅 Mis Reservas
            </Link>

            {esAdmin && (
              <Link className="btn-nav btn-admin-panel" to="/admin">
                ⚙️ Panel Admin
              </Link>
            )}

            <button className="btn-logout" onClick={cerrarSesion}>Cerrar sesión</button>
          </div>
        ) : (
          <div className="auth-container-flex">
            {botonTema}
            <div className="auth-buttons">
              <button className="btn-register" onClick={abrirRegistro}>Crear cuenta</button>
              <button className="btn-login" onClick={() => abrirLogin()}>Iniciar sesión</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
