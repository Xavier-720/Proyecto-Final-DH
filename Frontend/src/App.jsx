import { useEffect } from 'react';
import { Routes, Route, useLocation, useMatch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import RutaProtegida from './components/RutaProtegida';
import AdminMenu from './components/admin/AdminMenu';
import ListaCategorias from './components/admin/ListaCategorias';
import ListaCaracteristicas from './components/admin/ListaCaracteristicas';
import ListaUsuarios from './components/admin/ListaUsuarios';
import Home from './pages/Home';
import HotelDetail from './pages/HotelDetail';
import BookingPage from './pages/BookingPage';
import UserBookings from './pages/UserBookings';
import Favoritos from './pages/Favoritos';
import AdminPanel from './pages/AdminPanel';
import AdminProductos from './pages/AdminProductos';
import NotFound from './pages/NotFound';
import useAuth from './hooks/useAuth';
import './App.css';

function App() {
  const { loginAbierto, registroAbierto } = useAuth();
  const { pathname } = useLocation();

  // en las pantallas de un hotel, el botón de WhatsApp lo muestra la propia pantalla (con el teléfono del hotel)
  const enPantallaDeHotel = useMatch('/hoteles/:id/*');

  // al cambiar de pantalla se vuelve arriba de todo
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hoteles/:id" element={<HotelDetail />} />

          {/* rutas que necesitan sesión iniciada */}
          <Route element={<RutaProtegida />}>
            <Route path="/hoteles/:id/reservar" element={<BookingPage />} />
            <Route path="/mis-reservas" element={<UserBookings />} />
            <Route path="/favoritos" element={<Favoritos />} />
          </Route>

          {/* rutas solo para administradores (US#9) */}
          <Route element={<RutaProtegida soloAdmin />}>
            <Route path="/admin" element={<AdminPanel />}>
              <Route index element={<AdminMenu />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="categorias" element={<ListaCategorias />} />
              <Route path="caracteristicas" element={<ListaCaracteristicas />} />
              <Route path="usuarios" element={<ListaUsuarios />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {loginAbierto && <LoginModal />}
      {registroAbierto && <RegisterModal />}

      {!enPantallaDeHotel && <WhatsAppButton />}
      <Footer />
    </div>
  );
}

export default App;
