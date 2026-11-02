import { useState } from 'react';
import './Navbar.css';
import logoNormalImg from '../assets/Anteiku_Stay_redondo.png';
import logoEyesImg from '../assets/Anteiku_Stay_eyes.png';

function Navbar({
  darkMode,
  setDarkMode,
  onOpenRegister,
  onOpenLogin,
  usuarioLogueado,
  onLogout,
  onGoHome,
  onOpenAdminPanel,
  onOpenBookings,
  onOpenFavorites,
  cantidadFavoritos = 0,
}) {
  const [currentLogo, setCurrentLogo] = useState(logoNormalImg);

  const obtenerIniciales = (nombreCompleto) => {
    if (!nombreCompleto) return 'U';
    const partes = nombreCompleto.trim().split(' ');
    if (partes.length >= 2) {
      return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    }
    return partes[0].substring(0, 2).toUpperCase();
  };

  const iniciales = obtenerIniciales(usuarioLogueado?.nombre);

  return (
    <header className={`navbar ${darkMode ? 'dark-navbar' : 'light-navbar'}`}>
      <div className="navbar-logo" onClick={onGoHome} title="Ir a la página principal">
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
        {usuarioLogueado ? (
          <div className="user-control-group">
            <button
              className="theme-toggle-circle"
              onClick={() => setDarkMode(!darkMode)}
              title="Cambiar tema"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            <div className="user-profile-pill">
              <div className="user-avatar" title={usuarioLogueado.email}>{iniciales}</div>
              <span className="user-greeting">Hola, {usuarioLogueado.nombre.split(' ')[0]}</span>
            </div>

            <button className="btn-nav btn-favorites" onClick={onOpenFavorites}>
              ❤️ Favoritos ({cantidadFavoritos})
            </button>

            <button className="btn-nav btn-my-bookings" onClick={onOpenBookings}>
              📅 Mis Reservas
            </button>

            {usuarioLogueado.rol === 'ADMIN' && (
              <button className="btn-nav btn-admin-panel" onClick={onOpenAdminPanel}>
                ⚙️ Panel Admin
              </button>
            )}

            <button className="btn-logout" onClick={onLogout}>Cerrar sesión</button>
          </div>
        ) : (
          <div className="auth-container-flex">
            <button
              className="theme-toggle-circle"
              onClick={() => setDarkMode(!darkMode)}
              title="Cambiar tema"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="auth-buttons">
              <button className="btn-register" onClick={onOpenRegister}>Crear cuenta</button>
              <button className="btn-login" onClick={onOpenLogin}>Iniciar sesión</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;