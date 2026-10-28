import React from 'react';
import './Navbar.css';

function Navbar({ darkMode, setDarkMode }) {
  return (
    <header className={`navbar ${darkMode ? 'dark' : 'light'}`}>
      {/* logo */}
      <a href="#" className="navbar-brand">
        <span className="logo-icon">☕</span>
        <div className="brand-texts">
          <span className="logo-text">Anteiku</span>
          <span className="brand-slogan">Hoteles & Reservas</span>
        </div>
      </a>
      
      {/* links */}
      <nav className="navbar-links">
        <a href="#hoteles">Hoteles</a>
        <a href="#habitaciones">Habitaciones</a>
        <a href="#reservas">Mis Reservas</a>
      </nav>

      {/* botones y tema */}
      <div className="navbar-actions">
        <div className="auth-buttons">
          <button className="auth-btn outline" onClick={() => alert('falta login')}>Iniciar sesión</button>
          <button className="auth-btn solid" onClick={() => alert('falta registro')}>Crear cuenta</button>
        </div>

        <button 
          className="theme-toggle-btn modern-toggle" 
          onClick={() => setDarkMode(!darkMode)}
          aria-label="cambiar tema"
        >
          {darkMode ? (
            <svg className="theme-icon sun" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          ) : (
            <svg className="theme-icon moon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

export default Navbar;