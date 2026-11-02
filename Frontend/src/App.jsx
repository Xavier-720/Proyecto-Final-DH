import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AdminHotelModal from './components/AdminHotelModal';
import RegisterModal from './components/RegisterModal';
import LoginModal from './components/LoginModal';
import HotelDetail from './components/HotelDetail';
import AdminPanel from './components/admin/AdminPanel';
import FavoritesView from './components/FavoritesView';
import UserBookings from './components/UserBookings';
import BookingPage from './components/BookingPage';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';
import useFavoritos from './hooks/useFavoritos';
import { API_URL } from './services/api';
import { getStoredUser, logoutUser } from './services/authService';
import './App.css';

const FILTROS_VACIOS = { ciudad: '', checkIn: '', checkOut: '', caracteristicas: [], categorias: [], soloFavoritos: false, pagina: 1 };

// US#9: el panel de admin tiene su propia url
const RUTA_ADMIN = '/administración';
const enRutaAdmin = () => decodeURIComponent(window.location.pathname) === RUTA_ADMIN;

// trae datos del backend y los guarda con el setter que le pasamos
const cargar = (ruta, guardar) => {
  fetch(`${API_URL}/${ruta}`)
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => guardar(data))
    .catch((err) => console.error(`Error al cargar ${ruta}:`, err));
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // datos del backend
  const [hoteles, setHoteles] = useState([]);
  const [aleatorios, setAleatorios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [resumenes, setResumenes] = useState({});

  const [usuarioLogueado, setUsuarioLogueado] = useState(getStoredUser);
  const [favoritos, alternarFavorito] = useFavoritos(usuarioLogueado);
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginObligatorio, setLoginObligatorio] = useState(false);

  const [hotelAEditar, setHotelAEditar] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  // pantalla actual: home | detail | booking-process | bookings | favorites | admin
  const [currentView, setCurrentView] = useState(() => (enRutaAdmin() ? 'admin' : 'home'));

  useEffect(() => {
    cargar('hoteles', setHoteles);
    cargar('hoteles/aleatorios', setAleatorios);
    cargar('categorias', setCategorias);
    cargar('caracteristicas', setCaracteristicas);
    cargar('reservas', setReservas);
    cargar('valoraciones/resumen', setResumenes);
  }, []);

  // para que funcionen los botones de atras y adelante del navegador
  useEffect(() => {
    const alCambiarUrl = () => setCurrentView(enRutaAdmin() ? 'admin' : 'home');
    window.addEventListener('popstate', alCambiarUrl);
    return () => window.removeEventListener('popstate', alCambiarUrl);
  }, []);

  // cambia de pantalla y ajusta la url (solo el panel de admin tiene url propia)
  const irA = (vista) => {
    setCurrentView(vista);
    if (enRutaAdmin() !== (vista === 'admin')) {
      window.history.pushState(null, '', vista === 'admin' ? RUTA_ADMIN : '/');
    }
  };

  const irAlInicio = () => {
    setFiltros(FILTROS_VACIOS);
    setSelectedHotel(null);
    irA('home');
  };

  const verDetalle = (hotel) => {
    setSelectedHotel(hotel);
    irA('detail');
  };

  const abrirLogin = (obligatorio = false) => {
    setLoginObligatorio(obligatorio);
    setIsLoginOpen(true);
  };

  const cerrarLogin = () => {
    setIsLoginOpen(false);
    setLoginObligatorio(false);
  };

  // US#24: favoritos solo si esta logueado
  const toggleFavorito = (e, hotelId) => {
    e.stopPropagation();
    if (!usuarioLogueado) {
      alert('Iniciá sesión para guardar tus alojamientos favoritos en tu cuenta.');
      abrirLogin();
      return;
    }
    alternarFavorito(hotelId);
  };

  // el panel admin ya guardo en el servidor, aca solo se actualizan las listas
  const handleHotelCreated = (nuevo) => {
    setHoteles((prev) => [nuevo, ...prev]);
    setAleatorios((prev) => [nuevo, ...prev]);
  };

  const handleHotelUpdated = (editado) => {
    setHoteles((prev) => prev.map((h) => (h.id === editado.id ? editado : h)));
    setAleatorios((prev) => prev.map((h) => (h.id === editado.id ? editado : h)));
  };

  const handleHotelDeleted = (id) => {
    setHoteles((prev) => prev.filter((h) => h.id !== id));
    setAleatorios((prev) => prev.filter((h) => h.id !== id));
  };

  const esAdmin = usuarioLogueado?.rol === 'ADMIN';

  let contenido;

  if (currentView === 'admin') {
    contenido = esAdmin ? (
      <AdminPanel
        hoteles={hoteles}
        onOpenModal={() => { setHotelAEditar(null); setIsModalOpen(true); }}
        onEditHotel={(hotel) => { setHotelAEditar(hotel); setIsModalOpen(true); }}
        onDeleteHotel={handleHotelDeleted}
        onBack={irAlInicio}
        darkMode={darkMode}
      />
    ) : (
      <div className="acceso-restringido">
        <h2>Acceso restringido</h2>
        <p>Tenés que iniciar sesión como administrador para entrar a esta sección.</p>
        <button className="back-btn-clean" onClick={irAlInicio}>Volver al inicio</button>
      </div>
    );
  } else if (currentView === 'favorites') {
    contenido = (
      <FavoritesView
        hoteles={hoteles}
        favoritos={favoritos}
        resumenes={resumenes}
        onToggleFavorito={toggleFavorito}
        onSelectHotel={verDetalle}
        onBack={irAlInicio}
        darkMode={darkMode}
      />
    );
  } else if (currentView === 'bookings') {
    contenido = (
      <UserBookings
        usuario={usuarioLogueado}
        onBack={irAlInicio}
        onSelectHotel={verDetalle}
        darkMode={darkMode}
      />
    );
  } else if (currentView === 'booking-process') {
    contenido = (
      <BookingPage
        hotel={selectedHotel}
        usuario={usuarioLogueado}
        darkMode={darkMode}
        onBack={() => irA('detail')}
        onReservaExitosa={() => { cargar('reservas', setReservas); irA('bookings'); }}
      />
    );
  } else if (currentView === 'detail') {
    contenido = (
      <HotelDetail
        hotel={selectedHotel}
        usuarioLogueado={usuarioLogueado}
        darkMode={darkMode}
        onBack={irAlInicio}
        onIniciarReserva={() => irA('booking-process')}
        onRequireLogin={() => abrirLogin(true)}
        onNuevaValoracion={() => cargar('valoraciones/resumen', setResumenes)}
      />
    );
  } else {
    contenido = (
      <>
        {esAdmin && (
          <div className="admin-bar">
            <span className="admin-title">Panel de Administración</span>
            <button className="btn-alta" onClick={() => irA('admin')}>Gestionar Sitio</button>
          </div>
        )}
        <Home
          hoteles={hoteles}
          aleatorios={aleatorios}
          categorias={categorias}
          caracteristicas={caracteristicas}
          reservas={reservas}
          favoritos={favoritos}
          resumenes={resumenes}
          filtros={filtros}
          setFiltros={setFiltros}
          onLimpiar={() => setFiltros(FILTROS_VACIOS)}
          onToggleFavorito={toggleFavorito}
          onSelectHotel={verDetalle}
          darkMode={darkMode}
        />
      </>
    );
  }

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenLogin={() => abrirLogin()}
        usuarioLogueado={usuarioLogueado}
        onLogout={() => {
          logoutUser();
          setUsuarioLogueado(null);
          irA('home');
        }}
        onGoHome={irAlInicio}
        onOpenFavorites={() => irA('favorites')}
        cantidadFavoritos={favoritos.length}
        onOpenBookings={() => irA('bookings')}
        onOpenAdminPanel={() => irA('admin')}
      />

      <main className="main-content">{contenido}</main>

      <AdminHotelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onHotelCreated={handleHotelCreated}
        onHotelUpdated={handleHotelUpdated}
        hotelAEditar={hotelAEditar}
        darkMode={darkMode}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={setUsuarioLogueado}
        darkMode={darkMode}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={cerrarLogin}
        onLoginSuccess={setUsuarioLogueado}
        darkMode={darkMode}
        mensajeObligatorio={loginObligatorio}
      />

      <WhatsAppButton
        hotelNombre={['detail', 'booking-process'].includes(currentView) ? selectedHotel?.nombre : undefined}
      />
      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;
